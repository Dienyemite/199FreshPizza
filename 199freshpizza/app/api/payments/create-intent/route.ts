import { type NextRequest, NextResponse } from "next/server"
import { createPaymentIntent } from "@/lib/payment"
import { getClientIP, logSecurityEvent } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "usd", metadata = {} } = body

    // Validate amount
    if (!amount || typeof amount !== "number" || amount < 0.5) {
      return NextResponse.json({ error: "Amount must be at least $0.50" }, { status: 400 })
    }

    // Add security metadata
    const securityMetadata = {
      ...metadata,
      customerIP: getClientIP(request),
      userAgent: request.headers.get("user-agent") || "unknown",
      timestamp: new Date().toISOString(),
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      Math.round(amount * 100), // Convert to cents
      currency,
      securityMetadata,
    )

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)

    // Log payment creation failure
    logSecurityEvent({
      type: "payment_attempt",
      ip: getClientIP(request),
      details: {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
    })

    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
