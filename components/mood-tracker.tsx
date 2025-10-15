"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Frown, Meh, Heart, Sparkles } from "lucide-react"

interface MoodEntry {
  userId: string
  username: string
  mood: "happy" | "sad" | "neutral" | "loving" | "excited"
  date: Date
}

const moodOptions = [
  { value: "happy", label: "Happy", icon: Smile, color: "text-yellow-500" },
  { value: "loving", label: "Loving", icon: Heart, color: "text-rose-500" },
  { value: "excited", label: "Excited", icon: Sparkles, color: "text-orange-500" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-gray-500" },
  { value: "sad", label: "Sad", icon: Frown, color: "text-blue-500" },
]

export function MoodTracker({ userId, username }: { userId: string; username: string }) {
  const [todayMood, setTodayMood] = useState<string | null>(null)
  const [partnerMood, setPartnerMood] = useState<string | null>(null)
  const [compatibility, setCompatibility] = useState<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadMoods()
  }, [])

  const loadMoods = () => {
    if (typeof window === "undefined") return

    const moods = JSON.parse(localStorage.getItem("moodEntries") || "[]") as MoodEntry[]
    const today = new Date().toDateString()

    const userMoodToday = moods.find((m) => m.userId === userId && new Date(m.date).toDateString() === today)
    const partnerMoodToday = moods.find((m) => m.userId !== userId && new Date(m.date).toDateString() === today)

    if (userMoodToday) setTodayMood(userMoodToday.mood)
    if (partnerMoodToday) setPartnerMood(partnerMoodToday.mood)

    calculateCompatibility(moods)
  }

  const calculateCompatibility = (moods: MoodEntry[]) => {
    const last7Days = moods.filter((m) => {
      const daysDiff = (Date.now() - new Date(m.date).getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7
    })

    if (last7Days.length < 2) {
      setCompatibility(85) // Default
      return
    }

    const positiveMoods = last7Days.filter((m) => m.mood === "happy" || m.mood === "loving" || m.mood === "excited")
    const compatibilityScore = Math.round((positiveMoods.length / last7Days.length) * 100)
    setCompatibility(compatibilityScore)
  }

  const handleMoodSelect = (mood: string) => {
    if (typeof window === "undefined") return

    const moods = JSON.parse(localStorage.getItem("moodEntries") || "[]") as MoodEntry[]
    const today = new Date().toDateString()

    // Remove existing mood for today
    const filteredMoods = moods.filter((m) => !(m.userId === userId && new Date(m.date).toDateString() === today))

    // Add new mood
    const newMood: MoodEntry = {
      userId,
      username,
      mood: mood as any,
      date: new Date(),
    }

    filteredMoods.push(newMood)
    localStorage.setItem("moodEntries", JSON.stringify(filteredMoods))

    setTodayMood(mood)
    calculateCompatibility(filteredMoods)
  }

  const getMoodIcon = (mood: string | null) => {
    if (!mood) return null
    const moodOption = moodOptions.find((m) => m.value === mood)
    if (!moodOption) return null
    const Icon = moodOption.icon
    return <Icon className={`h-8 w-8 ${moodOption.color}`} />
  }

  if (!mounted) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Shared Mood Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-serif flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Shared Mood Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-3">How are you feeling today?</h4>
          <div className="flex gap-2 flex-wrap">
            {moodOptions.map((mood) => {
              const Icon = mood.icon
              return (
                <Button
                  key={mood.value}
                  variant={todayMood === mood.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleMoodSelect(mood.value)}
                  className="flex-1 min-w-[80px]"
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {mood.label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Your Mood</p>
            <div className="flex justify-center">
              {todayMood ? getMoodIcon(todayMood) : <Meh className="h-8 w-8 text-gray-400" />}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
            <p className="text-xs text-muted-foreground mb-2 font-semibold">Partner's Mood</p>
            <div className="flex justify-center">
              {partnerMood ? getMoodIcon(partnerMood) : <Meh className="h-8 w-8 text-gray-400" />}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Compatibility Score</span>
            <span className="text-2xl font-bold text-primary font-serif">{compatibility}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500 rounded-full"
              style={{ width: `${compatibility}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">Based on your moods over the last 7 days</p>
        </div>
      </CardContent>
    </Card>
  )
}
