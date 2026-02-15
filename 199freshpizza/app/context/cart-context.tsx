"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
}

function calculateTotals(items: CartItem[]) {
  const total = items.reduce((sum, item) => {
    const price = typeof item.price === "number" ? item.price : 0
    const quantity = typeof item.quantity === "number" ? item.quantity : 0
    return sum + price * quantity
  }, 0)

  const itemCount = items.reduce((sum, item) => {
    const quantity = typeof item.quantity === "number" ? item.quantity : 0
    return sum + quantity
  }, 0)

  return { total, itemCount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  try {
    switch (action.type) {
      case "LOAD_CART": {
        // Validate loaded cart data
        if (!action.payload || !Array.isArray(action.payload.items)) {
          return initialState
        }
        return action.payload
      }

      case "ADD_ITEM": {
        // Validate item data
        if (!action.payload || typeof action.payload.price !== "number") {
          console.error("Invalid item data:", action.payload)
          return state
        }

        const existingItem = state.items.find((item) => item.id === action.payload.id)

        let newItems: CartItem[]
        if (existingItem) {
          newItems = state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        } else {
          newItems = [...state.items, { ...action.payload, quantity: 1 }]
        }

        const { total, itemCount } = calculateTotals(newItems)
        return { items: newItems, total, itemCount }
      }

      case "REMOVE_ITEM": {
        const newItems = state.items.filter((item) => item.id !== action.payload)
        const { total, itemCount } = calculateTotals(newItems)
        return { items: newItems, total, itemCount }
      }

      case "UPDATE_QUANTITY": {
        const newItems = state.items
          .map((item) =>
            item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item,
          )
          .filter((item) => item.quantity > 0)

        const { total, itemCount } = calculateTotals(newItems)
        return { items: newItems, total, itemCount }
      }

      case "CLEAR_CART":
        return initialState

      default:
        return state
    }
  } catch (error) {
    console.error("Cart reducer error:", error)
    return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedCart = localStorage.getItem("pizza-cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        // Validate the parsed cart structure
        if (parsedCart && Array.isArray(parsedCart.items)) {
          dispatch({ type: "LOAD_CART", payload: parsedCart })
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      // Clear corrupted data
      localStorage.removeItem("pizza-cart")
    }
  }, [])

  // Save cart to localStorage whenever state changes (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("pizza-cart", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [state])

  const addItem = (item: Omit<CartItem, "quantity">) => {
    try {
      dispatch({ type: "ADD_ITEM", payload: item })
    } catch (error) {
      console.error("Error adding item to cart:", error)
    }
  }

  const removeItem = (id: number) => {
    try {
      dispatch({ type: "REMOVE_ITEM", payload: id })
    } catch (error) {
      console.error("Error removing item from cart:", error)
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    try {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    } catch (error) {
      console.error("Error updating cart quantity:", error)
    }
  }

  const clearCart = () => {
    try {
      dispatch({ type: "CLEAR_CART" })
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
