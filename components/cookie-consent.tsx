"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Cookie } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookieConsent")
      if (!consent) {
        setShowBanner(true)
      }
    }
  }, [])

  const acceptCookies = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookieConsent", "accepted")
    }
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
      <Card className="max-w-4xl mx-auto p-6 shadow-2xl border-2 bg-white/95 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Cookie className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2 text-foreground">We use cookies</h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed font-medium">
              We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and
              provide better performance. By clicking "Accept", you consent to our use of cookies. Read our{" "}
              <Link href="/legal/privacy" className="text-primary hover:underline font-semibold">
                Privacy Policy
              </Link>{" "}
              for more information.
            </p>
            <div className="flex gap-3">
              <Button onClick={acceptCookies} size="lg" className="font-bold shadow-lg">
                Accept Cookies & Policy
              </Button>
              <Button variant="outline" onClick={acceptCookies} size="lg" className="font-semibold bg-transparent">
                Decline
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
