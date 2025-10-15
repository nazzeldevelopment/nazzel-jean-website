"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Theme = "light" | "dark"
type AccentColor = "rose" | "cream" | "lavender"

export function ThemeCustomizer() {
  const [theme, setTheme] = useState<Theme>("light")
  const [accentColor, setAccentColor] = useState<AccentColor>("rose")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme
      const savedAccent = localStorage.getItem("accentColor") as AccentColor

      if (savedTheme) {
        setTheme(savedTheme)
        document.documentElement.classList.toggle("dark", savedTheme === "dark")
      }

      if (savedAccent) {
        setAccentColor(savedAccent)
        applyAccentColor(savedAccent)
      }
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme)
    }
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const applyAccentColor = (color: AccentColor) => {
    const root = document.documentElement

    switch (color) {
      case "rose":
        root.style.setProperty("--primary", "oklch(0.62 0.18 15)")
        break
      case "cream":
        root.style.setProperty("--primary", "oklch(0.85 0.05 75)")
        break
      case "lavender":
        root.style.setProperty("--primary", "oklch(0.65 0.15 290)")
        break
    }
  }

  const changeAccentColor = (color: AccentColor) => {
    setAccentColor(color)
    if (typeof window !== "undefined") {
      localStorage.setItem("accentColor", color)
    }
    applyAccentColor(color)
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="rounded-full bg-card shadow-lg hover:shadow-xl transition-all btn-glow"
      >
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-card shadow-lg hover:shadow-xl transition-all btn-glow"
          >
            <Palette className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => changeAccentColor("rose")}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-rose-400" />
              <span>Rose</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeAccentColor("cream")}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-100" />
              <span>Cream</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => changeAccentColor("lavender")}>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-300" />
              <span>Lavender</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
