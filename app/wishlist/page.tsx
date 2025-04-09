import { WishlistView } from "@/components/wishlist-view"

export default function WishlistPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <WishlistView />
    </main>
  )
}
