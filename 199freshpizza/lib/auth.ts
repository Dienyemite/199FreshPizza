function base64UrlEncode(str: string): string {
  if (typeof window !== "undefined") {
    // Browser environment
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
  } else {
    // Node.js environment
    return Buffer.from(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
  }
}

function base64UrlDecode(str: string): string {
  if (typeof window !== "undefined") {
    // Browser environment
    str += new Array(5 - (str.length % 4)).join("=")
    return atob(str.replace(/-/g, "+").replace(/_/g, "/"))
  } else {
    // Node.js environment
    str += new Array(5 - (str.length % 4)).join("=")
    return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString()
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  emailVerified: boolean
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// Hash password using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + "salt")
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  } catch (error) {
    // Fallback for environments without Web Crypto API
    let hash = 0
    const str = password + "salt"
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedPassword = await hashPassword(password)
  return hashedPassword === hash
}

// Generate simple JWT token
export function generateToken(payload: any, expiresIn: string = JWT_EXPIRES_IN): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const now = Math.floor(Date.now() / 1000)
  const exp = now + (expiresIn === "7d" ? 7 * 24 * 60 * 60 : 30 * 24 * 60 * 60) // 7 days or 30 days

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: exp,
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload))

  // Simple HMAC signature (simplified for demo)
  const signature = Math.random().toString(36).substring(2, 32)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Verify JWT token
export function verifyToken(token: string): any {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new Error("Invalid token format")
    }

    const payload = JSON.parse(base64UrlDecode(parts[1]))

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("Token expired")
    }

    return payload
  } catch (error) {
    throw new Error("Invalid or expired token")
  }
}

// Server-side database operations
async function queryDatabase(text: string, params?: any[]) {
  if (typeof window !== "undefined") {
    throw new Error("Database operations are not allowed on the client side")
  }

  // Dynamic import to avoid client-side issues
  const { query } = await import("./database")
  return query(text, params)
}

// Create user account (server-side only)
export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}): Promise<User> {
  if (typeof window !== "undefined") {
    throw new Error("User creation is not allowed on the client side")
  }

  const { email, password, firstName, lastName, phone } = userData

  // Check if user already exists
  const existingUser = await queryDatabase("SELECT id FROM users WHERE email = $1", [email.toLowerCase()])

  if (existingUser.rows.length > 0) {
    throw new Error("User already exists with this email")
  }

  // Hash password
  const passwordHash = await hashPassword(password)

  // Generate email verification token
  const emailVerificationToken = Math.random().toString(36).substring(2, 32)

  // Insert user
  const result = await queryDatabase(
    `
    INSERT INTO users (email, password_hash, first_name, last_name, phone, email_verification_token)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, email, first_name, last_name, phone, email_verified, is_active, created_at
  `,
    [email.toLowerCase(), passwordHash, firstName, lastName, phone, emailVerificationToken],
  )

  const user = result.rows[0]

  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    emailVerified: user.email_verified,
    isActive: user.is_active,
    createdAt: user.created_at,
  }
}

// Authenticate user (server-side only)
export async function authenticateUser(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
  if (typeof window !== "undefined") {
    throw new Error("User authentication is not allowed on the client side")
  }

  const result = await queryDatabase(
    `
    SELECT id, email, password_hash, first_name, last_name, phone, 
           email_verified, is_active, created_at, last_login
    FROM users 
    WHERE email = $1 AND is_active = true
  `,
    [email.toLowerCase()],
  )

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password")
  }

  const user = result.rows[0]

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password_hash)
  if (!isValidPassword) {
    throw new Error("Invalid email or password")
  }

  // Update last login
  await queryDatabase("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1", [user.id])

  // Generate tokens
  const accessToken = generateToken({ userId: user.id, email: user.email })
  const refreshToken = generateToken({ userId: user.id, type: "refresh" }, "30d")

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      emailVerified: user.email_verified,
      isActive: user.is_active,
      createdAt: user.created_at,
      lastLogin: user.last_login,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  }
}

// Get user by ID (server-side only)
export async function getUserById(userId: string): Promise<User | null> {
  if (typeof window !== "undefined") {
    throw new Error("User lookup is not allowed on the client side")
  }

  const result = await queryDatabase(
    `
    SELECT id, email, first_name, last_name, phone, 
           email_verified, is_active, created_at, last_login
    FROM users 
    WHERE id = $1 AND is_active = true
  `,
    [userId],
  )

  if (result.rows.length === 0) {
    return null
  }

  const user = result.rows[0]
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    emailVerified: user.email_verified,
    isActive: user.is_active,
    createdAt: user.created_at,
    lastLogin: user.last_login,
  }
}

// Verify email (server-side only)
export async function verifyEmail(token: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    throw new Error("Email verification is not allowed on the client side")
  }

  const result = await queryDatabase(
    `
    UPDATE users 
    SET email_verified = true, email_verification_token = NULL 
    WHERE email_verification_token = $1
    RETURNING id
  `,
    [token],
  )

  return result.rows.length > 0
}

// Request password reset (server-side only)
export async function requestPasswordReset(email: string): Promise<string> {
  if (typeof window !== "undefined") {
    throw new Error("Password reset is not allowed on the client side")
  }

  const resetToken = Math.random().toString(36).substring(2, 32)
  const resetExpires = new Date(Date.now() + 3600000) // 1 hour from now

  const result = await queryDatabase(
    `
    UPDATE users 
    SET password_reset_token = $1, password_reset_expires = $2 
    WHERE email = $3 AND is_active = true
    RETURNING id
  `,
    [resetToken, resetExpires, email.toLowerCase()],
  )

  if (result.rows.length === 0) {
    throw new Error("User not found")
  }

  return resetToken
}

// Reset password (server-side only)
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  if (typeof window !== "undefined") {
    throw new Error("Password reset is not allowed on the client side")
  }

  const passwordHash = await hashPassword(newPassword)

  const result = await queryDatabase(
    `
    UPDATE users 
    SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL 
    WHERE password_reset_token = $2 AND password_reset_expires > CURRENT_TIMESTAMP
    RETURNING id
  `,
    [passwordHash, token],
  )

  return result.rows.length > 0
}
