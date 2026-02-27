"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import DeliveryServicesModal from "./delivery-services-modal"

// Menu item images - using local images from img folder where available
const menuImages = [
  // Pies - using local images
  "/img/18InchCheesePie.webp",
  "/img/18InchHawaiianPie.webp",
  "/img/18InchVeggiePie.webp",
  "/img/18InchMeatLoverPie.webp",
  "https://images.unsplash.com/photo-1604917869287-3ae73c77e227?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1751026044592-1c395868257a?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1722707758294-743f78629ecd?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "/img/ChickenRanchSlice.webp",

  // Specials - using local image
  "/img/2CheeseSliceWith1CanSodaOrWater.avif",
  "/img/1CheeseSlice4pcsChickenWings2pcsGarlicKnotsWithACanOfSodaOrWater.avif",

  // Sides - using local images
  "/img/GarlicKnots.webp",
  "/img/12pcsCrispyChickenWingsWithBBQorBuffaloSauce.webp",
  "/img/6pcsChickenNuggets.webp",

  // Desserts - using local images
  "/img/12InchDubaiChocolatePie.webp",
  "/img/12InchSmoresPie.webp",
  "/img/12InchStrawberryChocolatePie.avif",

  // Beverages - keeping external URLs (no local images available)
  "https://images.unsplash.com/photo-1667204651371-5d4a65b8b5a9?q=80&w=832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://bread-story.com/cdn/shop/files/DSC_4232_1500x.jpg?v=1683303763",
]

const menuItemNames = [
  "18\" Cheese Pie",
  "18\" Hawaiian Pie",
  "18\" Veggie Pie",
  "18\" Meat Lover Pie",
  "Chicken Pie",
  "Buffalo Chicken Pie",
  "BBQ Chicken Pie",
  "Chicken Ranch Slice",
  "2 Cheese Slices Special",
  "Wings & Garlic Knots Combo",
  "Garlic Knots",
  "12pc Crispy Wings",
  "6pc Chicken Nuggets",
  "Dubai Chocolate Pizza",
  "S'mores Pizza",
  "Strawberry Chocolate Pizza",
  "Canned Soda",
  "Water",
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
                    width={320}
                    height={320}
                    onError={(e) => {
                      const target = e.currentTarget
                      target.onerror = null
                      target.src = "/img/ChickenRanchSlice.webp"
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
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                  {menuImages.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className="w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200"
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-all duration-200 block ${
                          index === currentImageIndex % 5
                            ? "bg-albescent-white"
                            : "bg-albescent-white/50 hover:bg-albescent-white/75"
                        }`}
                      />
                    </button>
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
