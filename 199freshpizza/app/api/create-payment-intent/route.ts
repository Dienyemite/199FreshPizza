import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Initialize Stripe with better error handling
let stripe: Stripe | null = null

try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    })
  }
} catch (error) {
  console.error("Failed to initialize Stripe:", error)
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is initialized
    if (!stripe) {
      return NextResponse.json({ error: "Payment system is not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { amount, currency = "usd", metadata = {} } = body

    // Validate request body
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // Validate amount
    if (!amount || typeof amount !== "number" || amount < 0.5) {
      return NextResponse.json({ error: "Amount must be at least $0.50" }, { status: 400 })
    }

    // Create payment intent with error handling
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description: `Order from $1.99 FRESH PIZZA - Lyndhurst, NJ`,
      metadata: {
        restaurant: "$1.99 FRESH PIZZA",
        location: "Lyndhurst, NJ",
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    if (!paymentIntent.client_secret) {
      return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)

    // Handle specific Stripe errors
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
