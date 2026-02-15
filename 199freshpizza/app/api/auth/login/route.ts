import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"
import { validateEmail, sanitizeInput, logSecurityEvent, getClientIP } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Input validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Sanitize email
    const sanitizedEmail = sanitizeInput(email.toLowerCase())

    // Authenticate user
    const { user, tokens } = await authenticateUser(sanitizedEmail, password)

    // Log successful login
    logSecurityEvent({
      type: "auth_success",
      userId: user.id,
      ip: getClientIP(request),
      userAgent: request.headers.get("user-agent") || undefined,
      details: { action: "login" },
    })

    // Set HTTP-only cookie for refresh token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
      accessToken: tokens.accessToken,
    })

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)

    // Log failed login
    logSecurityEvent({
      type: "auth_failure",
      ip: getClientIP(request),
      userAgent: request.headers.get("user-agent") || undefined,
      details: { action: "login", error: error instanceof Error ? error.message : "Unknown error" },
    })

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
}
