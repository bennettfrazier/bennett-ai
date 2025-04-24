"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "dark" | "light"
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme", // Changed from "claude-theme" to "theme" to match ThemeScript
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light")
  const [mounted, setMounted] = useState(false)

  // Update theme when component mounts
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem(storageKey)

    if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
      setTheme(savedTheme as Theme)
    } else {
      setTheme(defaultTheme)
    }
  }, [defaultTheme, storageKey])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    let resolvedTheme: "light" | "dark"
    if (theme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    } else {
      resolvedTheme = theme as "light" | "dark"
    }

    root.classList.add(resolvedTheme)
    setResolvedTheme(resolvedTheme)

    // Store the theme preference
    localStorage.setItem(storageKey, theme)
  }, [theme, mounted, storageKey])

  // Prevent theme flash by hiding content until mounted
  if (!mounted) {
    // Don't render a script here anymore since we have ThemeScript
    // Just return children with no visibility changes
    return <>{children}</>
  }

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
    resolvedTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
