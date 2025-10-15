"use client"

import { CoupleSpinnerLogo } from "./couple-spinner-logo"
import { Heart, Sparkles } from "lucide-react"

export function EnhancedHeader() {
  return (
    <header className="relative py-8 px-4 text-center overflow-hidden">
      {/* Floating hearts animation */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-4 left-1/4 w-6 h-6 text-rose-300 animate-float opacity-30" />
        <Heart className="absolute top-8 right-1/3 w-4 h-4 text-pink-300 animate-float animation-delay-300 opacity-40" />
        <Sparkles className="absolute top-6 left-1/3 w-5 h-5 text-rose-400 animate-sparkle animation-delay-500" />
        <Sparkles className="absolute top-10 right-1/4 w-4 h-4 text-pink-400 animate-sparkle animation-delay-700" />
      </div>

      <div className="relative z-10 space-y-4">
        <CoupleSpinnerLogo />
        <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-clip-text text-transparent animate-fade-in-up">
          Forum Discussions
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-medium animate-fade-in-up animation-delay-200 flex items-center justify-center gap-2 flex-wrap">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 inline animate-pulse-heart" />
          <span className="text-balance">Two hearts, one forum — where our story continues forever</span>
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 inline animate-pulse-heart animation-delay-300" />
        </p>
      </div>
    </header>
  )
}
