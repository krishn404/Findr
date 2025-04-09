import { CarSearch } from "@/components/car-search"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Find Your Perfect Car</h1>
      <p className="text-muted-foreground mb-8">Browse our extensive collection of vehicles to find your ideal match</p>
      <CarSearch />
    </main>
  )
}
