"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchFiltersProps {
  brands: string[]
  fuelTypes: string[]
  currentFilters: {
    search: string
    brand: string
    minPrice: number
    maxPrice: number
    fuelType: string
    seating: number
  }
  updateFilters: (filters: Record<string, string | number>) => void
  loading?: boolean
}

export function SearchFilters({
  brands,
  fuelTypes,
  currentFilters,
  updateFilters,
  loading = false,
}: SearchFiltersProps) {
  const [search, setSearch] = useState(currentFilters.search)
  const [brand, setBrand] = useState(currentFilters.brand)
  const [priceRange, setPriceRange] = useState([currentFilters.minPrice, currentFilters.maxPrice])
  const [fuelType, setFuelType] = useState(currentFilters.fuelType)
  const [seating, setSeating] = useState(currentFilters.seating.toString())
  const [isOpen, setIsOpen] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Update local state when URL params change
  useEffect(() => {
    setSearch(currentFilters.search)
    setBrand(currentFilters.brand)
    setPriceRange([currentFilters.minPrice, currentFilters.maxPrice])
    setFuelType(currentFilters.fuelType)
    setSeating(currentFilters.seating.toString())
  }, [currentFilters])

  const handleSearch = () => {
    updateFilters({
      search,
      brand,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      fuelType,
      seating: Number.parseInt(seating || "0"),
    })

    if (isMobile) {
      setIsOpen(false)
    }
  }

  const handleReset = () => {
    setSearch("")
    setBrand("")
    setPriceRange([0, 1000000])
    setFuelType("")
    setSeating("0")

    updateFilters({
      search: "",
      brand: "",
      minPrice: 0,
      maxPrice: 1000000,
      fuelType: "",
      seating: 0,
    })
  }

  // Count active filters
  const activeFilterCount = [
    search,
    brand && brand !== "all",
    priceRange[0] > 0 || priceRange[1] < 1000000,
    fuelType && fuelType !== "all",
    seating && seating !== "0" && seating !== "any",
  ].filter(Boolean).length

  const filterContent = (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      {loading ? (
        <>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="search">Search</Label>
              {search && (
                <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => setSearch("")}>
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by brand or model"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 rounded-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger id="brand" className="rounded-full">
                <SelectValue placeholder="All brands" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Price Range</Label>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </span>
            </div>
            <Slider
              defaultValue={[0, 1000000]}
              min={0}
              max={1000000}
              step={10000}
              value={priceRange}
              onValueChange={setPriceRange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select value={fuelType} onValueChange={setFuelType}>
              <SelectTrigger id="fuelType" className="rounded-full">
                <SelectValue placeholder="All fuel types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All fuel types</SelectItem>
                {fuelTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seating">Minimum Seating Capacity</Label>
            <Select value={seating} onValueChange={setSeating}>
              <SelectTrigger id="seating" className="rounded-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
                <SelectItem value="7">7+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={handleSearch} className="rounded-full">
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleReset} className="rounded-full">
              Reset Filters
            </Button>
          </div>
        </>
      )}
    </motion.div>
  )

  // Mobile view
  if (isMobile) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full"
                whileTap={{ scale: 0.95 }}
                as={motion.button}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5"
                  >
                    {activeFilterCount}
                  </motion.span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-[20px] h-[85vh] p-6">
              <SheetHeader className="pb-2 border-b mb-4">
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4 pb-16 overflow-y-auto max-h-[calc(85vh-80px)]">{filterContent}</div>
            </SheetContent>
          </Sheet>

          <div className="relative flex-1 max-w-sm ml-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Quick search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                if (e.target.value === "") {
                  updateFilters({ search: "" })
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateFilters({ search })
                }
              }}
              className="pl-9 rounded-full"
            />
          </div>
        </div>
      </>
    )
  }

  // Desktop view
  return (
    <div className="space-y-6 sticky top-20">
      <div className="border rounded-xl p-4 shadow-sm bg-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                {activeFilterCount}
              </span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="h-8 w-8 p-0 rounded-full">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filterContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
