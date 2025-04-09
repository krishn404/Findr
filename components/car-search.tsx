"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { CarList } from "@/components/car-list"
import { SearchFilters } from "@/components/search-filters"
import type { Car } from "@/lib/types"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { SortOptions } from "@/components/sort-options"
import { useToast } from "@/components/ui/use-toast"
import React, { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Create a client component that uses the search params
function SearchParamsManager({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Get filter values from URL
  const brandFilter = searchParams.get("brand") || ""
  const searchQuery = searchParams.get("search") || ""
  const minPrice = searchParams.get("minPrice") ? Number.parseInt(searchParams.get("minPrice")!) : 0
  const maxPrice = searchParams.get("maxPrice") ? Number.parseInt(searchParams.get("maxPrice")!) : 1000000
  const fuelType = searchParams.get("fuelType") || ""
  const seatingCapacity = searchParams.get("seating") ? Number.parseInt(searchParams.get("seating")!) : 0
  const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
  const sortBy = searchParams.get("sort") || ""
  
  // Update URL with filters
  const updateFilters = (filters: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Update params with new filter values
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })

    // Reset to page 1 when filters change
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  // Function to reset filters
  const handleReset = () => {
    router.push(pathname)
  }

  // Clone children with the necessary props
  return React.cloneElement(children as React.ReactElement, {
    searchParams: {
      brandFilter,
      searchQuery,
      minPrice,
      maxPrice,
      fuelType,
      seatingCapacity,
      page,
      sortBy
    },
    actions: {
      updateFilters,
      handlePageChange,
      handleReset
    }
  })
}

type SearchParamsType = {
  brandFilter: string
  searchQuery: string
  minPrice: number
  maxPrice: number
  fuelType: string
  seatingCapacity: number
  page: number
  sortBy: string
}

type ActionsType = {
  updateFilters: (filters: Record<string, string | number>) => void
  handlePageChange: (page: number) => void
  handleReset: () => void
}

type CarSearchContentProps = {
  searchParams: SearchParamsType
  actions: ActionsType
}

function CarSearchContent({ searchParams, actions }: CarSearchContentProps) {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [brands, setBrands] = useState<string[]>([])
  const [fuelTypes, setFuelTypes] = useState<string[]>([])
  const [isMobileView, setIsMobileView] = useState(false)
  const [carsPerPage, setCarsPerPage] = useState(10)
  const [featuredCar, setFeaturedCar] = useState<Car | null>(null)
  const { toast } = useToast()

  const { 
    brandFilter, searchQuery, minPrice, maxPrice, 
    fuelType, seatingCapacity, page, sortBy 
  } = searchParams
  
  const { updateFilters, handlePageChange, handleReset } = actions

  // Fetch cars data
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/cars")
        if (!response.ok) {
          throw new Error(`Error fetching cars: ${response.status}`)
        }
        const data = await response.json()
        setCars(data)

        // Set a featured car (premium car with high price)
        const premiumCars = data.filter((car: Car) => car.price > 50000)
        if (premiumCars.length > 0) {
          setFeaturedCar(premiumCars[Math.floor(Math.random() * premiumCars.length)])
        } else {
          setFeaturedCar(data[Math.floor(Math.random() * data.length)])
        }

        // Extract unique brands and fuel types for filters
        const uniqueBrands = [...new Set(data.map((car: Car) => car.brand))].sort()
        const uniqueFuelTypes = [...new Set(data.map((car: Car) => car.fuelType))].sort()

        setBrands(uniqueBrands)
        setFuelTypes(uniqueFuelTypes)
      } catch (error) {
        console.error("Error fetching cars:", error)
        setError("Failed to load cars. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load cars. Please try again later.",
          variant: "destructive",
        })
      } finally {
        // Simulate longer loading for demo purposes
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }

    fetchCars()
  }, [toast])

  // Apply filters and sorting
  useEffect(() => {
    if (cars.length > 0) {
      let filtered = [...cars]

      // Apply search query filter
      if (searchQuery) {
        filtered = filtered.filter(
          (car) =>
            car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            car.model.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      // Apply brand filter
      if (brandFilter && brandFilter !== "all") {
        filtered = filtered.filter((car) => car.brand === brandFilter)
      }

      // Apply price range filter
      filtered = filtered.filter((car) => car.price >= minPrice && car.price <= maxPrice)

      // Apply fuel type filter
      if (fuelType && fuelType !== "all") {
        filtered = filtered.filter((car) => car.fuelType === fuelType)
      }

      // Apply seating capacity filter
      if (seatingCapacity > 0) {
        filtered = filtered.filter((car) => car.seatingCapacity >= seatingCapacity)
      }

      // Apply sorting
      if (sortBy) {
        if (sortBy === "price-asc") {
          filtered.sort((a, b) => a.price - b.price)
        } else if (sortBy === "price-desc") {
          filtered.sort((a, b) => b.price - a.price)
        } else if (sortBy === "year-desc") {
          filtered.sort((a, b) => b.year - a.year)
        } else if (sortBy === "year-asc") {
          filtered.sort((a, b) => a.year - b.year)
        }
      }

      setFilteredCars(filtered)
    }
  }, [cars, searchQuery, brandFilter, minPrice, maxPrice, fuelType, seatingCapacity, sortBy])

  // Add this effect to adjust cars per page based on screen size and check if mobile
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640
      setIsMobileView(isMobile)
      setCarsPerPage(isMobile ? 10 : 10)
    }

    // Set initial value
    handleResize()

    // Update on resize
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)
  const indexOfLastCar = page * carsPerPage
  const indexOfFirstCar = indexOfLastCar - carsPerPage
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <SearchFilters
          brands={brands}
          fuelTypes={fuelTypes}
          currentFilters={{
            search: searchQuery,
            brand: brandFilter,
            minPrice,
            maxPrice,
            fuelType,
            seating: seatingCapacity,
          }}
          updateFilters={updateFilters}
          loading={loading}
        />
      </div>
      <div className="lg:col-span-3">
        {error ? (
          <div className="text-center py-12 border rounded-xl">
            <h3 className="text-lg font-medium text-destructive">{error}</h3>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 rounded-full">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {loading ? <Skeleton className="h-5 w-32" /> : `Found ${filteredCars.length} cars`}
              </div>
              <SortOptions currentSort={sortBy} updateSort={(sort) => updateFilters({ sort })} loading={loading} />
            </div>

            <AnimatePresence mode="wait">
              {!loading && filteredCars.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileView ? (
                    <div className="space-y-4">
                      {/* 2x5 grid layout for mobile */}
                      <div className="grid grid-cols-2 gap-3">
                        {currentCars.map((car, index) => (
                          <motion.div
                            key={car.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="border rounded-xl overflow-hidden hover:shadow-md transition-all group bg-card"
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link href={`/cars/${car.id}`} className="block h-full flex flex-col">
                              <div className="relative aspect-[4/3] w-full">
                                <Image
                                  src={car.image || `/placeholder.svg?height=400&width=600`}
                                  alt={`${car.brand} ${car.model}`}
                                  fill
                                  className="object-cover"
                                />
                                {car.year >= new Date().getFullYear() - 1 && (
                                  <Badge className="absolute top-1 left-1 bg-primary text-xs">New</Badge>
                                )}
                              </div>
                              <div className="p-2 flex-1 flex flex-col">
                                <h3 className="font-medium text-sm truncate">
                                  {car.brand} {car.model}
                                </h3>
                                <p className="text-sm font-semibold text-primary mt-1">{formatCurrency(car.price)}</p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                  <span>{car.year}</span>
                                  <span>•</span>
                                  <span>{car.fuelType}</span>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <CarList cars={currentCars} />
                  )}

                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        {page > 1 && (
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => handlePageChange(page - 1)}
                              className="rounded-full"
                            />
                          </PaginationItem>
                        )}

                        {/* Show limited page numbers on mobile */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((pageNum) => {
                            // On mobile, only show current page and adjacent pages
                            return (
                              !isMobileView ||
                              pageNum === 1 ||
                              pageNum === totalPages ||
                              Math.abs(pageNum - page) <= 1 ||
                              (pageNum === 2 && page === 1) ||
                              (pageNum === totalPages - 1 && page === totalPages)
                            )
                          })
                          .map((pageNum, i, filteredPages) => (
                            <React.Fragment key={pageNum}>
                              {i > 0 && filteredPages[i - 1] !== pageNum - 1 && (
                                <PaginationItem>
                                  <span className="flex h-9 w-9 items-center justify-center">...</span>
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  isActive={pageNum === page}
                                  onClick={() => handlePageChange(pageNum)}
                                  className="rounded-full"
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          ))}

                        {page < totalPages && (
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => handlePageChange(page + 1)}
                              className="rounded-full"
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                </motion.div>
              ) : !loading && filteredCars.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12 border rounded-xl"
                >
                  <h3 className="text-lg font-medium">No cars found</h3>
                  <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
                  <Button onClick={handleReset} variant="outline" className="mt-4 rounded-full">
                    Reset Filters
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <CarList loading={true} cars={[]} />
                </div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}

export function CarSearch() {
  return (
    <Suspense fallback={<div>Loading car search...</div>}>
      <SearchParamsManager>
        <CarSearchContent searchParams={{} as SearchParamsType} actions={{} as ActionsType} />
      </SearchParamsManager>
    </Suspense>
  )
}