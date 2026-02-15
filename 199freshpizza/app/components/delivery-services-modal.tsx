"use client"

import { useState } from "react"
import { X, ExternalLink, Clock, Star, Truck, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface DeliveryServicesModalProps {
  isOpen: boolean
  onClose: () => void
}

const deliveryServices = [
  {
    id: "doordash",
    name: "DoorDash",
    logo: "🚗",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
    description: "Fast delivery with real-time tracking",
    estimatedTime: "25-35 min",
    deliveryFee: "$2.99",
    rating: 4.8,
    features: ["Real-time tracking", "Contactless delivery", "DashPass available"],
    // Updated with the real DoorDash URL
    url: "https://www.doordash.com/store/$1.99-fresh-pizza-lyndhurst-32783939/73652746/?cursor=eyJzZWFyY2hfaXRlbV9jYXJvdXNlbF9jdXJzb3IiOnsicXVlcnkiOiIkMS45OSBGcmVzaCBQaXp6YSIsIml0ZW1faWRzIjpbXSwic2VhcmNoX3Rlcm0iOiIxOTkgZnJlc2ggcGl6emEiLCJ2ZXJ0aWNhbF9pZCI6LTk5OSwidmVydGljYWxfbmFtZSI6ImFsbCIsInF1ZXJ5X2ludGVudCI6IlNUT1JFX1JYIn0sInN0b3JlX3ByaW1hcnlfdmVydGljYWxfaWRzIjpbMSw0LDEwMDMzM119&pickup=false",
    available: true,
  },
  {
    id: "seamless",
    name: "Seamless",
    logo: "🍽️",
    color: "bg-green-600",
    hoverColor: "hover:bg-green-700",
    description: "Seamless ordering and delivery experience",
    estimatedTime: "20-30 min",
    deliveryFee: "$1.99",
    rating: 4.7,
    features: ["Easy ordering", "Pickup available", "Seamless+ rewards"],
    // Updated with the real Seamless URL
    url: "https://www.seamless.com/menu/199-fresh-pizza-341-ridge-rd-lyndhurst/11840792?utm_source=google&utm_medium=organic&utm_campaign=place-action-link&pickup=true&rwg_token=ACgRB3faUrhiKxwYYTh4SoOKIKwVFGCg4sZj2MLDstwIFQuoCVtP5UV3KFVWxwOI85VS_mUJRrCrvlAvJLt-j0NAHIx0fYCg7A%3D%3D",
    available: true,
  },
  {
    id: "grubhub",
    name: "Grubhub",
    logo: "🥡",
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
    description: "America's favorite food delivery service",
    estimatedTime: "30-40 min",
    deliveryFee: "$3.49",
    rating: 4.6,
    features: ["Order ahead", "Group ordering", "Grubhub+ perks"],
    // Updated with the real Grubhub URL
    url: "https://www.grubhub.com/restaurant/199-fresh-pizza-341-ridge-rd-lyndhurst/11840792",
    available: true,
  },
]

export default function DeliveryServicesModal({ isOpen, onClose }: DeliveryServicesModalProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)

  if (!isOpen) return null

  const handleServiceSelect = (service: (typeof deliveryServices)[0]) => {
    setSelectedService(service.id)
    setIsRedirecting(true)

    // Simulate API call or redirect delay
    setTimeout(() => {
      // Open the service's website/app in a new tab
      window.open(service.url, "_blank")

      setIsRedirecting(false)
      setSelectedService(null)
      onClose() // Close the modal after redirecting
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-white rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-venus/20 bg-gradient-to-r from-cocoa-bean to-walnut text-albescent-white rounded-t-lg">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Order for Delivery</h2>
              <p className="text-albescent-white/80 mt-1">Choose your preferred delivery service</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-albescent-white hover:text-anzac hover:bg-walnut"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {/* Restaurant Info */}
            <div className="mb-6 p-4 bg-albescent-white rounded-lg border border-venus/20">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-cocoa-bean rounded-full flex items-center justify-center">
                  <span className="text-2xl">🍕</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cocoa-bean">$1.99 FRESH PIZZA</h3>
                  <p className="text-ferra">341 Ridge Road, Lyndhurst, NJ 07071</p>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-venus">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Open until 11:00 PM
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-anzac text-anzac" />
                      4.8 (500+ reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Services */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-cocoa-bean mb-4">Available Delivery Services</h3>

              {deliveryServices.map((service) => (
                <Card
                  key={service.id}
                  className={`group cursor-pointer transition-all duration-300 hover:shadow-lg border-venus/20 ${
                    selectedService === service.id ? "ring-2 ring-siam" : ""
                  }`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-16 h-16 ${service.color} rounded-lg flex items-center justify-center text-2xl`}
                        >
                          {service.logo}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-xl font-bold text-cocoa-bean">{service.name}</h4>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-anzac text-anzac" />
                              <span className="text-sm text-ferra">{service.rating}</span>
                            </div>
                          </div>
                          <p className="text-ferra mb-2">{service.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-venus">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.estimatedTime}
                            </span>
                            <span className="flex items-center">
                              <Truck className="w-4 h-4 mr-1" />
                              {service.deliveryFee} delivery
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button
                          className={`${service.color} ${service.hoverColor} text-white`}
                          disabled={isRedirecting && selectedService === service.id}
                        >
                          {isRedirecting && selectedService === service.id ? (
                            "Redirecting..."
                          ) : (
                            <>
                              Order Now
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-4 pt-4 border-t border-venus/20">
                      <div className="flex flex-wrap gap-2">
                        {service.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 bg-siam/10 text-siam text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-cocoa-bean mb-2 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment & Delivery Info
              </h4>
              <ul className="text-sm text-ferra space-y-1">
                <li>• All major credit cards accepted</li>
                <li>• Contactless delivery available</li>
                <li>• Real-time order tracking</li>
                <li>• Delivery fees may vary by distance</li>
                <li>• Minimum order requirements may apply</li>
              </ul>
            </div>

            {/* Direct Order Option */}
            <div className="mt-6 p-4 bg-gradient-to-r from-siam/10 to-black-olive/10 rounded-lg border border-siam/20">
              <h4 className="font-semibold text-cocoa-bean mb-2">💡 Save on Delivery Fees</h4>
              <p className="text-sm text-ferra mb-3">
                Order directly through our website and save on third-party delivery fees! Call us at{" "}
                <span className="font-semibold text-cocoa-bean">(201) 256-3630</span> for pickup or delivery.
              </p>
              <Button
                variant="outline"
                className="border-siam text-siam hover:bg-siam hover:text-albescent-white bg-transparent"
                onClick={() => {
                  onClose()
                  // Scroll to contact section or open phone dialer
                  const contactSection = document.getElementById("contact")
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Order Direct & Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
