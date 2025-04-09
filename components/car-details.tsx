"use client"

import type { Car } from "@/lib/types"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import { useWishlist } from "@/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Calendar,
  Fuel,
  Users,
  Gauge,
  Cog,
  DollarSign,
  Info,
  Shield,
  Check,
  ChevronLeft,
  Share2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { CarDetailsSkeleton } from "@/components/car-skeleton"
import { useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface CarDetailsProps {
  car: Car
  loading?: boolean
}

export function CarDetails({ car, loading = false }: CarDetailsProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()
  const [relatedCars, setRelatedCars] = useState<Car[]>([])

  useEffect(() => {
    setMounted(true)

    // Fetch related cars
    const fetchRelatedCars = async () => {
      try {
        const response = await fetch("/api/cars")
        if (response.ok) {
          const allCars = await response.json()
          // Filter cars by same brand or similar price range (±20%)
          const related = allCars
            .filter(
              (c: Car) =>
                c.id !== car.id &&
                (c.brand === car.brand ||
                  c.fuelType === car.fuelType ||
                  (c.price >= car.price * 0.8 && c.price <= car.price * 1.2)),
            )
            .slice(0, 4)
          setRelatedCars(related)
        }
      } catch (error) {
        console.error("Error fetching related cars:", error)
      }
    }

    fetchRelatedCars()
  }, [car])

  const handleWishlistToggle = async () => {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.brand} ${car.model}`,
          text: `Check out this ${car.year} ${car.brand} ${car.model} for ${formatCurrency(car.price)}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Car details link copied to clipboard",
      })
    }
  }

  if (loading || !mounted) {
    return <CarDetailsSkeleton />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed top-[4.5rem] left-4 z-10 lg:hidden"
        >
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm shadow-md"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-[4/3] w-full rounded-xl overflow-hidden"
          >
            <Image
              src={car.image || `/placeholder.svg?height=600&width=800`}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover"
              priority
            />
            {car.year >= new Date().getFullYear() - 1 && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">New Model</Badge>
            )}
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="rounded-xl border-none shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-3">
                  <Calendar className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-xs font-medium">Year</span>
                  <span className="text-sm">{car.year}</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="rounded-xl border-none shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-3">
                  <Fuel className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-xs font-medium">Fuel</span>
                  <span className="text-sm">{car.fuelType}</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="rounded-xl border-none shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-3">
                  <Users className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-xs font-medium">Seats</span>
                  <span className="text-sm">{car.seatingCapacity}</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <Card className="rounded-xl border-none shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-3">
                  <Gauge className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-xs font-medium">Mileage</span>
                  <span className="text-sm">{car.mileage} km</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="rounded-xl border-none shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-3">
                  <Cog className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-xs font-medium">Trans.</span>
                  <span className="text-sm truncate">{car.transmission}</span>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card className="rounded-xl border-none shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-3">
                  <DollarSign className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-xs font-medium">Price</span>
                  <span className="text-sm">{formatCurrency(car.price)}</span>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-start"
          >
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-muted-foreground">{car.year}</p>
            </div>
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full">
                  <Share2 size={18} />
                  <span className="sr-only">Share</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={isInWishlist(car.id) ? "default" : "outline"}
                  onClick={handleWishlistToggle}
                  className="flex items-center gap-2 rounded-full"
                  size={isMobile ? "sm" : "default"}
                >
                  <Heart className={isInWishlist(car.id) ? "fill-white" : ""} size={isMobile ? 16 : 18} />
                  {isInWishlist(car.id) ? "Remove" : "Add to Wishlist"}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mt-4 md:mt-6"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(car.price)}</h2>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Estimated monthly payment: {formatCurrency(car.price / 60)} for 60 months
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Tabs defaultValue="overview" className="mt-6 md:mt-8">
              <TabsList className="grid w-full grid-cols-3 rounded-full p-1">
                <TabsTrigger value="overview" className="rounded-full text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="features" className="rounded-full text-sm">
                  Features
                </TabsTrigger>
                <TabsTrigger value="specs" className="rounded-full text-sm">
                  Specs
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-semibold">Description</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{car.description}</p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Card className="rounded-xl border-none shadow-sm">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                          <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          <h4 className="font-medium text-sm md:text-base">Safety</h4>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          This vehicle comes with advanced safety features including ABS, multiple airbags, and
                          electronic stability control.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-xl border-none shadow-sm">
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                          <Info className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                          <h4 className="font-medium text-sm md:text-base">Warranty</h4>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Includes a 3-year/36,000-mile basic warranty and a 5-year/60,000-mile powertrain warranty.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-4">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 md:gap-2">
                  <AnimatePresence>
                    {car.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                      >
                        <Check className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                        <span className="text-sm md:text-base">{feature}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-4">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Technical Specifications</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Engine Type</span>
                        <span className="text-sm font-medium">
                          {car.fuelType === "Electric" ? "Electric Motor" : `${car.fuelType} Engine`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Transmission</span>
                        <span className="text-sm font-medium">{car.transmission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Drive Type</span>
                        <span className="text-sm font-medium">{car.brand === "Subaru" ? "AWD" : "FWD"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Horsepower</span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 200) + 150} hp</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fuel Economy (City)</span>
                        <span className="text-sm font-medium">
                          {car.fuelType === "Electric" ? "N/A" : `${Math.floor(Math.random() * 10) + 20} mpg`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fuel Economy (Highway)</span>
                        <span className="text-sm font-medium">
                          {car.fuelType === "Electric" ? "N/A" : `${Math.floor(Math.random() * 10) + 30} mpg`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cargo Space</span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 10} cu ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Curb Weight</span>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 1000) + 3000} lbs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4 sticky bottom-4 md:relative md:bottom-0"
          >
            <Button className="flex-1 rounded-full" size={isMobile ? "default" : "lg"}>
              Contact Dealer
            </Button>
            <Button variant="outline" className="flex-1 rounded-full" size={isMobile ? "default" : "lg"}>
              Schedule Test Drive
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Related Cars Section */}
      {relatedCars.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedCars.map((relatedCar, index) => (
              <motion.div
                key={relatedCar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="border rounded-xl overflow-hidden hover:shadow-md transition-all group bg-card"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={`/cars/${relatedCar.id}`} className="block">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={relatedCar.image || "/placeholder.svg"}
                      alt={`${relatedCar.brand} ${relatedCar.model}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                      {relatedCar.brand} {relatedCar.model}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-muted-foreground">{relatedCar.year}</p>
                      <p className="text-sm font-semibold text-primary">{formatCurrency(relatedCar.price)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
