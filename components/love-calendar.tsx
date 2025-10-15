"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, Gift, Cake, Star } from "lucide-react"

interface ImportantDate {
  id: string
  title: string
  date: Date
  type: "anniversary" | "birthday" | "milestone" | "special"
  description?: string
}

const eventIcons = {
  anniversary: Heart,
  birthday: Cake,
  milestone: Star,
  special: Gift,
}

export function LoveCalendar() {
  const [events, setEvents] = useState<ImportantDate[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("loveCalendarEvents")
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents)
        setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })))
      } else {
        // Default events
        const defaultEvents: ImportantDate[] = [
          {
            id: "1",
            title: "Our Anniversary",
            date: new Date(new Date().getFullYear(), 8, 25), // September 25
            type: "anniversary",
            description: "The day we became official",
          },
          {
            id: "2",
            title: "Nazzel's Birthday",
            date: new Date(new Date().getFullYear(), 0, 1), // Placeholder
            type: "birthday",
            description: "Celebrate Nazzel's special day",
          },
          {
            id: "3",
            title: "Avionna's Birthday",
            date: new Date(new Date().getFullYear(), 0, 1), // Placeholder
            type: "birthday",
            description: "Celebrate Avionna's special day",
          },
        ]
        setEvents(defaultEvents)
        localStorage.setItem("loveCalendarEvents", JSON.stringify(defaultEvents))
      }
    }
  }, [])

  if (!mounted) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl font-serif flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Love Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    return events
      .map((event) => {
        const eventDate = new Date(event.date)
        const currentYear = now.getFullYear()
        const thisYearEvent = new Date(currentYear, eventDate.getMonth(), eventDate.getDate())
        const nextYearEvent = new Date(currentYear + 1, eventDate.getMonth(), eventDate.getDate())

        const targetDate = thisYearEvent > now ? thisYearEvent : nextYearEvent
        const daysUntil = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        return { ...event, targetDate, daysUntil }
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5)
  }

  const upcomingEvents = getUpcomingEvents()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-serif flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Love Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.map((event) => {
            const Icon = eventIcons[event.type]
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-primary/20 animate-fade-in-up"
              >
                <div className="flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {event.daysUntil} days
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(event.targetDate)}</p>
                  {event.description && <p className="text-xs text-muted-foreground mt-1">{event.description}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
