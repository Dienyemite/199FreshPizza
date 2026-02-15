"use client"

import { X, Plus, Check, Star, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "../context/cart-context"
import { useState } from "react"

interface MenuModalProps {
  isOpen: boolean
  onClose: () => void
}

// Function to get appropriate image for each menu item using reliable Unsplash URLs
const getItemImage = (itemName: string, category: string) => {
  const imageMap: { [key: string]: string } = {
    // Pies
    "Cheese Pie":
      "https://images.unsplash.com/photo-1747654168933-a0a0c9d78d68?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Hawaiian Pie":
      "https://images.unsplash.com/photo-1708649360542-db4f0762bd9c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Veggie Pie":
      "https://images.unsplash.com/photo-1718801594801-feba5ddcb2a4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Meat Lover Pie": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop&crop=center",
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
    "Shrimp Pesto Pizza":
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&crop=center",

    // Slices
    "Cheese Slice":
      "https://images.unsplash.com/photo-1747654168933-a0a0c9d78d68?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Hawaiian Slice":
      "https://images.unsplash.com/photo-1708649360542-db4f0762bd9c?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Veggie Slice":
      "https://images.unsplash.com/photo-1718801594801-feba5ddcb2a4?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Meat Lover Slice": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop&crop=center",
    "Chicken Slice":
      "https://images.unsplash.com/photo-1604917869287-3ae73c77e227?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "BBQ Chicken Slice":
      "https://images.unsplash.com/photo-1722707758294-743f78629ecd?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Buffalo Chicken Slice":
      "https://images.unsplash.com/photo-1751026044592-1c395868257a?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Chicken Ranch Slice":
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&h=300&fit=crop&crop=center",

    // Breakfast
    "Butter Croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&crop=center",
    "Egg & Cheese Croissant":
      "https://images.unsplash.com/photo-1600628421055-4d30de868b8f?w=400&h=300&fit=crop&crop=center",
    "Bagel w/Cream Cheese":
      "https://images.unsplash.com/photo-1585445490387-f47934b73b54?w=400&h=300&fit=crop&crop=center",
    "Egg & Cheese Bagel":
      "https://images.unsplash.com/photo-1592767039374-9a2a7f0dcb70?w=400&h=300&fit=crop&crop=center",
    "Coffee (Small)": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center",
    "Coffee (Large)": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center",

    // Sides
    "Garlic Knots (3)": "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400&h=300&fit=crop&crop=center",
    "6 PC Crispy Chicken Wings":
      "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop&crop=center",
    "12 PC Crispy Chicken Wings":
      "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop&crop=center",
    "6 PC Chicken Nuggets":
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop&crop=center",
    "10 PC Chicken Nuggets":
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop&crop=center",

    // Specials
    "2 Slices with 1 Can of Soda or Water":
      "https://images.unsplash.com/photo-1544029048-b78834e2c277?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "1 Slice, 4 Crispy Wings & 2 Garlic Knots":
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&crop=center",
    "Chicken Sandwich Meal":
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop&crop=center",
    "Cheeseburger Meal":
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
    "5 PC Chicken Nuggets Meal":
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop&crop=center",

    // Beef Patties
    "Beef Patty":
      "https://images.unsplash.com/photo-1587652252980-51fae498d182?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Beef Patty w/ Cheese":
      "https://images.unsplash.com/photo-1626111740066-e595bce778f0?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

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
    "Small Fries": "https://images.unsplash.com/photo-1630384060421-cb20aed0a71c?w=400&h=300&fit=crop&crop=center",
    "Large Fries": "https://images.unsplash.com/photo-1630384060421-cb20aed0a71c?w=400&h=300&fit=crop&crop=center",

    // Dessert - Chocolate Pizzas
    "Dubai Chocolate Pizza":
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop&crop=center",
    "S'mores Chocolate Pizza":
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&crop=center",
    "Strawberry Chocolate Pizza":
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center",

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

const menuData = {
  pies: {
    title: "Pizza Pies",
    note: 'Choose your size: 12", 16", or 18". Toppings & half toppings available.',
    items: [
      {
        id: 101,
        name: "Cheese Pie",
        description: "Classic cheese pizza with signature marinara sauce and a blend of cheeses",
        prices: { "12": 13, "16": 15, "18": 16 },
        rating: 4.5,
        category: "basic",
        hasCustomization: true,
      },
      {
        id: 102,
        name: "Hawaiian Pie",
        description: "Cheese with pineapple & ham",
        prices: { "12": 19, "16": 25, "18": 28 },
        rating: 4.5,
        category: "specialty",
        hasCustomization: true,
      },
      {
        id: 103,
        name: "Veggie Pie",
        description: "Extra cheese, mushroom, black olive, green pepper, pineapple, jalapeño",
        prices: { "12": 20, "16": 25, "18": 28 },
        rating: 4.4,
        category: "specialty",
        hasCustomization: true,
      },
      {
        id: 104,
        name: "Meat Lover Pie",
        description: "Extra cheese, beef pepperoni, beef sausage, ham, chicken",
        prices: { "12": 21, "16": 26, "18": 30 },
        rating: 4.8,
        category: "specialty",
        hasCustomization: true,
      },
      {
        id: 105,
        name: "Chicken Pie",
        description: "Cheese pizza topped with seasoned chicken",
        prices: { "12": 18, "16": 22, "18": 25 },
        rating: 4.7,
        category: "specialty",
        hasCustomization: true,
      },
      {
        id: 106,
        name: "Buffalo Chicken Pie",
        description: "Cheese, chicken and buffalo sauce on top",
        prices: { "12": 18, "16": 22, "18": 25 },
        rating: 4.9,
        category: "specialty",
        hasCustomization: true,
      },
      {
        id: 107,
        name: "BBQ Chicken Pie",
        description: "Cheese, chicken and BBQ sauce on top",
        prices: { "12": 18, "16": 22, "18": 25 },
        rating: 4.8,
        category: "specialty",
        hasCustomization: true,
      },
      {
        id: 108,
        name: "Chicken Ranch Pie",
        description: "Cheese, chicken and ranch sauce on top",
        prices: { "12": 18, "16": 22, "18": 25 },
        rating: 4.6,
        category: "specialty",
        hasCustomization: true,
      },
      {
        id: 109,
        name: "Supreme Pie",
        description:
          "Extra cheese, beef pepperoni, beef sausage, ham, chicken, mushroom, black olive, green pepper, pineapple, jalapeño",
        prices: { "12": 22, "16": 27, "18": 32 },
        rating: 4.9,
        category: "specialty",
        hasCustomization: true,
      },
      {
        id: 110,
        name: "Pesto Shrimp Pie",
        description: "Shrimp atop a basil pesto sauce, sun-dried tomatoes.",
        prices: { "12": 25, "18": 35 },
        rating: 4.6,
        category: "specialty",
        hasCustomization: true,
      },
    ],
    extraToppings: {
      "12": 4,
      "16": 4,
      "18": 5,
    },
    toppingOptions: [
      "Beef Pepperoni",
      "Extra Cheese",
      "Beef Sausage",
      "Ham",
      "Mushrooms",
      "Black Olives",
      "Peppers",
      "Pineapple",
      "Jalapeños",
    ],
    recommendedBeverages: [
      { name: "Water", price: 1.0 },
      { name: "Small Red Bull", price: 3.25 },
      { name: "Arizona", price: 1.5 },
      { name: "Snapple", price: 2.0 },
      { name: "Bottled Soda", price: 2.5 },
      { name: "Canned Soda", price: 1.25 },
    ],
    recommendedSides: [
      { name: "Beef Patty", price: 4.0 },
      { name: "Beef Patty w/ Toppings", price: 7.25 },
    ],
  },
  slices: {
    title: "Pizza Slices",
    note: "Individual pizza slices, 18 inch in size",
    items: [
      {
        id: 201,
        name: "Cheese Slice",
        description: "Classic cheese pizza slice",
        price: 1.99,
        rating: 4.5,
        category: "basic",
      },
      {
        id: 202,
        name: "Hawaiian Slice",
        description: "Cheese with pineapple & ham",
        price: 5.5,
        rating: 4.5,
        category: "specialty",
      },
      {
        id: 203,
        name: "Veggie Slice",
        description: "Extra cheese, mushroom, black olive, green pepper, pineapple, jalapeño",
        price: 5.5,
        rating: 4.4,
        category: "specialty",
      },
      {
        id: 204,
        name: "Meat Lover Slice",
        description: "Extra cheese, beef pepperoni, beef sausage, ham, chicken",
        price: 6.0,
        rating: 4.8,
        category: "specialty",
      },
      {
        id: 205,
        name: "Chicken Slice",
        description: "Cheese pizza slice topped with seasoned chicken",
        price: 4.0,
        rating: 4.7,
        category: "specialty",
      },
      {
        id: 206,
        name: "BBQ Chicken Slice",
        description: "Grilled chicken, BBQ sauce, and melted cheese",
        price: 4.0,
        rating: 4.8,
        category: "specialty",
      },
      {
        id: 207,
        name: "Buffalo Chicken Slice",
        description: "Tender chicken, buffalo sauce, and melted mozzarella",
        price: 4.0,
        rating: 4.9,
        category: "specialty",
      },
      {
        id: 208,
        name: "Chicken Ranch Slice",
        description: "Diced chicken and ranch dressing on a pizza slice",
        price: 4.0,
        rating: 4.6,
        category: "specialty",
      },
      {
        id: 209,
        name: "Supreme Slice",
        description: "Extra Cheese, Beef Pepperoni, Beef Sausage, Ham, Chicken,Buffalo Chicken,BBQ Chicken,Chiken Ranch,Mushroom, Black Olive, Green pepper, Pineapple, jalapeños.",
        price: 6.75,
        rating: 4.6,
        category: "specialty",
      },
    ],
    toppingPrice: 2.00,
    toppingOptions: [
      "Extra Cheese",
      "Beef Sausage",
      "Ham",
      "Mushrooms",
      "Black Olives",
      "Peppers",
      "Pineapple",
      "Beef Pepperoni",
      "Jalapeños",
    ],
    recommendedBeverages: [
      { name: "Water", price: 1.0 },
      { name: "Small Red Bull", price: 3.5 },
      { name: "Arizona", price: 1.5 },
      { name: "Snapple", price: 2.0 },
      { name: "Canned Soda", price: 1.25 },
      { name: "Bottle Soda 20oz", price: 2.5 },
    ],
    recommendedSides: [{ name: "Beef Patty", price: 4.0 }],
  },
  specials: {
    title: "All Time Specials",
    note: "Great deals and combo offers",
    items: [
      {
        id: 301,
        name: "2 Cheese Slices with 1 Can of Soda or Water",
        description: "Two cheese slices with your choice of canned soda or water",
        price: 5.0,
        rating: 5.0,
        category: "combo",
      },
      {
        id: 302,
        name: "1 Cheese Slice, 4 pcs Chicken Wings, 2 pcs Garlic Knots with Can of Soda or Water",
        description: "With 1 can of soda or water",
        price: 10.0,
        rating: 4.8,
        category: "combo",
      },
      {
        id: 303,
        name: "Chicken Sandwich Meal with 3 Nuggets & Small Fries, Can of Soda or Water Bottle",
        description: "Chicken sandwich with 3 nuggets & small fries, can of soda or water",
        price: 7.5,
        rating: 4.7,
        category: "combo",
      },
      {
        id: 304,
        name: "Cheeseburger Meal with Small Fries, Can of Soda or Water Bottle",
        description: "Cheeseburger with small fries, can of soda or water",
        price: 8.50,
        rating: 4.6,
        category: "combo",
      },
      {
        id: 305,
        name: "5 pcs Chicken Nuggets Meal with Small Fries, Can of Soda or Water Bottle",
        description: "5 piece chicken nuggets with small fries, can of soda or water",
        price: 6.5,
        rating: 4.5,
        category: "combo",
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
        price: 3.0,
        rating: 4.6,
        category: "sides",
      },
      {
        id: 802,
        name: "6 pcs Crispy Chicken Wings with BBQ or Buffalo Sauce",
        description: "6 pieces of crispy fried chicken wings",
        price: 8.0,
        rating: 4.8,
        category: "sides",
      },
      {
        id: 803,
        name: "12 pcs Crispy Chicken Wings with BBQ or Buffalo Sauce",
        description: "12 pieces of crispy fried chicken wings",
        price: 15.0,
        rating: 4.8,
        category: "sides",
      },
      {
        id: 804,
        name: "6 pcs Chicken Nuggets",
        description: "6 pieces of golden chicken nuggets",
        price: 5.0,
        rating: 4.5,
        category: "sides",
      },
      {
        id: 805,
        name: "10 pcs Chicken Nuggets",
        description: "10 pieces of golden chicken nuggets",
        price: 8.0,
        rating: 4.5,
        category: "sides",
      },
      {
        id: 806,
        name: "Beef Patty",
        description: "Seasoned beef patty, perfectly grilled",
        price: 4.0,
        rating: 4.5,
        category: "sides",
      },
      {
        id: 807,
        name: "Beef Patty w/ Toppings",
        description: "Seasoned beef patty, perfectly grilled with choice of toppings.",
        price: 7.25,
        rating: 4.5,
        category: "sides",
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
        price: 1.25,
        rating: 4.2,
        category: "beverage",
      },
      {
        id: 502,
        name: "Water",
        description: "Pure refreshing water",
        price: 1.0,
        rating: 4.0,
        category: "beverage",
      },
      {
        id: 503,
        name: "Bottled Soda",
        description: "20oz bottle of your favorite soda",
        price: 2.5,
        rating: 4.1,
        category: "beverage",
      },
      {
        id: 504,
        name: "Snapple",
        description: "Variety of Snapple flavors",
        price: 2.0,
        rating: 4.4,
        category: "beverage",
      },
      {
        id: 505,
        name: "Arizona",
        description: "Arizona iced tea varieties",
        price: 1.5,
        rating: 4.3,
        category: "beverage",
      },
      {
        id: 506,
        name: "Small Red Bull",
        description: "Energy drink for that extra boost",
        price: 3.25,
        rating: 4.5,
        category: "beverage",
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
        price: 3.5,
        rating: 4.4,
        category: "hotdog",
      },
      {
        id: 902,
        name: "Spicy Hot Dog w/Jalapeno BBQ Sauce",
        description: "Hot dog topped with spicy jalapeno BBQ sauce",
        price: 4.5,
        rating: 4.6,
        category: "hotdog",
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
        price: 5.0,
        rating: 4.5,
        category: "sandwich",
      },
      {
        id: 1002,
        name: "Cheeseburger",
        description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce",
        price: 7.5,
        rating: 4.7,
        category: "burger",
      },
      {
        id: 1003,
        name: "Veggie Burger",
        description: "Plant-based patty with fresh vegetables and sauce",
        price: 7.5,
        rating: 4.4,
        category: "burger",
      },
      {
        id: 1004,
        name: "Small fries",
        description: "Golden, crispy fries lightly salted.",
        price: 2.5,
        rating: 4.7,
        category: "fries",
      },
      {
        id: 1005,
        name: "Large fries",
        description: "Golden, crispy fries lightly salted.",
        price: 3.5,
        rating: 4.4,
        category: "fries",
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
        price: 26.0,
        rating: 4.9,
        category: "dessert",
      },
      {
        id: 1202,
        name: "S'mores Chocolate Pizza",
        description: "Chocolate pizza topped with marshmallows and graham cracker crumbles",
        price: 22.0,
        rating: 4.8,
        category: "dessert",
      },
      {
        id: 1203,
        name: "Strawberry Chocolate Pizza",
        description: "Chocolate pizza topped with fresh strawberries and drizzle",
        price: 22.0,
        rating: 4.7,
        category: "dessert",
      },
    ],
  },
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  const { addItem } = useCart()
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState("pies")
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({})
  const [selectedToppings, setSelectedToppings] = useState<{ [key: number]: string[] }>({})
  const [selectedBeverages, setSelectedBeverages] = useState<{ [key: number]: string[] }>({})
  const [selectedSides, setSelectedSides] = useState<{ [key: number]: string[] }>({})
  const [showCustomization, setShowCustomization] = useState<{ [key: number]: boolean }>({})
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false)

  if (!isOpen) return null

  const handleSizeChange = (itemId: number, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [itemId]: size }))
  }

  const handleToppingToggle = (itemId: number, topping: string) => {
    setSelectedToppings((prev) => {
      const currentToppings = prev[itemId] || []
      const newToppings = currentToppings.includes(topping)
        ? currentToppings.filter((t) => t !== topping)
        : [...currentToppings, topping]
      return { ...prev, [itemId]: newToppings }
    })
  }

  const handleBeverageToggle = (itemId: number, beverage: string) => {
    setSelectedBeverages((prev) => {
      const currentBeverages = prev[itemId] || []
      if (currentBeverages.length >= 5 && currentBeverages.includes(beverage)) return prev
      const newBeverages = currentBeverages.includes(beverage)
        ? currentBeverages.filter((b) => b !== beverage)
        : [...currentBeverages, beverage]
      return { ...prev, [itemId]: newBeverages }
    })
  }

  const handleSideToggle = (itemId: number, side: string) => {
    setSelectedSides((prev) => {
      const currentSides = prev[itemId] || []
      const newSides = currentSides.includes(side) ? currentSides.filter((s) => s !== side) : [...currentSides, side]
      return { ...prev, [itemId]: newSides }
    })
  }

  const calculatePrice = (item: any, category: string) => {
    if (category === "pies") {
      const selectedSize = selectedSizes[item.id] || "12"
      const basePrice = item.prices[selectedSize] || item.prices["12"]
      const toppings = selectedToppings[item.id] || []
      const beverages = selectedBeverages[item.id] || []
      const sides = selectedSides[item.id] || []

      let totalPrice = basePrice

      // Add topping price if any toppings selected
      if (toppings.length > 0) {
        totalPrice += menuData.pies.extraToppings[selectedSize as keyof typeof menuData.pies.extraToppings]
      }

      // Add beverage prices
      beverages.forEach((bev) => {
        const bevItem = menuData.pies.recommendedBeverages.find((b) => b.name === bev)
        if (bevItem) totalPrice += bevItem.price
      })

      // Add side prices
      sides.forEach((side) => {
        const sideItem = menuData.pies.recommendedSides.find((s) => s.name === side)
        if (sideItem) totalPrice += sideItem.price
      })

      return totalPrice
    } else if (category === "slices") {
      let totalPrice = item.price
      const toppings = selectedToppings[item.id] || []
      if (toppings.length > 0) {
        totalPrice += menuData.slices.toppingPrice * toppings.length
      }
      // Add beverage prices
      const beverages = selectedBeverages[item.id] || []
      beverages.forEach((bev) => {
        const bevItem = menuData.slices.recommendedBeverages.find((b) => b.name === bev)
        if (bevItem) totalPrice += bevItem.price
      })

      // Add side prices
      const sides = selectedSides[item.id] || []
      sides.forEach((side) => {
        const sideItem = menuData.slices.recommendedSides.find((s) => s.name === side)
        if (sideItem) totalPrice += sideItem.price
      })
      return totalPrice
    }

    return item.price
  }

  const handleAddToCart = (item: any, category: string) => {
    const selectedSize = selectedSizes[item.id] || "12"
    const toppings = selectedToppings[item.id] || []
    const beverages = selectedBeverages[item.id] || []
    const sides = selectedSides[item.id] || []

    const finalPrice = calculatePrice(item, category)

    // Build description with customizations
    let description = item.description
    if (category === "pies" && (toppings.length > 0 || beverages.length > 0 || sides.length > 0)) {
      const parts = []
      if (toppings.length > 0) parts.push(`Toppings: ${toppings.join(", ")}`)
      if (beverages.length > 0) parts.push(`Drinks: ${beverages.join(", ")}`)
      if (sides.length > 0) parts.push(`Sides: ${sides.join(", ")}`)
      description = `${selectedSize}" - ${parts.join(" | ")}`
    } else if (category === "pies") {
      description = `${selectedSize}" ${item.name}`
    } else if (category === "slices" && toppings.length > 0) {
      description = `Toppings: ${toppings.join(", ")}`
    }

    addItem({
      id: item.id,
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

                    {/* Size Selection for Pies */}
                    {activeCategory === "pies" && item.prices && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-cocoa-bean mb-2">Select Size:</p>
                        <div className="flex gap-2">
                          {Object.entries(item.prices).map(([size, price]) => (
                            <button
                              key={size}
                              onClick={() => handleSizeChange(item.id, size)}
                              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                                (selectedSizes[item.id] || "12") === size
                                  ? "bg-siam text-white"
                                  : "bg-venus/20 text-cocoa-bean hover:bg-venus/30"
                              }`}
                            >
                              {size}" - ${price}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Customization Toggle for applicable items */}
                    {(activeCategory === "pies" || activeCategory === "slices") &&
                      item.hasCustomization !== false && (
                        <button
                          onClick={() => toggleCustomization(item.id)}
                          className="text-sm text-siam hover:underline mb-2"
                        >
                          {showCustomization[item.id] ? "Hide" : "Show"} customization options
                        </button>
                      )}

                    {/* Customization Options */}
                    {showCustomization[item.id] && (
                      <div className="space-y-3 mb-4 p-3 bg-venus/10 rounded-lg">
                        {/* Toppings */}
                        {((activeCategory === "pies" && menuData.pies.toppingOptions) ||
                          (activeCategory === "slices" && menuData.slices.toppingOptions)) && (
                          <div>
                            <p className="text-xs font-medium text-cocoa-bean mb-1">Extra Toppings:</p>
                            <div className="flex flex-wrap gap-1">
                              {(activeCategory === "pies"
                                ? menuData.pies.toppingOptions
                                : menuData.slices.toppingOptions
                              ).map((topping) => (
                                <button
                                  key={topping}
                                  onClick={() => handleToppingToggle(item.id, topping)}
                                  className={`px-2 py-0.5 rounded text-xs transition-all ${
                                    (selectedToppings[item.id] || []).includes(topping)
                                      ? "bg-siam text-white"
                                      : "bg-white text-cocoa-bean hover:bg-venus/20"
                                  }`}
                                >
                                  {topping}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommended Beverages for Pies */}
                        {activeCategory === "pies" && menuData.pies.recommendedBeverages && (
                          <div>
                            <p className="text-xs font-medium text-cocoa-bean mb-1">Add Beverages:</p>
                            <div className="flex flex-wrap gap-1">
                              {menuData.pies.recommendedBeverages.map((bev) => (
                                <button
                                  key={bev.name}
                                  onClick={() => handleBeverageToggle(item.id, bev.name)}
                                  className={`px-2 py-0.5 rounded text-xs transition-all ${
                                    (selectedBeverages[item.id] || []).includes(bev.name)
                                      ? "bg-siam text-white"
                                      : "bg-white text-cocoa-bean hover:bg-venus/20"
                                  }`}
                                >
                                  {bev.name} +${bev.price.toFixed(2)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommended Sides for Pies */}
                        {activeCategory === "pies" && menuData.pies.recommendedSides && (
                          <div>
                            <p className="text-xs font-medium text-cocoa-bean mb-1">Add Sides:</p>
                            <div className="flex flex-wrap gap-1">
                              {menuData.pies.recommendedSides.map((side) => (
                                <button
                                  key={side.name}
                                  onClick={() => handleSideToggle(item.id, side.name)}
                                  className={`px-2 py-0.5 rounded text-xs transition-all ${
                                    (selectedSides[item.id] || []).includes(side.name)
                                      ? "bg-siam text-white"
                                      : "bg-white text-cocoa-bean hover:bg-venus/20"
                                  }`}
                                >
                                  {side.name} +${side.price.toFixed(2)}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
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
