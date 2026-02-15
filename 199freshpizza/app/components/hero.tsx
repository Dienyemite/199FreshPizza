"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import DeliveryServicesModal from "./delivery-services-modal"

// Import all menu item images from menu-modal.tsx
const menuImages = [
  // Pies
  "https://images.unsplash.com/photo-1747654168933-a0a0c9d78d68?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1708649360542-db4f0762bd9c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1718801594801-feba5ddcb2a4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1604917869287-3ae73c77e227?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1751026044592-1c395868257a?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1722707758294-743f78629ecd?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&h=300&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1705286324371-d6a6d9519dc2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  // Specials
  "https://images.unsplash.com/photo-1544029048-b78834e2c277?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  // Beef Patties
  "https://images.unsplash.com/photo-1587652252980-51fae498d182?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1626111740066-e595bce778f0?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  // Beverages
  "https://images.unsplash.com/photo-1667204651371-5d4a65b8b5a9?q=80&w=832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://bread-story.com/cdn/shop/files/DSC_4232_1500x.jpg?v=1683303763",
  "https://cupspops.com/wp-content/uploads/sites/8/2024/06/Bottles.jpg",
  "https://beverageuniverse.com/media/catalog/product/cache/d6b24e0b635c0897113a74c0029895da/s/n/snapple_apple.jpg",
  "https://storage.googleapis.com/images-prs-prd-c7e7986.prs.prd.v8.commerce.mi9cloud.com/product-images/zoom/00613008735159_1",
  "https://target.scene7.com/is/image/Target/GUEST_da6385d3-b2f1-4fc2-ac0b-4fdcc0779096",
]

const menuItemNames = [
  "Cheese Pie",
  "Hawaiian Pie",
  "Veggie Pie",
  "Meat Lover Pie",
  "Chicken Pie",
  "Buffalo Chicken Pie",
  "BBQ Chicken Pie",
  "Chicken Ranch Pie",
  "Supreme Pie",
  "2 Cheese Slices Special",
  "Beef Patty",
  "Beef Patty w/ Cheese",
  "Canned Soda",
  "Water",
  "Bottled Soda",
  "Snapple",
  "Arizona",
  "Small Red Bull",
]

export default function Hero() {
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === menuImages.length - 1 ? 0 : prevIndex + 1))
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handleViewMenu = () => {
    const menuSection = document.getElementById("menu")
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentImageIndex(currentImageIndex === 0 ? menuImages.length - 1 : currentImageIndex - 1)
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentImageIndex(currentImageIndex === menuImages.length - 1 ? 0 : currentImageIndex + 1)
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentImageIndex(index)
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  return (
    <>
      <section
        id="home"
        className="relative bg-gradient-to-r from-cocoa-bean to-walnut text-albescent-white py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Delicious Pizza
                <span className="block text-anzac">Taste The Difference</span>
              </h1>
              <p className="text-xl text-albescent-white/80 leading-relaxed">
                Experience the perfect blend of fresh ingredients, authentic flavors, and lightning-fast delivery. Your
                favorite pizza is just a click away!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-anzac hover:bg-raw-sienna text-black-olive font-semibold"
                  onClick={() => setIsDeliveryModalOpen(true)}
                >
                  Order Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-albescent-white text-albescent-white hover:bg-albescent-white hover:text-cocoa-bean bg-transparent"
                  onClick={handleViewMenu}
                >
                  View Menu
                </Button>
              </div>
            </div>

            {/* Image Carousel */}
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-anzac to-raw-sienna rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
                {/* Main Image */}
                <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-lg">
                  <img
                    src={menuImages[currentImageIndex] || "/placeholder.svg"}
                    alt={menuItemNames[currentImageIndex] || "Delicious Food"}
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.onerror = null
                      target.src = "/images/buffalo-chicken-pizza.jpg"
                    }}
                  />

                  {/* Image Overlay with Item Name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-semibold text-center">{menuItemNames[currentImageIndex]}</p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                  {menuImages.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex % 5
                          ? "bg-albescent-white"
                          : "bg-albescent-white/50 hover:bg-albescent-white/75"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Auto-play indicator */}
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-anzac rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">🍕</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-siam rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-xl">🌿</span>
              </div>

              {/* Image Counter */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-albescent-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {menuImages.length}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Services Modal */}
      <DeliveryServicesModal isOpen={isDeliveryModalOpen} onClose={() => setIsDeliveryModalOpen(false)} />
    </>
  )
}
