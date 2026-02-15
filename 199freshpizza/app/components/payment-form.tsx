"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Shield } from "lucide-react"

// Load Stripe with error handling
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface PaymentFormProps {
  amount: number
  onSuccess: () => void
  onCancel: () => void
  orderDetails: {
    items: any[]
    itemCount: number
  }
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
}

function CheckoutForm({ amount, onSuccess, onCancel, orderDetails }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string>("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  })

  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        if (!amount || amount <= 0) {
          setError("Invalid order amount")
          return
        }

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            metadata: {
              itemCount: orderDetails?.itemCount || 0,
              orderType: "pizza_delivery",
            },
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          return
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setError("Failed to initialize payment")
        }
      } catch (err) {
        console.error("Payment intent creation error:", err)
        setError("Failed to initialize payment. Please try again.")
      }
    }

    if (amount > 0) {
      createPaymentIntent()
    }
  }, [amount, orderDetails])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      setError("Payment system not ready. Please try again.")
      return
    }

    // Validate required fields
    if (
      !customerInfo.name ||
      !customerInfo.email ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.city ||
      !customerInfo.zipCode
    ) {
      setError("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        setError("Card element not found")
        setIsProcessing(false)
        return
      }

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name || "",
            email: customerInfo.email || "",
            phone: customerInfo.phone || "",
            address: {
              line1: customerInfo.address || "",
              city: customerInfo.city || "",
              postal_code: customerInfo.zipCode || "",
              country: "US",
            },
          },
        },
      })

      if (stripeError) {
        setError(stripeError.message || "Payment failed")
        setIsProcessing(false)
      } else if (paymentIntent?.status === "succeeded") {
        // Payment successful
        onSuccess()
      } else {
        setError("Payment was not completed")
        setIsProcessing(false)
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  // Show loading state while Stripe is loading
  if (!stripe || !elements) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-venus/20">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-siam" />
            <p className="text-ferra">Loading payment system...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-venus/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-cocoa-bean flex items-center">
            <CreditCard className="w-6 h-6 mr-2" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cocoa-bean">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cocoa-bean mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cocoa-bean mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cocoa-bean mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam"
                    placeholder="(201) 555-0123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cocoa-bean mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={customerInfo.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    className="w-full px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam"
                    placeholder="07071"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-cocoa-bean mb-2">Delivery Address *</label>
                <input
                  type="text"
                  required
                  value={customerInfo.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-cocoa-bean mb-2">City *</label>
                <input
                  type="text"
                  required
                  value={customerInfo.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-3 py-2 border border-venus/30 rounded-md focus:outline-none focus:ring-2 focus:ring-siam focus:border-siam"
                  placeholder="Lyndhurst"
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cocoa-bean">Payment Details</h3>
              <div className="p-4 border border-venus/30 rounded-md bg-gray-50">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
              <div className="flex items-center space-x-2 text-sm text-ferra">
                <Shield className="w-4 h-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>

            {/* Accepted Cards */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-cocoa-bean">We Accept:</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Visa</span>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Mastercard</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Discover</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">American Express</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">Debit Cards</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-albescent-white p-4 rounded-lg">
              <h4 className="font-semibold text-cocoa-bean mb-2">Order Summary</h4>
              <div className="flex justify-between text-sm text-ferra mb-1">
                <span>{orderDetails?.itemCount || 0} items</span>
                <span>${((amount || 0) - (amount || 0) * 0.08875 - ((amount || 0) > 25 ? 0 : 2.99)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-ferra mb-1">
                <span>Tax</span>
                <span>${((amount || 0) * 0.08875).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-ferra mb-2">
                <span>Delivery</span>
                <span>{(amount || 0) > 25 ? "FREE" : "$2.99"}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-cocoa-bean border-t border-venus/30 pt-2">
                <span>Total</span>
                <span>${(amount || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-venus text-ferra hover:bg-venus hover:text-white bg-transparent"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!stripe || isProcessing || !clientSecret}
                className="flex-1 bg-siam hover:bg-black-olive text-albescent-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ${(amount || 0).toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentForm(props: PaymentFormProps) {
  // Add error boundary for Stripe Elements
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-venus/20">
          <CardContent className="p-8 text-center">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Payment system is not configured. Please contact support.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
