"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { saveTheme, getTheme } from "@/lib/db"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Load theme from IndexedDB
  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await getTheme()
        if (savedTheme && props.setTheme) {
          props.setTheme(savedTheme)
        }
      } catch (error) {
        console.error("Failed to load theme from IndexedDB:", error)
      } finally {
        setMounted(true)
      }
    }

    loadTheme()
  }, [])

  // Save theme to IndexedDB when it changes
  React.useEffect(() => {
    if (!mounted) return

    const handleThemeChange = (theme: string) => {
      saveTheme(theme).catch((error) => {
        console.error("Failed to save theme to IndexedDB:", error)
      })
    }

    // Subscribe to theme changes
    window.addEventListener("theme-change", (e: any) => {
      if (e.detail?.theme) {
        handleThemeChange(e.detail.theme)
      }
    })

    return () => {
      window.removeEventListener("theme-change", (e: any) => {
        if (e.detail?.theme) {
          handleThemeChange(e.detail.theme)
        }
      })
    }
  }, [mounted])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
