"use client"

import { Heart, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function CoupleSpinnerLogo() {
  const quotes = [
    "Forever starts with you",
    "Two hearts, one love",
    "You're my favorite hello",
    "Together is our favorite place",
    "Love you to the moon and back",
    "My heart is yours",
    "You complete me",
    "Soulmates forever",
    "Ikaw ang dahilan",
    "Mahal kita hanggang dulo",
  ]

  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96">
      <div
        className="absolute inset-0 rounded-full border-[6px] border-transparent bg-gradient-to-r from-primary via-accent to-primary animate-spin-slow shadow-2xl shadow-primary/30"
        style={{
          backgroundSize: "200% 200%",
          backgroundImage: "linear-gradient(90deg, var(--primary), var(--accent), var(--primary))",
        }}
      />
      <div
        className="absolute inset-3 rounded-full border-4 border-transparent bg-gradient-to-l from-accent via-primary to-accent animate-spin-reverse shadow-xl shadow-accent/20"
        style={{
          backgroundSize: "200% 200%",
          backgroundImage: "linear-gradient(270deg, var(--accent), var(--primary), var(--accent))",
        }}
      />

      <div className="absolute inset-6 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl animate-pulse" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Two hearts representing the couple with enhanced styling */}
          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <Heart className="w-20 h-20 md:w-28 md:h-28 text-primary fill-primary animate-pulse drop-shadow-2xl" />
              <div className="absolute inset-0 w-20 h-20 md:w-28 md:h-28 bg-primary/40 blur-2xl rounded-full animate-pulse" />
            </div>
            <div className="relative">
              <Heart className="w-20 h-20 md:w-28 md:h-28 text-accent fill-accent animate-pulse animation-delay-500 drop-shadow-2xl" />
              <div className="absolute inset-0 w-20 h-20 md:w-28 md:h-28 bg-accent/40 blur-2xl rounded-full animate-pulse animation-delay-500" />
            </div>
          </div>
          <Sparkles className="absolute -top-4 -left-4 w-9 h-9 text-primary animate-pulse drop-shadow-xl" />
          <Sparkles className="absolute -bottom-4 -right-4 w-9 h-9 text-accent animate-pulse animation-delay-300 drop-shadow-xl" />
          <Sparkles className="absolute top-1/2 -right-6 w-7 h-7 text-primary animate-pulse animation-delay-500 drop-shadow-xl" />
          <Sparkles className="absolute top-1/2 -left-6 w-7 h-7 text-accent animate-pulse animation-delay-700 drop-shadow-xl" />
        </div>
      </div>

      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full text-center px-4">
        <p
          key={currentQuote}
          className="text-xl md:text-2xl font-serif italic bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in-up drop-shadow-lg font-bold"
        >
          "{quotes[currentQuote]}"
        </p>
      </div>

      {[...Array(16)].map((_, i) => (
        <Heart
          key={i}
          className="absolute w-4 h-4 md:w-5 md:h-5 text-primary/60 fill-primary/60 drop-shadow-lg"
          style={{
            top: "50%",
            left: "50%",
            transform: `rotate(${i * 22.5}deg) translateY(-150px)`,
            animation: `orbit ${10 + (i % 3)}s linear infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  )
}
