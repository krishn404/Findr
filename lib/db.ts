import { openDB, type DBSchema, type IDBPDatabase } from "idb"
import type { Car } from "./types"

interface CarFinderDB extends DBSchema {
  wishlist: {
    key: number
    value: Car
    indexes: { "by-id": number }
  }
  settings: {
    key: string
    value: {
      theme: string
      lastVisited: number
    }
  }
}

let dbPromise: Promise<IDBPDatabase<CarFinderDB>> | null = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<CarFinderDB>("car-finder-db", 1, {
      upgrade(db) {
        // Create a store of objects
        const wishlistStore = db.createObjectStore("wishlist", {
          // The 'id' property of the object will be the key.
          keyPath: "id",
        })
        // Create an index on the 'id' property of the objects.
        wishlistStore.createIndex("by-id", "id")

        // Create a settings store
        db.createObjectStore("settings", {
          keyPath: "id",
        })
      },
    })
  }
  return dbPromise
}

// Wishlist operations
export async function getWishlist(): Promise<Car[]> {
  try {
    const db = await getDB()
    return db.getAll("wishlist")
  } catch (error) {
    console.error("Error getting wishlist from IndexedDB:", error)
    return []
  }
}

export async function addToWishlist(car: Car): Promise<void> {
  try {
    const db = await getDB()
    await db.put("wishlist", car)
  } catch (error) {
    console.error("Error adding to wishlist in IndexedDB:", error)
  }
}

export async function removeFromWishlist(id: number): Promise<void> {
  try {
    const db = await getDB()
    await db.delete("wishlist", id)
  } catch (error) {
    console.error("Error removing from wishlist in IndexedDB:", error)
  }
}

export async function clearWishlist(): Promise<void> {
  try {
    const db = await getDB()
    await db.clear("wishlist")
  } catch (error) {
    console.error("Error clearing wishlist in IndexedDB:", error)
  }
}

export async function isInWishlist(id: number): Promise<boolean> {
  try {
    const db = await getDB()
    const item = await db.get("wishlist", id)
    return !!item
  } catch (error) {
    console.error("Error checking wishlist in IndexedDB:", error)
    return false
  }
}

// Settings operations
export async function saveTheme(theme: string): Promise<void> {
  try {
    const db = await getDB()
    await db.put("settings", {
      id: "theme",
      theme,
      lastVisited: Date.now(),
    })
  } catch (error) {
    console.error("Error saving theme in IndexedDB:", error)
  }
}

export async function getTheme(): Promise<string | null> {
  try {
    const db = await getDB()
    const setting = await db.get("settings", "theme")
    return setting?.theme || null
  } catch (error) {
    console.error("Error getting theme from IndexedDB:", error)
    return null
  }
}
