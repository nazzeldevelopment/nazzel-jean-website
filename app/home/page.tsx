"use client"

import { Heart, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CoupleSpinnerLogo } from "@/components/couple-spinner-logo"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-accent/30 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-xl border-b border-border/50 shadow-xl shadow-primary/5">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-3 group">
              <div className="relative">
                <Heart className="w-8 h-8 text-primary fill-primary animate-pulse drop-shadow-lg" />
                <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-spin-slow" />
              </div>
              <span className="font-serif text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-sm">
                N & A
              </span>
            </Link>
            <div className="flex items-center gap-10 text-sm font-extrabold tracking-wider">
              <Link href="/home" className="text-foreground hover:text-primary transition-all relative group">
                HOME
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent scale-x-100 transition-transform" />
              </Link>
              <Link href="/about/story" className="text-foreground hover:text-primary transition-all relative group">
                OUR STORY
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all group-hover:w-full" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div
            className={`text-center space-y-16 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="flex justify-center pt-8">
              <CoupleSpinnerLogo />
            </div>

            <div className="space-y-8 pt-16">
              <h1 className="font-serif text-7xl md:text-9xl text-balance leading-tight font-bold">
                <span className="inline-block animate-fade-in-up bg-gradient-to-br from-primary to-primary/80 bg-clip-text text-transparent drop-shadow-2xl">
                  Nazzel
                </span>
                <span className="inline-block mx-8 text-6xl md:text-8xl">
                  <Heart className="inline-block text-primary fill-primary animate-pulse drop-shadow-2xl" />
                </span>
                <span className="inline-block animate-fade-in-up animation-delay-200 bg-gradient-to-br from-accent to-accent/80 bg-clip-text text-transparent drop-shadow-2xl">
                  Avionna
                </span>
              </h1>
              <p className="text-3xl md:text-5xl text-foreground/90 font-semibold animate-fade-in-up animation-delay-400 tracking-wide drop-shadow-lg">
                Our Love Story Forever
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8 pt-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 blur-3xl group-hover:blur-2xl transition-all" />
                <div className="relative bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-2xl border-2 border-primary/30 rounded-3xl p-12 md:p-20 space-y-10 shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.02] duration-500">
                  <h2 className="text-5xl md:text-7xl font-serif font-bold text-balance leading-tight text-foreground drop-shadow-md">
                    Hi! We're Nazzel & Avionna.
                  </h2>
                  <p className="text-3xl md:text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-extrabold drop-shadow-sm">
                    Two souls, one heart.
                  </p>
                  <p className="text-xl md:text-2xl leading-relaxed text-foreground font-medium">
                    Sa mundong puno ng ingay, kami ang tahimik na kwento ng tunay na pagmamahalan. Dito mo makikita ang
                    mga paborito naming moments, memories, at mga pangarap na sabay naming binubuo.
                  </p>
                  <div className="pt-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl" />
                    <p className="relative text-3xl md:text-5xl font-serif italic font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-relaxed drop-shadow-lg">
                      "Love isn't perfect — but ours is real."
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-16">
                <Link
                  href="/about/story"
                  className="inline-flex items-center gap-4 bg-gradient-to-r from-primary via-accent to-primary text-white px-12 py-6 rounded-full text-2xl font-extrabold hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-110 hover:-translate-y-2 shadow-xl shadow-primary/30 duration-300 drop-shadow-lg"
                >
                  Read Our Story
                  <Heart className="w-7 h-7 fill-current animate-pulse" />
                </Link>
              </div>
            </div>

            <div className="fixed inset-0 pointer-events-none -z-10">
              {[...Array(15)].map((_, i) => (
                <Heart
                  key={i}
                  className="absolute text-primary/30 fill-primary/30 animate-float drop-shadow-xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${25 + Math.random() * 50}px`,
                    height: `${25 + Math.random() * 50}px`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${4 + Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
