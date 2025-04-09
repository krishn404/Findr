import { Skeleton } from "@/components/ui/skeleton"

export function CarSkeleton() {
  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <div className="relative">
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="absolute top-2 right-2">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function CarDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
