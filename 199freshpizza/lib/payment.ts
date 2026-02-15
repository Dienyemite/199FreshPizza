import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
})

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}

export interface PaymentResult {
  success: boolean
  paymentIntentId?: string
  error?: string
  orderId?: string
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

async function transactionDatabase<T>(callback: (client: any) => Promise<T>): Promise<T> {
  if (typeof window !== "undefined") {
    throw new Error("Database transactions are not allowed on the client side")
  }

  // Dynamic import to avoid client-side issues
  const { transaction } = await import("./database")
  return transaction(callback)
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

// Create payment intent with enhanced security
export async function createPaymentIntent(
  amount: number,
  currency = "usd",
  metadata: Record<string, string> = {},
): Promise<PaymentIntent> {
  try {
    // Validate amount (minimum $0.50 for Stripe)
    if (amount < 50) {
      throw new Error("Amount must be at least $0.50")
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        restaurant: "$1.99 FRESH PIZZA",
        location: "Lyndhurst, NJ",
        ...metadata,
      },
      // Enable receipt emails
      receipt_email: metadata.customerEmail,
      // Set statement descriptor
      statement_descriptor: "199 FRESH PIZZA",
      statement_descriptor_suffix: "ORDER",
    })

    // Log payment intent creation (only on server)
    if (typeof window === "undefined") {
      logSecurityEvent({
        type: "payment_attempt",
        ip: metadata.customerIP || "unknown",
        details: {
          paymentIntentId: paymentIntent.id,
          amount: amount / 100,
          currency,
        },
      })
    }

    return {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret!,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw new Error("Failed to create payment intent")
  }
}

// Get payment status
export async function getPaymentStatus(paymentIntentId: string): Promise<{
  status: string
  amount: number
  currency: string
  refunded?: boolean
}> {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

  return {
    status: paymentIntent.status,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    refunded: paymentIntent.charges.data[0]?.refunded || false,
  }
}

// Webhook handler for Stripe events (server-side only)
export async function handleStripeWebhook(
  body: string,
  signature: string,
): Promise<{ success: boolean; error?: string }> {
  if (typeof window !== "undefined") {
    throw new Error("Webhook handling is not allowed on the client side")
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Update order status
        await queryDatabase(
          `
          UPDATE orders 
          SET payment_status = 'succeeded', status = 'confirmed'
          WHERE payment_intent_id = $1
        `,
          [paymentIntent.id],
        )

        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent

        // Update order status
        await queryDatabase(
          `
          UPDATE orders 
          SET payment_status = 'failed', status = 'cancelled'
          WHERE payment_intent_id = $1
        `,
          [failedPayment.id],
        )

        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Webhook error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
