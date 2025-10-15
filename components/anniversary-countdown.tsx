"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Heart } from "lucide-react"

export function AnniversaryCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [showPopup, setShowPopup] = useState(false)

  // Anniversary date: September 25
  const getNextAnniversary = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    let anniversary = new Date(currentYear, 8, 25) // Month is 0-indexed, so 8 = September

    // If anniversary has passed this year, get next year's
    if (now > anniversary) {
      anniversary = new Date(currentYear + 1, 8, 25)
    }

    return anniversary
  }

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const anniversary = getNextAnniversary()
      const difference = anniversary.getTime() - now.getTime()

      if (difference <= 0) {
        setShowPopup(true)
        setTimeout(() => setShowPopup(false), 10000) // Hide after 10 seconds
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <Card className="p-6 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30 border-primary/30 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-6 h-6 text-primary animate-pulse-heart" />
          <h3 className="font-serif text-xl font-semibold text-primary">Anniversary Countdown</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-serif">{timeLeft.days}</div>
            <div className="text-xs text-muted-foreground font-semibold">Days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-serif">{timeLeft.hours}</div>
            <div className="text-xs text-muted-foreground font-semibold">Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-serif">{timeLeft.minutes}</div>
            <div className="text-xs text-muted-foreground font-semibold">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-serif">{timeLeft.seconds}</div>
            <div className="text-xs text-muted-foreground font-semibold">Seconds</div>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4 font-medium">
          Until our next anniversary on September 25
        </p>
      </Card>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <Card className="p-8 max-w-md mx-4 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-950/50 dark:to-pink-950/50 border-primary shadow-2xl animate-pulse-heart">
            <div className="text-center">
              <Heart className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse-heart" />
              <h2 className="text-3xl font-serif font-bold text-primary mb-2">Happy Anniversary!</h2>
              <p className="text-lg text-foreground font-medium">
                Celebrating another year of love, laughter, and forever together.
              </p>
              <div className="mt-6 flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Heart
                    key={i}
                    className="w-6 h-6 text-primary animate-pulse-heart"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
