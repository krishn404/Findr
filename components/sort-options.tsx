"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface SortOptionsProps {
  currentSort: string
  updateSort: (sort: string) => void
  loading?: boolean
}

export function SortOptions({ currentSort, updateSort, loading = false }: SortOptionsProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={currentSort} onValueChange={updateSort}>
        <SelectTrigger className="w-[180px] rounded-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="year-desc">Year: Newest First</SelectItem>
          <SelectItem value="year-asc">Year: Oldest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
