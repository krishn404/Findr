import { CarDetails } from "@/components/car-details"
import { getCarById } from "@/lib/data"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CarDetailsSkeleton } from "@/components/car-skeleton"

export default async function CarDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const car = await getCarById(Number.parseInt(params.id))

  if (!car) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
      <Suspense fallback={<CarDetailsSkeleton />}>
        <CarDetails car={car} />
      </Suspense>
    </main>
  )
}
