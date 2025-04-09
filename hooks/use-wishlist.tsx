"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { Car } from "@/lib/types"
import {
  getWishlist,
  addToWishlist as addToWishlistDB,
  removeFromWishlist as removeFromWishlistDB,
  clearWishlist as clearWishlistDB,
} from "@/lib/db"

interface WishlistContextType {
  wishlist: Car[]
  loading: boolean
  addToWishlist: (car: Car) => Promise<void>
  removeFromWishlist: (id: number) => Promise<void>
  clearWishlist: () => Promise<void>
  isInWishlist: (id: number) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [wishlistMap, setWishlistMap] = useState<Record<number, boolean>>({})

  // Load wishlist from IndexedDB on mount
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true)
        const items = await getWishlist()
        setWishlist(items)

        // Create a map for faster lookups
        const map: Record<number, boolean> = {}
        items.forEach((item) => {
          map[item.id] = true
        })
        setWishlistMap(map)
      } catch (error) {
        console.error("Failed to load wishlist from IndexedDB:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [])

  const addToWishlist = async (car: Car) => {
    try {
      await addToWishlistDB(car)
      setWishlist((prev) => {
        if (prev.some((item) => item.id === car.id)) {
          return prev
        }
        return [...prev, car]
      })
      setWishlistMap((prev) => ({ ...prev, [car.id]: true }))
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
    }
  }

  const removeFromWishlist = async (id: number) => {
    try {
      await removeFromWishlistDB(id)
      setWishlist((prev) => prev.filter((car) => car.id !== id))
      setWishlistMap((prev) => {
        const newMap = { ...prev }
        delete newMap[id]
        return newMap
      })
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
    }
  }

  const clearWishlist = async () => {
    try {
      await clearWishlistDB()
      setWishlist([])
      setWishlistMap({})
    } catch (error) {
      console.error("Failed to clear wishlist:", error)
    }
  }

  const isInWishlist = (id: number) => {
    return !!wishlistMap[id]
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
