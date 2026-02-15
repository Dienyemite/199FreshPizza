import type { NextRequest } from "next/server"

// Generate secure random token
export function generateSecureToken(): string {
  if (typeof window !== "undefined") {
    // Browser environment
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  } else {
    // Node.js environment - use Web Crypto API instead of node:crypto
    try {
      const array = new Uint8Array(32)
      crypto.getRandomValues(array)
      return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
    } catch (error) {
      // Fallback for environments without crypto
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
  }
}

// Input validation and sanitization
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/
  return phoneRegex.test(phone)
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

// CSRF protection
export function generateCSRFToken(): string {
  return generateSecureToken()
}

export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  // Simple comparison for Edge Runtime compatibility
  return token === sessionToken
}

// IP address extraction
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "unknown"
}

// Request logging for security audit
export function logSecurityEvent(event: {
  type: "auth_attempt" | "auth_success" | "auth_failure" | "payment_attempt" | "suspicious_activity"
  userId?: string
  ip: string
  userAgent?: string
  details?: any
}) {
  console.log(`[SECURITY] ${event.type}:`, {
    timestamp: new Date().toISOString(),
    ...event,
  })

  // In production, send to security monitoring service
  // await sendToSecurityMonitoring(event)
}

// PCI DSS compliance helpers
export function maskCreditCard(cardNumber: string): string {
  return cardNumber.replace(/\d(?=\d{4})/g, "*")
}

export function validateCreditCard(cardNumber: string): boolean {
  // Luhn algorithm implementation
  const digits = cardNumber.replace(/\D/g, "")
  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Simple rate limiting for Edge Runtime
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    // Reset or create new record
    const resetTime = now + windowMs
    rateLimitMap.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: limit - 1, resetTime }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime }
}

// Clean up old rate limit records periodically
export function cleanupRateLimit() {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}
