import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/auth"
import { validateEmail, validatePassword, sanitizeInput, logSecurityEvent, getClientIP } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone } = body

    // Input validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: "Password requirements not met", details: passwordValidation.errors },
        { status: 400 },
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeInput(email.toLowerCase()),
      password,
      firstName: sanitizeInput(firstName),
      lastName: sanitizeInput(lastName),
      phone: phone ? sanitizeInput(phone) : undefined,
    }

    // Create user
    const user = await createUser(sanitizedData)

    // Log successful registration
    logSecurityEvent({
      type: "auth_success",
      userId: user.id,
      ip: getClientIP(request),
      userAgent: request.headers.get("user-agent") || undefined,
      details: { action: "register" },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)

    // Log failed registration
    logSecurityEvent({
      type: "auth_failure",
      ip: getClientIP(request),
      userAgent: request.headers.get("user-agent") || undefined,
      details: { action: "register", error: error instanceof Error ? error.message : "Unknown error" },
    })

    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 500 })
  }
}
