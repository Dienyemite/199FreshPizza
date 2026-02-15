"use client"

import { useState } from "react"
import { useCart } from "../context/cart-context"
import { Check } from "lucide-react"

export default function PromotionalBanner() {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleOrderSpecial = () => {
    try {
      // Add the special item from the menu to cart
      addItem({
        id: 301, // Same ID as in menu-modal.tsx
        name: "Regular 18 inch sized 2 Cheese Slices w/ 1 Can of Soda or Water",
        description: "Two cheese slices with your choice of canned soda or water",
        price: 5.0,
        image:
          "https://images.unsplash.com/photo-1544029048-b78834e2c277?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      })

      // Show success state temporarily
      setIsAdded(true)
      setTimeout(() => {
        setIsAdded(false)
      }, 3000)
    } catch (error) {
      console.error("Error adding special to cart:", error)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-cocoa-bean to-walnut">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="relative max-w-4xl w-full">
            <img
              src="/images/pizza-special-banner.png"
              alt="$1.99 Fresh Pizza Special - 2 slices of pizza & 1 can of soda or water for $5.00"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
            {/* Optional overlay for better integration */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Call to action below the banner */}
        <div className="text-center mt-8">
          <button
            onClick={handleOrderSpecial}
            className={`transition-all duration-300 font-bold py-3 px-8 rounded-lg text-lg shadow-lg ${
              isAdded ? "bg-siam hover:bg-siam text-albescent-white" : "bg-anzac hover:bg-raw-sienna text-black-olive"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="inline w-5 h-5 mr-2" />
                Added to Cart!
              </>
            ) : (
              "Order This Special!"
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
