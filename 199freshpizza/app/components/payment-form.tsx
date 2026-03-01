"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Shield } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

const appearance = {
  theme: "stripe" as const,
  variables: {
    colorPrimary: "#657154",
    colorBackground: "#ffffff",
    colorText: "#4a2427",
    colorDanger: "#df1b41",
    fontFamily: "system-ui, sans-serif",
    borderRadius: "6px",
  },
}

interface PaymentFormProps {
  amount: number
  onSuccess: (email: string) => void
  onCancel: () => void
  orderDetails: {
    items: any[]
    itemCount: number
  }
}

function CheckoutForm({ amount, onSuccess, onCancel, orderDetails }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setError("Payment system not ready. Please try again.")
      return
    }

    if (
      !customerInfo.name ||
      !email ||
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
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/cart`,
          receipt_email: email,
          payment_method_data: {
            billing_details: {
              name: customerInfo.name,
              email: email,
              phone: customerInfo.phone,
              address: {
                line1: customerInfo.address,
                city: customerInfo.city,
                postal_code: customerInfo.zipCode,
                country: "US",
              },
            },
          },
        },
        redirect: "if_required",
      })

      if (stripeError) {
        setError(stripeError.message || "Payment failed")
        setIsProcessing(false)
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess(email)
      } else {
        setError("Payment was not completed. Please try again.")
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
    if (error) setError(null)
  }

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
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(null) }}
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

            {/* Stripe Payment Element */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-cocoa-bean">Payment Details</h3>
              <div className="p-4 border border-venus/30 rounded-md bg-white">
                <PaymentElement
                  options={{
                    layout: "tabs",
                  }}
                />
              </div>
              <div className="flex items-center space-x-2 text-sm text-ferra">
                <Shield className="w-4 h-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-albescent-white p-4 rounded-lg">
              <h4 className="font-semibold text-cocoa-bean mb-2">Order Summary</h4>
              <div className="flex justify-between text-sm text-ferra mb-1">
                <span>{orderDetails?.itemCount || 0} items</span>
                <span>${((amount || 0) / 1.06625).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-ferra mb-2">
                <span>Tax (6.625%)</span>
                <span>${((amount || 0) - (amount || 0) / 1.06625).toFixed(2)}</span>
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
                disabled={!stripe || isProcessing}
                className="flex-1 bg-siam hover:bg-black-olive text-white"
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
  const [clientSecret, setClientSecret] = useState("")
  const [initError, setInitError] = useState<string | null>(null)

  useEffect(() => {
    if (!props.amount || props.amount <= 0) return

    const createIntent = async () => {
      try {
        const itemNames =
          props.orderDetails?.items
            ?.map((item: any) => `${item.name} x${item.quantity}`)
            .join(", ")
            .slice(0, 500) || ""

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: props.amount,
            metadata: {
              itemCount: props.orderDetails?.itemCount || 0,
              items: itemNames,
              orderType: "pizza_order",
              restaurant: "$1.99 FRESH PIZZA",
              location: "Lyndhurst, NJ",
            },
          }),
        })

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        if (data.error) {
          setInitError(data.error)
        } else if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setInitError("Failed to initialize payment")
        }
      } catch (err) {
        console.error("Payment intent creation error:", err)
        setInitError("Failed to initialize payment. Please try again.")
      }
    }

    createIntent()
  }, [props.amount, props.orderDetails])

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

  if (initError) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-venus/20">
          <CardContent className="p-8 text-center">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{initError}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-venus/20">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-siam" />
            <p className="text-ferra">Preparing your checkout...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
