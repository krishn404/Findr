"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, Sun, Moon, ChevronLeft, Home } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function Navbar() {
  const pathname = usePathname()
  const { wishlist } = useWishlist()
  const { setTheme, theme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Dispatch theme change event for IndexedDB storage
  useEffect(() => {
    if (theme) {
      window.dispatchEvent(
        new CustomEvent("theme-change", {
          detail: { theme },
        }),
      )
    }
  }, [theme])

  const isDetailsPage = pathname.startsWith("/cars/")

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {isDetailsPage ? (
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/">
            </Link>
          </Button>
        ) : (
          <Link href="/" className="text-xl font-semibold flex items-center gap-2">
            <img src="/findr.png" alt="Findr" className="h-20 w-20" />
          </Link>
        )}

        <div className="flex-1 mx-4">
          {isDetailsPage && <h1 className="text-center text-base font-medium truncate">Car Details</h1>}
        </div>

        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/">
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild className="rounded-full relative">
            <Link href="/wishlist">
              <Heart
                className={`h-5 w-5 transition-colors ${pathname === "/wishlist" ? "text-primary fill-primary" : ""}`}
              />
              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  )
} 