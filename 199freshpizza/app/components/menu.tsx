"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Plus, Check } from "lucide-react"
import { useCart } from "../context/cart-context"
import { useState } from "react"
import MenuModal from "./menu-modal"

const mostOrderedItems = [
  {
    id: 1,
    name: "2 Cheese Slice with 1 Can of Soda or Water",
    description: "Two slices of cheese pizza served with a choice of can soda or water.",
    price: 5.0,
    image:
      "https://images.unsplash.com/photo-1544029048-b78834e2c277?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5.0,
    popular: true,
  },
  {
    id: 2,
    name: "Beef Patty",
    description: "Jamaican Beef Patty",
    price: 3.5,
    image:
      "https://images.unsplash.com/photo-1587652252980-51fae498d182?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.3,
    popular: false,
  },
  {
    id: 3,
    name: "Cheese Slice with Toppings",
    description:
      "Extra Cheese, Beef Pepperoni, Beef Sausage, Ham, Mushroom, Black Olive, Green pepper, Pineapple or Jalapeños.",
    price: 1.99,
    image:
      "https://images.unsplash.com/photo-1747654168933-a0a0c9d78d68?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    popular: true,
  },
  {
    id: 4,
    name: '16" Cheese Pie with Half Toppings',
    description:
      "Extra Cheese, Beef Pepperoni, Beef Sausage, Ham, Mushroom, Black Olive, Green Pepper, Pineapple, Jalapeño.",
    price: 14.0,
    image:
      "https://images.unsplash.com/photo-1705286324371-d6a6d9519dc2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    popular: true,
  },
  {
    id: 5,
    name: "BBQ Chicken Slice",
    description: "Grilled chicken, bbq sauce, red onions, and cheddar cheese on a pizza slice.",
    price: 3.75,
    image:
      "https://images.unsplash.com/photo-1722707758294-743f78629ecd?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    popular: true,
  },
]

export default function Menu() {
  const { addItem } = useCart()
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set())
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)

  const handleAddToCart = (item: (typeof mostOrderedItems)[0]) => {
    try {
      addItem({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
      })

      // Show success state temporarily
      setAddedItems((prev) => new Set(prev).add(item.id))
      setTimeout(() => {
        setAddedItems((prev) => {
          const newSet = new Set(prev)
          newSet.delete(item.id)
          return newSet
        })
      }, 2000)
    } catch (error) {
      console.error("Error adding item to cart:", error)
    }
  }

  return (
    <>
      <section id="menu" className="py-20 bg-albescent-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-cocoa-bean mb-4">Most Ordered</h2>
            <p className="text-xl text-ferra max-w-2xl mx-auto">
              The most commonly ordered items and dishes from this store
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mostOrderedItems.map((item) => (
              <Card
                key={item.id}
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-venus/20"
              >
                <CardHeader className="p-0 relative">
                  {item.popular && (
                    <div className="absolute top-4 left-4 z-10 bg-cocoa-bean text-albescent-white px-2 py-1 rounded text-xs font-medium">
                      Popular
                    </div>
                  )}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-bold text-cocoa-bean">{item.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-anzac text-anzac" />
                      <span className="text-sm text-ferra">{item.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="text-ferra mb-4 line-clamp-2">{item.description}</CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-raw-sienna">${item.price.toFixed(2)}</span>
                    <Button
                      className={`transition-all duration-300 ${
                        addedItems.has(item.id)
                          ? "bg-siam hover:bg-siam text-albescent-white"
                          : "bg-siam hover:bg-black-olive text-albescent-white"
                      }`}
                      onClick={() => handleAddToCart(item)}
                    >
                      {addedItems.has(item.id) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Added!
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-siam text-siam hover:bg-siam hover:text-albescent-white bg-transparent"
              onClick={() => setIsMenuModalOpen(true)}
            >
              View Full Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Menu Modal */}
      <MenuModal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} />
    </>
  )
}
