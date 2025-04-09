"use client"

import type React from "react"
import type { Car } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import { useWishlist } from "@/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { Heart, Fuel, Users, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { CarSkeleton } from "@/components/car-skeleton"
import { useEffect, useState } from "react"

interface CarListProps {
  cars: Car[]
  loading?: boolean
}

export function CarList({ cars, loading = false }: CarListProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleWishlistToggle = async (e: React.MouseEvent, car: Car) => {
    e.preventDefault()
    e.stopPropagation()

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    if (isInWishlist(car.id)) {
      await removeFromWishlist(car.id)
      toast({
        title: "Removed from wishlist",
        description: `${car.brand} ${car.model} has been removed from your wishlist.`,
      })
    } else {
      await addToWishlist(car)
      toast({
        title: "Added to wishlist",
        description: `${car.brand} ${car.model} has been added to your wishlist.`,
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <CarSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AnimatePresence>
        {cars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="border rounded-xl overflow-hidden hover:shadow-md transition-all group bg-card"
            whileTap={{ scale: 0.98 }}
          >
            <Link href={`/cars/${car.id}`} className="block">
              <div className="relative h-48 w-full">
                <Image
                  src={car.image || `/placeholder.svg?height=400&width=600`}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full z-10 transition-transform group-hover:scale-110"
                    onClick={(e) => handleWishlistToggle(e, car)}
                  >
                    <Heart
                      className={`h-5 w-5 transition-colors ${isInWishlist(car.id) ? "fill-red-500 text-red-500" : ""}`}
                    />
                    <span className="sr-only">{isInWishlist(car.id) ? "Remove from wishlist" : "Add to wishlist"}</span>
                  </Button>
                )}
                {car.year >= new Date().getFullYear() - 1 && (
                  <Badge className="absolute top-2 left-2 bg-primary">New Model</Badge>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-lg font-semibold text-primary">{formatCurrency(car.price)}</p>
                </div>

                {/* Mobile-optimized specs display */}
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{car.year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-4 w-4 text-primary" />
                    <span>{car.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{car.seatingCapacity}</span>
                  </div>
                </div>

                {/* Simplified action area */}
                <div className="mt-4 flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
