"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ShoppingCart } from "lucide-react"
import { useCart } from "../context/cart-context"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { state } = useCart()
  const router = useRouter()

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#about" },
    { name: "Shop", href: "#menu" },
    { name: "Contact", href: "#contact" },
  ]

  const handleCartClick = () => {
    router.push("/cart")
  }

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      // Scroll to section if on home page
      if (window.location.pathname === "/") {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        // Navigate to home page with hash
        router.push(`/${href}`)
      }
    } else {
      router.push(href)
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-cocoa-bean text-albescent-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-10 h-10 bg-albescent-white rounded-full flex items-center justify-center">
              <span className="text-cocoa-bean font-bold text-xl">🍕</span>
            </div>
            <span className="text-2xl font-bold">$1.99 FRESH PIZZA</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="hover:text-anzac transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-albescent-white hover:text-anzac hover:bg-walnut relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">Cart</span>
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-anzac text-black-olive text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                  {state.itemCount}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-walnut">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="py-2 px-4 hover:bg-walnut rounded transition-colors duration-200 text-left"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
