"use client"

import { X, Plus, Check, Star, Menu, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "../context/cart-context"
import { useState } from "react"

interface MenuModalProps {
  isOpen: boolean
  onClose: () => void
}

// Function to get appropriate image for each menu item - uses local images from img folder where available
const getItemImage = (itemName: string, category: string) => {
  const imageMap: { [key: string]: string } = {
    // Pies - using local images from img folder
    '12" Cheese Pie with Toppings': "/img/18InchCheesePie.webp",
    '16" Cheese Pie with Half Toppings': "/img/16InchCheesePie.webp",
    '16" Cheese Pie with Half Veggie': "/img/16InchVeggiePie.webp",
    '16" Cheese Pie with Half Meat Lover': "/img/18InchMeatLoverPie.webp",
    '16" Cheese Pie with Toppings': "/img/16InchCheesePie.webp",
    '18" Cheese Pie with Half Toppings': "/img/18InchCheesePieWithToppings.webp",
    '18" Cheese Pie with Toppings': "/img/18InchCheesePieWithToppings.webp",
    '18" Cheese Pie with Half Chicken Toppings': "/img/18InchCheesePie.webp",
    '18" Cheese Pie with Half Veggie': "/img/18InchVeggiePie.webp",
    '18" Cheese Pie with Half Meat Lover': "/img/18InchMeatLoverPie.webp",
    '16" Half Hawaiian Pie': "/img/16InchHawaiianPie.webp",
    '18" Half Hawaiian Pie': "/img/18InchHawaiianPie.webp",
    '16" Half Chicken Pie': "/img/16InchCheesePie.webp",
    '18" Half Chicken Pie': "/img/18InchCheesePie.webp",
    '16" Half Buffalo Chicken Pie': "/img/16InchCheesePie.webp",
    '18" Half Buffalo Chicken Pie': "/img/18InchCheesePie.webp",
    '16" Half BBQ Chicken Pie': "/img/16InchCheesePie.webp",
    '18" Half BBQ Chicken Pie': "/img/18InchCheesePie.webp",
    '16" Half Chicken Ranch Pie': "/img/16InchCheesePie.webp",
    '16" Half Supreme Pie': "/img/16InchCheesePie.webp",
    '18" Half Supreme Pie': "/img/18InchCheesePie.webp",

    // Generic pie names (fallbacks)
    "Cheese Pie": "/img/18InchCheesePie.webp",
    "Hawaiian Pie": "/img/18InchHawaiianPie.webp",
    "Veggie Pie": "/img/18InchVeggiePie.webp",
    "Meat Lover Pie": "/img/18InchMeatLoverPie.webp",
    "Chicken Pie":
      "https://images.unsplash.com/photo-1604917869287-3ae73c77e227?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Buffalo Chicken Pie":
      "https://images.unsplash.com/photo-1751026044592-1c395868257a?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "BBQ Chicken Pie":
      "https://images.unsplash.com/photo-1722707758294-743f78629ecd?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Chicken Ranch Pie":
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&h=300&fit=crop&crop=center",
    "Supreme Pie":
      "https://images.unsplash.com/photo-1705286324371-d6a6d9519dc2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Pesto Shrimp Pie": "/img/12InchShrimpPestoPie.avif",

    // Slices - using local images from img folder
    "Cheese Slice with Toppings":
      "/img/CheeseSlice.jpg",
    "Hawaiian Slice":
      "https://images.unsplash.com/photo-1708649360542-db4f0762bd9c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Veggie Slice": "/img/VeggieSlice.avif",
    "Meat Lover Slice": "/img/MeatLoverSlice.jpg",
    "Chicken Slice":
      "https://images.unsplash.com/photo-1604917869287-3ae73c77e227?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "BBQ Chicken Slice":
      "https://images.unsplash.com/photo-1722707758294-743f78629ecd?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Buffalo Chicken Slice":
      "https://images.unsplash.com/photo-1751026044592-1c395868257a?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Chicken Ranch Slice": "/img/ChickenRanchSlice.webp",
    "Supreme Slice": "/img/SupremeSlice.jpg",

    // Sides - using local images from img folder
    "Garlic Knots": "/img/GarlicKnots.webp",
    "6 pcs Crispy Chicken Wings with BBQ or Buffalo Sauce":
      "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop&crop=center",
    "12 pcs Crispy Chicken Wings with BBQ or Buffalo Sauce": "/img/12pcsCrispyChickenWingsWithBBQorBuffaloSauce.webp",
    "6 pcs Chicken Nuggets": "/img/6pcsChickenNuggets.webp",
    "10 pcs Chicken Nuggets":
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop&crop=center",

    // Specials - using local images from img folder
    "2 Cheese Slices with 1 Can of Soda or Water": "/img/2CheeseSliceWith1CanSodaOrWater.avif",
    "1 Cheese Slice, 4 pcs Chicken Wings, 2 pcs Garlic Knots with Can of Soda or Water": "/img/1CheeseSlice4pcsChickenWings2pcsGarlicKnotsWithACanOfSodaOrWater.avif",
    "Chicken Sandwich Meal with 3 Nuggets & Small Fries, Can of Soda or Water Bottle":
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop&crop=center",
    "Cheeseburger Meal with Small Fries, Can of Soda or Water Bottle":
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
    "5 pcs Chicken Nuggets Meal with Small Fries, Can of Soda or Water Bottle":
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop&crop=center",

    // Beef Patties
    "Beef Patty":
      "/img/BeefPatty.jpg",
    "Beef Patty w/ Cheese":
      "/img/BeefPattyWToppings.jpg",
    "Beef Patty w/ Toppings":
      "/img/BeefPattyWToppings.jpg",

    // Beverages
    "Canned Soda":
      "https://images.unsplash.com/photo-1667204651371-5d4a65b8b5a9?q=80&w=832&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Water: "https://bread-story.com/cdn/shop/files/DSC_4232_1500x.jpg?v=1683303763",
    "Bottled Soda": "https://cupspops.com/wp-content/uploads/sites/8/2024/06/Bottles.jpg",
    Snapple:
      "https://beverageuniverse.com/media/catalog/product/cache/d6b24e0b635c0897113a74c0029895da/s/n/snapple_apple.jpg",
    Arizona:
      "https://storage.googleapis.com/images-prs-prd-c7e7986.prs.prd.v8.commerce.mi9cloud.com/product-images/zoom/00613008735159_1",
    "Small Red Bull": "https://target.scene7.com/is/image/Target/GUEST_da6385d3-b2f1-4fc2-ac0b-4fdcc0779096",

    // Hot Dog Specials
    "Hot Dog": "https://images.unsplash.com/photo-1612392062126-2f640e8e5890?w=400&h=300&fit=crop&crop=center",
    "Spicy Hot Dog w/Jalapeno BBQ Sauce":
      "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=400&h=300&fit=crop&crop=center",

    // Sandwiches & Burgers
    "Chicken Sandwich": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop&crop=center",
    Cheeseburger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
    "Veggie Burger": "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop&crop=center",

    // Fries
    "Small fries": "https://images.unsplash.com/photo-1630384060421-cb20aed0a71c?w=400&h=300&fit=crop&crop=center",
    "Large fries": "https://images.unsplash.com/photo-1630384060421-cb20aed0a71c?w=400&h=300&fit=crop&crop=center",

    // Dessert - Chocolate Pizzas - using local images from img folder
    "Dubai Chocolate Pizza": "/img/12InchDubaiChocolatePie.webp",
    "S'mores Chocolate Pizza": "/img/12InchSmoresPie.webp",
    "Strawberry Chocolate Pizza": "/img/12InchStrawberryChocolatePie.avif",

    // Ice Cream Cones
    "Ice Cream Cone": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop&crop=center",
    "Ice Cream Cone with Toppings":
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop&crop=center",
  }

  return imageMap[itemName] || getCategoryImage(category)
}

// Fallback images by category
const getCategoryImage = (category: string) => {
  const categoryMap: { [key: string]: string } = {
    pies: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center",
    slices: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center",
    specials: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center",
    breakfast: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&crop=center",
    sides: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop&crop=center",
    specialtyPizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&crop=center",
    beefPatties: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
    beverages: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop&crop=center",
    hotDogSpecials: "https://images.unsplash.com/photo-1612392062126-2f640e8e5890?w=400&h=300&fit=crop&crop=center",
    sandwichesAndBurgers:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
    fries: "https://images.unsplash.com/photo-1630384060421-cb20aed0a71c?w=400&h=300&fit=crop&crop=center",
    dessertChocolatePizzas:
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop&crop=center",
    iceCreamCones: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop&crop=center",
  }

  return (
    categoryMap[category] ||
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center"
  )
}

// Available toppings
const toppingsList = {
  regular: [
    "Extra Cheese",
    "Beef Pepperoni",
    "Beef Sausage",
    "Ham",
    "Mushroom",
    "Black Olive",
    "Green Pepper",
    "Pineapple",
    "Jalapeño",
  ],
  chicken: ["Chicken", "BBQ Chicken", "Buffalo Chicken", "Ranch Chicken"],
  veggie: ["Extra Cheese", "Mushroom", "Black Olive", "Green Pepper", "Pineapple", "Jalapeño"],
  meatLover: ["Extra Cheese", "Beef Pepperoni", "Beef Sausage", "Ham", "Chicken"],
}

const menuData = {
  pies: {
    title: "Pizza Pies",
    note: 'Choose your size and configuration. Toppings & customization available.',
    items: [
      // 12" Cheese Pie with Toppings
      {
        id: 101,
        name: '12" Cheese Pie with Toppings',
        description: "A 12-inch cheese pie with options of extra cheese, beef pepperoni, beef sausage, ham, mushroom, black olive, green pepper, pineapple, or jalapeño.",
        basePrice: 13,
        size: "12",
        rating: 4.5,
        configurationType: "withToppings",
        toppingConfig: {
          required: false,
          maxToppings: 8,
          pricePerTopping: 4,
          availableToppings: toppingsList.regular,
        },
      },
      // 16" Cheese Pie with Half Toppings
      {
        id: 102,
        name: '16" Cheese Pie with Half Toppings',
        description: "A 16-inch cheese pie with half toppings option.",
        basePrice: 15,
        size: "16",
        rating: 4.5,
        configurationType: "halfToppings",
        toppingConfig: {
          required: false,
          maxToppings: 8,
          pricePerTopping: 4,
          availableToppings: toppingsList.regular,
        },
      },
      // 16" Cheese Pie with Half Veggie
      {
        id: 103,
        name: '16" Cheese Pie with Half Veggie',
        description: "A 16-inch cheese pie with half veggie toppings.",
        basePrice: 20,
        size: "16",
        rating: 4.6,
        configurationType: "halfVeggie",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 16" Cheese Pie with Half Meat Lover
      {
        id: 104,
        name: '16" Cheese Pie with Half Meat Lover',
        description: "A 16-inch cheese pie with half meat lover toppings.",
        basePrice: 22,
        size: "16",
        rating: 4.7,
        configurationType: "halfMeatLover",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 16" Cheese Pie with Toppings
      {
        id: 105,
        name: '16" Cheese Pie with Toppings',
        description: "A 16-inch cheese pie with full toppings.",
        basePrice: 15,
        size: "16",
        rating: 4.5,
        configurationType: "withToppings",
        toppingConfig: {
          required: false,
          maxToppings: 8,
          pricePerTopping: 7,
          availableToppings: toppingsList.regular,
        },
      },
      // 18" Cheese Pie with Half Toppings
      {
        id: 106,
        name: '18" Cheese Pie with Half Toppings',
        description: "An 18-inch cheese pie with half toppings (first topping required and free).",
        basePrice: 21,
        size: "18",
        rating: 4.6,
        configurationType: "halfToppings",
        toppingConfig: {
          required: true,
          maxToppings: 8,
          pricePerTopping: 5,
          firstToppingFree: true,
          availableToppings: toppingsList.regular,
        },
      },
      // 18" Cheese Pie with Toppings
      {
        id: 107,
        name: '18" Cheese Pie with Toppings',
        description: "An 18-inch cheese pie with full toppings.",
        basePrice: 16,
        size: "18",
        rating: 4.5,
        configurationType: "withToppings",
        toppingConfig: {
          required: false,
          maxToppings: 8,
          pricePerTopping: 9,
          availableToppings: toppingsList.regular,
        },
      },
      // 18" Cheese Pie with Half Chicken Toppings
      {
        id: 108,
        name: '18" Cheese Pie with Half Chicken Toppings',
        description: "An 18-inch cheese pie with half chicken toppings (only chicken, bbq, ranch, and buffalo chicken).",
        basePrice: 21,
        size: "18",
        rating: 4.7,
        configurationType: "halfChicken",
        toppingConfig: {
          required: false,
          maxToppings: 4,
          pricePerTopping: 5,
          availableToppings: toppingsList.chicken,
        },
      },
      // 18" Cheese Pie with Half Veggie
      {
        id: 109,
        name: '18" Cheese Pie with Half Veggie',
        description: "An 18-inch cheese pie with half veggie toppings.",
        basePrice: 24,
        size: "18",
        rating: 4.6,
        configurationType: "halfVeggie",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 18" Cheese Pie with Half Meat Lover
      {
        id: 110,
        name: '18" Cheese Pie with Half Meat Lover',
        description: "An 18-inch cheese pie with half meat lover toppings.",
        basePrice: 25,
        size: "18",
        rating: 4.8,
        configurationType: "halfMeatLover",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 16" Half Hawaiian Pie
      {
        id: 111,
        name: '16" Half Hawaiian Pie',
        description: "A 16-inch half Hawaiian pie with cheese, ham, and pineapple.",
        basePrice: 20,
        size: "16",
        rating: 4.5,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 18" Half Hawaiian Pie
      {
        id: 112,
        name: '18" Half Hawaiian Pie',
        description: "An 18-inch half Hawaiian pie with cheese, ham, and pineapple.",
        basePrice: 22,
        size: "18",
        rating: 4.5,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 16" Half Chicken Pie
      {
        id: 113,
        name: '16" Half Chicken Pie',
        description: "A 16-inch half chicken pie with cheese and seasoned chicken.",
        basePrice: 19,
        size: "16",
        rating: 4.7,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 18" Half Chicken Pie
      {
        id: 114,
        name: '18" Half Chicken Pie',
        description: "An 18-inch half chicken pie with cheese and seasoned chicken.",
        basePrice: 21,
        size: "18",
        rating: 4.7,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 16" Half Buffalo Chicken Pie
      {
        id: 115,
        name: '16" Half Buffalo Chicken Pie',
        description: "A 16-inch half buffalo chicken pie with cheese, chicken, and buffalo sauce.",
        basePrice: 19,
        size: "16",
        rating: 4.9,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 18" Half Buffalo Chicken Pie
      {
        id: 116,
        name: '18" Half Buffalo Chicken Pie',
        description: "An 18-inch half buffalo chicken pie with cheese, chicken, and buffalo sauce.",
        basePrice: 21,
        size: "18",
        rating: 4.9,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 16" Half BBQ Chicken Pie
      {
        id: 117,
        name: '16" Half BBQ Chicken Pie',
        description: "A 16-inch half BBQ chicken pie with cheese, chicken, and BBQ sauce.",
        basePrice: 19,
        size: "16",
        rating: 4.8,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 18" Half BBQ Chicken Pie
      {
        id: 118,
        name: '18" Half BBQ Chicken Pie',
        description: "An 18-inch half BBQ chicken pie with cheese, chicken, and BBQ sauce.",
        basePrice: 21,
        size: "18",
        rating: 4.8,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 16" Half Chicken Ranch Pie
      {
        id: 119,
        name: '16" Half Chicken Ranch Pie',
        description: "A 16-inch half chicken ranch pie with cheese, chicken, and ranch sauce.",
        basePrice: 19,
        size: "16",
        rating: 4.6,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 16" Half Supreme Pie
      {
        id: 120,
        name: '16" Half Supreme Pie',
        description: "A 16-inch half supreme pie with all toppings (toppings option included but free).",
        basePrice: 22,
        size: "16",
        rating: 4.9,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
      // 18" Half Supreme Pie
      {
        id: 121,
        name: '18" Half Supreme Pie',
        description: "An 18-inch half supreme pie with all toppings (toppings option included but free).",
        basePrice: 26,
        size: "18",
        rating: 4.9,
        configurationType: "specialty",
        toppingConfig: {
          required: false,
          maxToppings: 0,
          pricePerTopping: 0,
          availableToppings: [],
        },
      },
    ],
    recommendedBeverages: [
      { name: "Can Soda", price: 1.25 },
      { name: "Water", price: 1.0 },
      { name: "Bottle Soda 20oz", price: 2.5 },
      { name: "Small Red Bull", price: 3.5 },
      { name: "Snapple", price: 2.0 },
    ],
    recommendedSides: [
      { name: "Garlic Knots", price: 3.0 },
      { name: "Beef Patty", price: 4.0 },
      { name: "Large Fries", price: 3.5 },
      { name: "Small Fries", price: 2.5 },
    ],
    recommendedDesserts: [
      { name: '12" Dubai chocolate pizza', price: 26.0 },
      { name: '12" Strawberry Chocolate Pizza', price: 22.0 },
      { name: '12" S\'mores Pizza', price: 22.0 },
    ],
  },
  slices: {
    title: "Pizza Slices",
    note: "Individual pizza slices, 18 inch in size",
    items: [
      {
        id: 201,
        name: "Cheese Slice with Toppings",
        description: "Classic cheese pizza slice with your choice of toppings (first topping required).",
        basePrice: 1.99,
        rating: 4.5,
        toppingConfig: {
          required: true,
          maxToppings: 8,
          pricePerTopping: 2,
          availableToppings: toppingsList.regular,
        },
      },
      {
        id: 202,
        name: "Hawaiian Slice",
        description: "Cheese with pineapple & ham",
        basePrice: 5.5,
        rating: 4.5,
        toppingConfig: null,
      },
      {
        id: 203,
        name: "Veggie Slice",
        description: "Extra cheese, mushroom, black olive, green pepper, pineapple, jalapeño",
        basePrice: 5.5,
        rating: 4.4,
        toppingConfig: null,
      },
      {
        id: 204,
        name: "Meat Lover Slice",
        description: "Extra cheese, beef pepperoni, beef sausage, ham, chicken",
        basePrice: 6.0,
        rating: 4.8,
        toppingConfig: null,
      },
      {
        id: 205,
        name: "Chicken Slice",
        description: "Cheese pizza slice topped with seasoned chicken",
        basePrice: 4.0,
        rating: 4.7,
        toppingConfig: null,
      },
      {
        id: 206,
        name: "BBQ Chicken Slice",
        description: "Grilled chicken, BBQ sauce, and melted cheese",
        basePrice: 4.0,
        rating: 4.8,
        toppingConfig: null,
      },
      {
        id: 207,
        name: "Buffalo Chicken Slice",
        description: "Tender chicken, buffalo sauce, and melted mozzarella",
        basePrice: 4.0,
        rating: 4.9,
        toppingConfig: null,
      },
      {
        id: 208,
        name: "Chicken Ranch Slice",
        description: "Diced chicken and ranch dressing on a pizza slice",
        basePrice: 4.0,
        rating: 4.6,
        toppingConfig: null,
      },
      {
        id: 209,
        name: "Supreme Slice",
        description: "Extra Cheese, Beef Pepperoni, Beef Sausage, Ham, Chicken, Mushroom, Black Olive, Green pepper, Pineapple, jalapeños.",
        basePrice: 6.75,
        rating: 4.6,
        toppingConfig: null,
      },
    ],
    recommendedBeverages: [
      { name: "Water", price: 1.0 },
      { name: "Small Red Bull", price: 3.5 },
      { name: "Arizona", price: 1.5 },
      { name: "Snapple", price: 2.0 },
      { name: "Canned Soda", price: 1.25 },
    ],
    recommendedSides: [
      { name: "Beef Patty", price: 4.0 },
    ],
    recommendedDesserts: [
      { name: '12" Dubai chocolate pizza', price: 26.0 },
      { name: '12" Strawberry Chocolate Pizza', price: 22.0 },
      { name: '12" S\'mores Pizza', price: 22.0 },
    ],
  },
  specials: {
    title: "All Time Specials",
    note: "Great deals and combo offers",
    items: [
      {
        id: 301,
        name: "2 Cheese Slices with 1 Can of Soda or Water",
        description: "Two cheese slices with your choice of canned soda or water",
        basePrice: 5.0,
        rating: 5.0,
      },
      {
        id: 302,
        name: "1 Cheese Slice, 4 pcs Chicken Wings, 2 pcs Garlic Knots with Can of Soda or Water",
        description: "With 1 can of soda or water",
        basePrice: 10.0,
        rating: 4.8,
      },
      {
        id: 303,
        name: "Chicken Sandwich Meal with 3 Nuggets & Small Fries, Can of Soda or Water Bottle",
        description: "Chicken sandwich with 3 nuggets & small fries, can of soda or water",
        basePrice: 7.5,
        rating: 4.7,
      },
      {
        id: 304,
        name: "Cheeseburger Meal with Small Fries, Can of Soda or Water Bottle",
        description: "Cheeseburger with small fries, can of soda or water",
        basePrice: 8.50,
        rating: 4.6,
      },
      {
        id: 305,
        name: "5 pcs Chicken Nuggets Meal with Small Fries, Can of Soda or Water Bottle",
        description: "5 piece chicken nuggets with small fries, can of soda or water",
        basePrice: 6.5,
        rating: 4.5,
      },
    ],
  },
  sides: {
    title: "Sides",
    note: "Perfect additions to your meal",
    items: [
      {
        id: 801,
        name: "Garlic Knots",
        description: "3 pieces of freshly baked garlic knots",
        basePrice: 3.0,
        rating: 4.6,
      },
      {
        id: 802,
        name: "6 pcs Crispy Chicken Wings with BBQ or Buffalo Sauce",
        description: "6 pieces of crispy fried chicken wings",
        basePrice: 8.0,
        rating: 4.8,
      },
      {
        id: 803,
        name: "12 pcs Crispy Chicken Wings with BBQ or Buffalo Sauce",
        description: "12 pieces of crispy fried chicken wings",
        basePrice: 15.0,
        rating: 4.8,
      },
      {
        id: 804,
        name: "6 pcs Chicken Nuggets",
        description: "6 pieces of golden chicken nuggets",
        basePrice: 5.0,
        rating: 4.5,
      },
      {
        id: 805,
        name: "10 pcs Chicken Nuggets",
        description: "10 pieces of golden chicken nuggets",
        basePrice: 8.0,
        rating: 4.5,
      },
      {
        id: 806,
        name: "Beef Patty",
        description: "Seasoned beef patty, perfectly grilled",
        basePrice: 4.0,
        rating: 4.5,
      },
      {
        id: 807,
        name: "Beef Patty w/ Toppings",
        description: "Seasoned beef patty, perfectly grilled with choice of toppings.",
        basePrice: 7.25,
        rating: 4.5,
      },
    ],
  },
  beverages: {
    title: "Beverages",
    note: "Refresh yourself with our selection of drinks",
    items: [
      {
        id: 501,
        name: "Canned Soda",
        description: "Coca-Cola, Pepsi, Sprite, Dr. Pepper, and more",
        basePrice: 1.25,
        rating: 4.2,
      },
      {
        id: 502,
        name: "Water",
        description: "Pure refreshing water",
        basePrice: 1.0,
        rating: 4.0,
      },
      {
        id: 503,
        name: "Bottled Soda",
        description: "20oz bottle of your favorite soda",
        basePrice: 2.5,
        rating: 4.1,
      },
      {
        id: 504,
        name: "Snapple",
        description: "Variety of Snapple flavors",
        basePrice: 2.0,
        rating: 4.4,
      },
      {
        id: 505,
        name: "Arizona",
        description: "Arizona iced tea varieties",
        basePrice: 1.5,
        rating: 4.3,
      },
      {
        id: 506,
        name: "Small Red Bull",
        description: "Energy drink for that extra boost",
        basePrice: 3.25,
        rating: 4.5,
      },
    ],
  },
  hotDogSpecials: {
    title: "Hot Dog Specials",
    note: "Delicious hot dogs served with your choice of toppings",
    items: [
      {
        id: 901,
        name: "Hot Dog",
        description: "Classic hot dog served in a soft bun",
        basePrice: 3.5,
        rating: 4.4,
      },
      {
        id: 902,
        name: "Spicy Hot Dog w/Jalapeno BBQ Sauce",
        description: "Hot dog topped with spicy jalapeno BBQ sauce",
        basePrice: 4.5,
        rating: 4.6,
      },
    ],
  },
  sandwichesAndBurgers: {
    title: "Sandwiches, Burgers & Fries",
    note: "Freshly made sandwiches and juicy burgers with choice of fries.",
    items: [
      {
        id: 1001,
        name: "Chicken Sandwich",
        description: "Crispy chicken sandwich with lettuce and mayo",
        basePrice: 5.0,
        rating: 4.5,
      },
      {
        id: 1002,
        name: "Cheeseburger",
        description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce",
        basePrice: 7.5,
        rating: 4.7,
      },
      {
        id: 1003,
        name: "Veggie Burger",
        description: "Plant-based patty with fresh vegetables and sauce",
        basePrice: 7.5,
        rating: 4.4,
      },
      {
        id: 1004,
        name: "Small fries",
        description: "Golden, crispy fries lightly salted.",
        basePrice: 2.5,
        rating: 4.7,
      },
      {
        id: 1005,
        name: "Large fries",
        description: "Golden, crispy fries lightly salted.",
        basePrice: 3.5,
        rating: 4.4,
      },
    ],
  },
  dessertChocolatePizzas: {
    title: "Dessert - Chocolate Pizzas",
    note: "Indulgent chocolate dessert pizzas",
    items: [
      {
        id: 1201,
        name: "Dubai Chocolate Pizza",
        description: "Decadent chocolate pizza with premium Dubai-style toppings",
        basePrice: 26.0,
        rating: 4.9,
      },
      {
        id: 1202,
        name: "S'mores Chocolate Pizza",
        description: "Chocolate pizza topped with marshmallows and graham cracker crumbles",
        basePrice: 22.0,
        rating: 4.8,
      },
      {
        id: 1203,
        name: "Strawberry Chocolate Pizza",
        description: "Chocolate pizza topped with fresh strawberries and drizzle",
        basePrice: 22.0,
        rating: 4.7,
      },
    ],
  },
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  const { addItem } = useCart()
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState("pies")
  const [selectedToppings, setSelectedToppings] = useState<{ [key: number]: string[] }>({})
  const [selectedBeverages, setSelectedBeverages] = useState<{ [key: number]: string[] }>({})
  const [selectedSides, setSelectedSides] = useState<{ [key: number]: string[] }>({})
  const [selectedDesserts, setSelectedDesserts] = useState<{ [key: number]: string[] }>({})
  const [specialInstructions, setSpecialInstructions] = useState<{ [key: number]: string }>({})
  const [showCustomization, setShowCustomization] = useState<{ [key: number]: boolean }>({})
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)

  if (!isOpen) return null

  const handleToppingToggle = (itemId: number, topping: string, maxToppings: number) => {
    setSelectedToppings((prev) => {
      const currentToppings = prev[itemId] || []
      const newToppings = currentToppings.includes(topping)
        ? currentToppings.filter((t) => t !== topping)
        : currentToppings.length < maxToppings
          ? [...currentToppings, topping]
          : currentToppings
      return { ...prev, [itemId]: newToppings }
    })
  }

  const handleBeverageToggle = (itemId: number, beverage: string) => {
    setSelectedBeverages((prev) => {
      const currentBeverages = prev[itemId] || []
      const newBeverages = currentBeverages.includes(beverage)
        ? currentBeverages.filter((b) => b !== beverage)
        : currentBeverages.length < 5
          ? [...currentBeverages, beverage]
          : currentBeverages
      return { ...prev, [itemId]: newBeverages }
    })
  }

  const handleSideToggle = (itemId: number, side: string) => {
    setSelectedSides((prev) => {
      const currentSides = prev[itemId] || []
      const newSides = currentSides.includes(side)
        ? currentSides.filter((s) => s !== side)
        : currentSides.length < 4
          ? [...currentSides, side]
          : currentSides
      return { ...prev, [itemId]: newSides }
    })
  }

  const handleDessertToggle = (itemId: number, dessert: string) => {
    setSelectedDesserts((prev) => {
      const currentDesserts = prev[itemId] || []
      const newDesserts = currentDesserts.includes(dessert)
        ? currentDesserts.filter((d) => d !== dessert)
        : currentDesserts.length < 3
          ? [...currentDesserts, dessert]
          : currentDesserts
      return { ...prev, [itemId]: newDesserts }
    })
  }

  const calculatePrice = (item: any, category: string) => {
    let totalPrice = item.basePrice || item.price || 0

    // Handle topping pricing
    if (item.toppingConfig) {
      const toppings = selectedToppings[item.id] || []
      const { pricePerTopping, firstToppingFree } = item.toppingConfig

      if (firstToppingFree && toppings.length > 0) {
        // First topping is free, charge for remaining
        totalPrice += pricePerTopping * (toppings.length - 1)
      } else {
        totalPrice += pricePerTopping * toppings.length
      }
    }

    // Add beverage prices
    if (activeCategory === "pies" || activeCategory === "slices") {
      const beverages = selectedBeverages[item.id] || []
      const categoryData = menuData[activeCategory as keyof typeof menuData] as any
      beverages.forEach((bev) => {
        const bevItem = categoryData.recommendedBeverages?.find((b: any) => b.name === bev)
        if (bevItem) totalPrice += bevItem.price
      })

      // Add side prices
      const sides = selectedSides[item.id] || []
      sides.forEach((side) => {
        const sideItem = categoryData.recommendedSides?.find((s: any) => s.name === side)
        if (sideItem) totalPrice += sideItem.price
      })

      // Add dessert prices
      const desserts = selectedDesserts[item.id] || []
      desserts.forEach((dessert) => {
        const dessertItem = categoryData.recommendedDesserts?.find((d: any) => d.name === dessert)
        if (dessertItem) totalPrice += dessertItem.price
      })
    }

    return totalPrice
  }

  const handleAddToCart = (item: any, category: string) => {
    // Validate required toppings
    if (item.toppingConfig?.required) {
      const toppings = selectedToppings[item.id] || []
      if (toppings.length === 0) {
        alert("Please select at least one topping (required)")
        return
      }
    }

    const toppings = selectedToppings[item.id] || []
    const beverages = selectedBeverages[item.id] || []
    const sides = selectedSides[item.id] || []
    const desserts = selectedDesserts[item.id] || []
    const instructions = specialInstructions[item.id] || ""

    const finalPrice = calculatePrice(item, category)

    // Build description with customizations
    let description = item.description
    const parts = []

    if (toppings.length > 0) parts.push(`Toppings: ${toppings.join(", ")}`)
    if (beverages.length > 0) parts.push(`Drinks: ${beverages.join(", ")}`)
    if (sides.length > 0) parts.push(`Sides: ${sides.join(", ")}`)
    if (desserts.length > 0) parts.push(`Desserts: ${desserts.join(", ")}`)
    if (instructions) parts.push(`Special Instructions: ${instructions}`)

    if (parts.length > 0) {
      description = parts.join(" | ")
    }

    addItem({
      id: Date.now(), // Use timestamp to allow duplicate items with different customizations
      name: item.name,
      description,
      price: finalPrice,
      image: getItemImage(item.name, category),
    })

    // Show success state
    const itemKey = `${item.id}-${category}`
    setAddedItems((prev) => new Set(prev).add(itemKey))
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemKey)
        return newSet
      })
    }, 2000)

    // Reset customization for this item
    setSelectedToppings((prev) => ({ ...prev, [item.id]: [] }))
    setSelectedBeverages((prev) => ({ ...prev, [item.id]: [] }))
    setSelectedSides((prev) => ({ ...prev, [item.id]: [] }))
    setSelectedDesserts((prev) => ({ ...prev, [item.id]: [] }))
    setSpecialInstructions((prev) => ({ ...prev, [item.id]: "" }))
  }

  const toggleCustomization = (itemId: number) => {
    setShowCustomization((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const categories = [
    { key: "pies", label: "Pizza Pies" },
    { key: "slices", label: "Pizza Slices" },
    { key: "specials", label: "All Time Specials" },
    { key: "sides", label: "Sides" },
    { key: "beverages", label: "Beverages" },
    { key: "hotDogSpecials", label: "Hot Dog Specials" },
    { key: "sandwichesAndBurgers", label: "Sandwiches & Burgers" },
    { key: "dessertChocolatePizzas", label: "Dessert Pizzas" },
  ]

  const currentCategory = menuData[activeCategory as keyof typeof menuData]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-albescent-white rounded-2xl shadow-2xl overflow-hidden mx-4">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cocoa-bean text-albescent-white p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Our Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-64px)]">
          {/* Mobile Category Toggle */}
          <div className="md:hidden absolute top-20 left-4 z-20">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-venus"
              onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
            >
              <Menu className="w-4 h-4 mr-2" />
              Categories
            </Button>
          </div>

          {/* Sidebar - Categories */}
          <div
            className={`${isMobileCategoriesOpen ? "block" : "hidden"} md:block w-48 bg-white border-r border-venus/20 overflow-y-auto absolute md:relative z-10 h-full`}
          >
            <div className="p-4 space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key)
                    setIsMobileCategoriesOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeCategory === cat.key
                      ? "bg-siam text-albescent-white font-medium"
                      : "hover:bg-venus/10 text-cocoa-bean"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-16 md:pt-6">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-cocoa-bean mb-2">{currentCategory.title}</h3>
              <p className="text-ferra">{currentCategory.note}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {currentCategory.items.map((item: any) => (
                <Card
                  key={item.id}
                  className="group hover:shadow-lg transition-all duration-300 bg-white border-venus/20"
                >
                  <CardHeader className="p-0 relative">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={getItemImage(item.name, activeCategory) || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg font-bold text-cocoa-bean">{item.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-anzac text-anzac" />
                        <span className="text-sm text-ferra">{item.rating}</span>
                      </div>
                    </div>
                    <CardDescription className="text-ferra mb-4 text-sm line-clamp-2">
                      {item.description}
                    </CardDescription>

                    {/* Customization Toggle for applicable items */}
                    {(activeCategory === "pies" || activeCategory === "slices") && (
                      <button
                        onClick={() => toggleCustomization(item.id)}
                        className="text-sm text-siam hover:underline mb-2 flex items-center gap-1"
                      >
                        {showCustomization[item.id] ? "Hide" : "Show"} customization options
                      </button>
                    )}

                    {/* Customization Options */}
                    {showCustomization[item.id] && (
                      <div className="space-y-4 mb-4 p-4 bg-venus/10 rounded-lg border border-venus/20">
                        {/* Toppings */}
                        {item.toppingConfig && item.toppingConfig.maxToppings > 0 && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-cocoa-bean">Topping Option</p>
                                {item.toppingConfig.required && (
                                  <span className="flex items-center gap-1 text-xs text-orange-600">
                                    <AlertCircle className="w-3 h-3" />
                                    Required
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-ferra">
                                Select up to {item.toppingConfig.maxToppings}
                              </span>
                            </div>
                            {item.toppingConfig.firstToppingFree && (
                              <p className="text-xs text-green-600 mb-2">First topping is free!</p>
                            )}
                            <div className="space-y-2">
                              {item.toppingConfig.availableToppings.map((topping: string) => {
                                const isSelected = (selectedToppings[item.id] || []).includes(topping)
                                const toppingIndex = (selectedToppings[item.id] || []).indexOf(topping)
                                const isFree =
                                  item.toppingConfig.firstToppingFree && toppingIndex === 0 && isSelected

                                return (
                                  <div
                                    key={topping}
                                    onClick={() =>
                                      handleToppingToggle(item.id, topping, item.toppingConfig.maxToppings)
                                    }
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                                      isSelected ? "bg-siam/10 border border-siam" : "bg-white hover:bg-venus/20"
                                    }`}
                                  >
                                    <span className="text-sm text-cocoa-bean">{topping}</span>
                                    <div className="flex items-center gap-2">
                                      {isFree ? (
                                        <span className="text-xs text-green-600 font-medium">FREE</span>
                                      ) : (
                                        <span className="text-sm text-ferra">
                                          +${item.toppingConfig.pricePerTopping.toFixed(2)}
                                        </span>
                                      )}
                                      <button
                                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                          isSelected
                                            ? "bg-siam text-white"
                                            : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                        }`}
                                      >
                                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                      </button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Recommended Beverages */}
                        {(menuData as any)[activeCategory]?.recommendedBeverages && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-semibold text-cocoa-bean">Recommended Beverages</p>
                              <span className="text-xs text-ferra">(Optional) • Choose up to 5</span>
                            </div>
                            <div className="space-y-2">
                              {(menuData as any)[activeCategory].recommendedBeverages.map((bev: any) => {
                                const isSelected = (selectedBeverages[item.id] || []).includes(bev.name)
                                return (
                                  <div
                                    key={bev.name}
                                    className="flex items-center gap-3 p-2 bg-white rounded hover:bg-venus/20 transition-all cursor-pointer"
                                    onClick={() => handleBeverageToggle(item.id, bev.name)}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {}}
                                      className="w-4 h-4 accent-siam"
                                    />
                                    <span className="text-sm text-cocoa-bean flex-1">{bev.name}</span>
                                    <span className="text-sm text-ferra">+${bev.price.toFixed(2)}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Recommended Sides */}
                        {(menuData as any)[activeCategory]?.recommendedSides && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-semibold text-cocoa-bean">Recommended Sides And Apps</p>
                              <span className="text-xs text-ferra">(Optional) • Choose up to 4</span>
                            </div>
                            <div className="space-y-2">
                              {(menuData as any)[activeCategory].recommendedSides.map((side: any) => {
                                const isSelected = (selectedSides[item.id] || []).includes(side.name)
                                return (
                                  <div
                                    key={side.name}
                                    className="flex items-center gap-3 p-2 bg-white rounded hover:bg-venus/20 transition-all cursor-pointer"
                                    onClick={() => handleSideToggle(item.id, side.name)}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {}}
                                      className="w-4 h-4 accent-siam"
                                    />
                                    <span className="text-sm text-cocoa-bean flex-1">{side.name}</span>
                                    <span className="text-sm text-ferra">+${side.price.toFixed(2)}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Recommended Desserts */}
                        {(menuData as any)[activeCategory]?.recommendedDesserts && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-semibold text-cocoa-bean">Recommended Desserts</p>
                              <span className="text-xs text-ferra">(Optional) • Choose up to 3</span>
                            </div>
                            <div className="space-y-2">
                              {(menuData as any)[activeCategory].recommendedDesserts.map((dessert: any) => {
                                const isSelected = (selectedDesserts[item.id] || []).includes(dessert.name)
                                return (
                                  <div
                                    key={dessert.name}
                                    className="flex items-center gap-3 p-2 bg-white rounded hover:bg-venus/20 transition-all cursor-pointer"
                                    onClick={() => handleDessertToggle(item.id, dessert.name)}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => {}}
                                      className="w-4 h-4 accent-siam"
                                    />
                                    <span className="text-sm text-cocoa-bean flex-1">{dessert.name}</span>
                                    <span className="text-sm text-ferra">+${dessert.price.toFixed(2)}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Preferences / Special Instructions */}
                        <div>
                          <p className="text-sm font-semibold text-cocoa-bean mb-2">Preferences</p>
                          <p className="text-xs text-ferra mb-2">(Optional)</p>
                          <div className="bg-white rounded-lg p-2">
                            <button
                              onClick={() => {
                                const textarea = document.getElementById(
                                  `instructions-${item.id}`,
                                ) as HTMLTextAreaElement
                                if (textarea) textarea.focus()
                              }}
                              className="text-sm text-cocoa-bean hover:text-siam transition-colors flex items-center gap-1"
                            >
                              Add Special Instructions
                              <span className="text-siam">→</span>
                            </button>
                            <textarea
                              id={`instructions-${item.id}`}
                              value={specialInstructions[item.id] || ""}
                              onChange={(e) =>
                                setSpecialInstructions((prev) => ({ ...prev, [item.id]: e.target.value }))
                              }
                              placeholder="e.g., extra sauce, well done, etc."
                              className="w-full mt-2 p-2 text-sm border border-venus/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-siam/20 resize-none"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-raw-sienna">
                        ${calculatePrice(item, activeCategory).toFixed(2)}
                      </span>
                      <Button
                        size="sm"
                        className={`transition-all duration-300 ${
                          addedItems.has(`${item.id}-${activeCategory}`)
                            ? "bg-siam hover:bg-siam text-albescent-white"
                            : "bg-siam hover:bg-black-olive text-albescent-white"
                        }`}
                        onClick={() => handleAddToCart(item, activeCategory)}
                      >
                        {addedItems.has(`${item.id}-${activeCategory}`) ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Added!
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
