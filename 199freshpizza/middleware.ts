import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define protected routes
const protectedRoutes = ["/admin", "/dashboard", "/profile"]
const authRoutes = ["/login", "/register"]

// Simple JWT verification for Edge Runtime
function verifyToken(token: string): any {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new Error("Invalid token format")
    }

    // Base64 URL decode
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("Token expired")
    }

    return payload
  } catch (error) {
    throw new Error("Invalid or expired token")
  }
}

// Simple rate limiting for Edge Runtime
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(
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

function getClientIP(request: NextRequest): string {
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

function logSecurityEvent(event: {
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
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("accessToken")?.value
  const ip = getClientIP(request)

  // Security headers
  const response = NextResponse.next()

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // HSTS header for production
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const rateLimit = checkRateLimit(ip, 100, 15 * 60 * 1000) // 100 requests per 15 minutes

    response.headers.set("X-RateLimit-Limit", "100")
    response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
    response.headers.set("X-RateLimit-Reset", new Date(rateLimit.resetTime).toISOString())

    if (!rateLimit.allowed) {
      logSecurityEvent({
        type: "suspicious_activity",
        ip,
        userAgent: request.headers.get("user-agent") || undefined,
        details: {
          action: "rate_limit_exceeded",
          path: pathname,
        },
      })

      return new NextResponse("Too Many Requests", { status: 429 })
    }

    // Enhanced rate limiting for auth endpoints
    if (pathname.startsWith("/api/auth/")) {
      const authRateLimit = checkRateLimit(`auth:${ip}`, 5, 15 * 60 * 1000) // 5 requests per 15 minutes

      if (!authRateLimit.allowed) {
        logSecurityEvent({
          type: "suspicious_activity",
          ip,
          userAgent: request.headers.get("user-agent") || undefined,
          details: {
            action: "auth_rate_limit_exceeded",
            path: pathname,
          },
        })

        return new NextResponse("Too Many Authentication Attempts", { status: 429 })
      }
    }

    // Enhanced rate limiting for payment endpoints
    if (pathname.startsWith("/api/payments/")) {
      const paymentRateLimit = checkRateLimit(`payment:${ip}`, 10, 60 * 60 * 1000) // 10 requests per hour

      if (!paymentRateLimit.allowed) {
        logSecurityEvent({
          type: "suspicious_activity",
          ip,
          userAgent: request.headers.get("user-agent") || undefined,
          details: {
            action: "payment_rate_limit_exceeded",
            path: pathname,
          },
        })

        return new NextResponse("Too Many Payment Attempts", { status: 429 })
      }
    }
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      // Log unauthorized access attempt
      logSecurityEvent({
        type: "suspicious_activity",
        ip,
        userAgent: request.headers.get("user-agent") || undefined,
        details: {
          action: "unauthorized_access_attempt",
          path: pathname,
        },
      })

      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      // Verify token
      const decoded = verifyToken(token)

      // Add user info to headers for API routes
      response.headers.set("X-User-ID", decoded.userId)
      response.headers.set("X-User-Email", decoded.email)
    } catch (error) {
      // Invalid token, redirect to login
      logSecurityEvent({
        type: "auth_failure",
        ip,
        details: {
          action: "invalid_token",
          path: pathname,
        },
      })

      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    try {
      verifyToken(token)
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch (error) {
      // Token is invalid, allow access to auth pages
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
