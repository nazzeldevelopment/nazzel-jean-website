"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Card } from "@/components/ui/card"

const loveQuotes = [
  "Two hearts, one soul, forever intertwined.",
  "In your eyes, I found my home.",
  "Every love story is beautiful, but ours is my favorite.",
  "You are my today and all of my tomorrows.",
  "Together is a wonderful place to be.",
  "Love is not about how many days, but how much love fills those days.",
  "You're my person, my forever.",
  "In a sea of people, my eyes will always search for you.",
]

export function DailyLoveQuote() {
  const [quote, setQuote] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get quote based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setQuote(loveQuotes[dayOfYear % loveQuotes.length])

    // Fade in animation
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <Card
      className={`p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-start gap-4">
        <Heart className="w-6 h-6 text-primary animate-pulse-heart flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-serif text-lg font-semibold text-primary mb-2">Daily Love Quote</h3>
          <p className="text-foreground/80 italic leading-relaxed">{quote}</p>
        </div>
      </div>
    </Card>
  )
}
