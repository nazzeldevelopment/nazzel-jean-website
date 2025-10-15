"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { User } from "@/lib/db/models"
import { AnniversaryCountdown } from "@/components/anniversary-countdown"
import { LoveCalendar } from "@/components/love-calendar"
import { DailyLoveQuote } from "@/components/daily-love-quote"
import { MoodTracker } from "@/components/mood-tracker"
import { CoupleSpinnerLogo } from "@/components/couple-spinner-logo"

export default function CoupleDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        if (response.ok && data.user) {
          setUser(data.user)
        } else {
          router.push("/login")
        }
      } catch (err) {
        console.error("[v0] Fetch user error:", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center romantic-gradient">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen romantic-gradient">
      <div className="container max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <CoupleSpinnerLogo />
        </div>

        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/forum")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Our Love Dashboard
          </h1>
          <p className="text-muted-foreground font-medium">
            Track our journey, celebrate milestones, and stay connected
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AnniversaryCountdown />
            <DailyLoveQuote />
            <MoodTracker userId={user.id} username={user.username} />
          </div>

          <div className="space-y-6">
            <LoveCalendar />
          </div>
        </div>
      </div>
    </div>
  )
}
