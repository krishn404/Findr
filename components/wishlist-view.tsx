"use client"

import { useWishlist } from "@/hooks/use-wishlist"
import { CarList } from "@/components/car-list"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

export function WishlistView() {
  const { wishlist, clearWishlist, loading } = useWishlist()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16"
      >
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-medium">Your wishlist is empty</h2>
        <p className="mt-2 text-muted-foreground">Start adding cars to your wishlist to save them for later.</p>
        <div className="mt-6">
          <Button asChild className="rounded-full">
            <Link href="/">Browse Cars</Link>
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-8">
        <p className="text-muted-foreground">
          {wishlist.length} {wishlist.length === 1 ? "car" : "cars"} in your wishlist
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="rounded-full">
              Clear Wishlist
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Clear wishlist?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove all cars from your wishlist.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => clearWishlist()} className="rounded-full">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Clear Wishlist
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CarList cars={wishlist} />
    </motion.div>
  )
}
