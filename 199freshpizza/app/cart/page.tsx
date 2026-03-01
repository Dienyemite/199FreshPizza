"use client"

import { useCart } from "../context/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import dynamic from "next/dynamic"
import PaymentSuccess from "../components/payment-success"

// Dynamically import PaymentForm to avoid SSR issues
const PaymentForm = dynamic(() => import("../components/payment-form"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-albescent-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-siam mx-auto mb-4"></div>
        <p className="text-ferra">Loading payment system...</p>
      </div>
    </div>
  ),
})

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const [showPayment, setShowPayment] = useState(false)
  const [showCheckoutOptions, setShowCheckoutOptions] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  // Safe calculation with fallbacks and validation
  const safeTotal = typeof state?.total === "number" && !isNaN(state.total) ? state.total : 0
  const tax = safeTotal * 0.06625 // NJ state sales tax rate
  const finalTotal = safeTotal + tax

  const handleCheckout = () => {
    // Validate cart before proceeding
    if (!state?.items || state.items.length === 0) {
      alert("Your cart is empty. Please add items before checkout.")
      return
    }

    if (finalTotal < 0.5) {
      alert("Order total must be at least $0.50")
      return
    }

    setShowCheckoutOptions(true)
  }

  const handlePaymentSuccess = (customerEmail: string) => {
    try {
      // Generate order number
      const orderNumber = `PZ${Date.now().toString().slice(-6)}`
      const estimatedDelivery = new Date(Date.now() + 35 * 60 * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })

      setOrderDetails({
        orderNumber,
        amount: finalTotal,
        customerEmail,
        estimatedDelivery,
      })

      // Clear cart and show success
      clearCart()
      setShowPayment(false)
      setPaymentSuccess(true)
    } catch (error) {
      console.error("Error processing payment success:", error)
      alert("There was an error processing your order. Please contact support.")
    }
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setShowCheckoutOptions(true)
  }

  // Show payment success page
  if (paymentSuccess && orderDetails) {
    return <PaymentSuccess {...orderDetails} />
  }

  // Show checkout method selection
  if (showCheckoutOptions && !showPayment) {
    const platforms = [
      {
        id: "doordash",
        name: "DoorDash",
        emoji: "🚗",
        bg: "bg-red-500 hover:bg-red-600",
        fee: "$2.99",
        time: "25–35 min",
        url: "https://www.doordash.com/store/$1.99-fresh-pizza-lyndhurst-32783939/73652746/?cursor=eyJzZWFyY2hfaXRlbV9jYXJvdXNlbF9jdXJzb3IiOnsicXVlcnkiOiIkMS45OSBGcmVzaCBQaXp6YSIsIml0ZW1faWRzIjpbXSwic2VhcmNoX3Rlcm0iOiIxOTkgZnJlc2ggcGl6emEiLCJ2ZXJ0aWNhbF9pZCI6LTk5OSwidmVydGljYWxfbmFtZSI6ImFsbCIsInF1ZXJ5X2ludGVudCI6IlNUT1JFX1JYIn0sInN0b3JlX3ByaW1hcnlfdmVydGljYWxfaWRzIjpbMSw0LDEwMDMzM119&pickup=false",
      },
      {
        id: "grubhub",
        name: "Grubhub",
        emoji: "🥡",
        bg: "bg-orange-500 hover:bg-orange-600",
        fee: "$3.49",
        time: "30–40 min",
        url: "https://www.grubhub.com/restaurant/199-fresh-pizza-341-ridge-rd-lyndhurst/11840792",
      },
      {
        id: "seamless",
        name: "Seamless",
        emoji: "🍽️",
        bg: "bg-green-600 hover:bg-green-700",
        fee: "$1.99",
        time: "20–30 min",
        url: "https://www.seamless.com/menu/199-fresh-pizza-341-ridge-rd-lyndhurst/11840792?utm_source=google&utm_medium=organic&utm_campaign=place-action-link&pickup=true&rwg_token=ACgRB3faUrhiKxwYYTh4SoOKIKwVFGCg4sZj2MLDstwIFQuoCVtP5UV3KFVWxwOI85VS_mUJRrCrvlAvJLt-j0NAHIx0fYCg7A%3D%3D",
      },
    ]

    return (
      <div className="min-h-screen bg-albescent-white py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCheckoutOptions(false)}
              className="text-ferra hover:text-cocoa-bean hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold text-cocoa-bean">Checkout</h1>
          </div>

          {/* Order total reminder */}
          <div className="bg-white rounded-lg border border-venus/20 p-4 mb-6 flex justify-between items-center">
            <span className="text-ferra">{state?.itemCount || 0} items</span>
            <span className="text-xl font-bold text-cocoa-bean">${finalTotal.toFixed(2)}</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-cocoa-bean">How would you like to order?</h2>

            {/* Website checkout — primary option */}
            <button
              onClick={() => { setShowCheckoutOptions(false); setShowPayment(true) }}
              className="w-full bg-siam hover:bg-black-olive text-white rounded-lg p-5 text-left transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                  💳
                </div>
                <div>
                  <p className="font-bold text-lg">Pay on Website</p>
                  <p className="text-white/80 text-sm">Secure checkout · No delivery fee</p>
                </div>
              </div>
              <span className="text-white/60 text-sm font-medium">Recommended</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <hr className="flex-1 border-venus/30" />
              <span className="text-sm text-ferra">or order through a delivery app</span>
              <hr className="flex-1 border-venus/30" />
            </div>

            {/* Third-party platforms */}
            {platforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full ${platform.bg} text-white rounded-lg p-5 flex items-center justify-between transition-colors block`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                    {platform.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{platform.name}</p>
                    <p className="text-white/80 text-sm">{platform.time} · {platform.fee} delivery fee</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-white/70 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show payment form
  if (showPayment) {
    return (
      <div className="min-h-screen bg-albescent-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePaymentCancel}
              className="text-ferra hover:text-cocoa-bean hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
            <h1 className="text-3xl font-bold text-cocoa-bean">Secure Checkout</h1>
          </div>

          <PaymentForm
            amount={finalTotal}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
            orderDetails={{
              items: state?.items || [],
              itemCount: state?.itemCount || 0,
            }}
          />
        </div>
      </div>
    )
  }

  // Empty cart state
  if (!state?.items || state.items.length === 0) {
    return (
      <div className="min-h-screen bg-albescent-white">
        {/* Header */}
        <div className="bg-cocoa-bean text-albescent-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-albescent-white hover:text-anzac hover:bg-walnut">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Menu
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Your Cart</h1>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-24 h-24 text-venus mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-cocoa-bean mb-4">Your cart is empty</h2>
            <p className="text-ferra mb-8">Add some delicious pizzas to get started!</p>
            <Link href="/">
              <Button className="bg-siam hover:bg-black-olive text-albescent-white">Browse Menu</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-albescent-white">
      {/* Header */}
      <div className="bg-cocoa-bean text-albescent-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-albescent-white hover:text-anzac hover:bg-walnut">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Menu
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Your Cart</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-albescent-white/80">{state?.itemCount || 0} items</p>
              <p className="text-xl font-bold">${safeTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cocoa-bean">Order Items</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-raw-sienna border-raw-sienna hover:bg-raw-sienna hover:text-white bg-transparent"
              >
                Clear Cart
              </Button>
            </div>

            {state.items.map((item) => {
              const itemPrice = typeof item?.price === "number" && !isNaN(item.price) ? item.price : 0
              const itemQuantity = typeof item?.quantity === "number" && !isNaN(item.quantity) ? item.quantity : 0

              return (
                <Card key={item?.id || Math.random()} className="border-venus/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item?.image || "/placeholder.svg"}
                        alt={item?.name || "Pizza"}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.currentTarget
                          target.onerror = null // prevent infinite fallback loop
                          target.src = "/img/ChickenRanchSlice.webp"
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-cocoa-bean">{item?.name || "Unknown Item"}</h3>
                        <p className="text-sm text-ferra line-clamp-2">{item?.description || ""}</p>
                        <p className="text-lg font-bold text-raw-sienna mt-2">${itemPrice.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => item?.id && updateQuantity(item.id, itemQuantity - 1)}
                          className="h-8 w-8 p-0"
                          disabled={!item?.id}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-lg font-semibold text-cocoa-bean w-8 text-center">{itemQuantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => item?.id && updateQuantity(item.id, itemQuantity + 1)}
                          className="h-8 w-8 p-0"
                          disabled={!item?.id}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => item?.id && removeItem(item.id)}
                          className="h-8 w-8 p-0 text-raw-sienna border-raw-sienna hover:bg-raw-sienna hover:text-white ml-4"
                          disabled={!item?.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-venus/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-cocoa-bean">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-ferra">
                  <span>Subtotal</span>
                  <span>${safeTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ferra">
                  <span>Tax (6.625%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="border-venus/30" />
                <div className="flex justify-between text-lg font-bold text-cocoa-bean">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-3 pt-4">
                  <Button
                    className="w-full bg-siam hover:bg-black-olive text-albescent-white"
                    onClick={handleCheckout}
                    disabled={finalTotal < 0.5}
                  >
                    Secure Checkout
                  </Button>
                  <Link href="/">
                    <Button
                      variant="outline"
                      className="w-full border-siam text-siam hover:bg-siam hover:text-albescent-white bg-transparent"
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="pt-4 text-xs text-ferra space-y-2">
                  <p>📍 Delivery to: 341 Ridge Road, Lyndhurst, NJ</p>
                  <p>⏱️ Estimated delivery: 25-35 minutes</p>
                  <p>💳 We accept all major credit cards</p>
                  <p>🔒 Secure payment processing by Stripe</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
