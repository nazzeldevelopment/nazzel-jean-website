import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { HeartBackground } from "@/components/heart-background"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Nazzel & Avionna | Our Love Story Forever",
  description:
    "Welcome to the official page of Nazzel and Avionna — a story of love, faith, and forever. Discover our journey together, filled with laughter, adventures, and unbreakable bond.",
    generator: 'v0.app',
  icons: {
    icon: "/placeholder-logo.png", // ensures browsers don’t request /favicon.ico implicitly
    shortcut: "/placeholder-logo.png",
    apple: "/placeholder-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`font-sans ${inter.variable} ${playfair.variable} antialiased romantic-gradient`}>
        <HeartBackground />
        <div className="relative z-10">
          <Suspense fallback={null}>{children}</Suspense>
          <Footer />
          <CookieConsent />
          <ThemeCustomizer />
        </div>
        {globalThis.process?.env?.NODE_ENV === "production" ? <Analytics /> : null}
      </body>
    </html>
  )
}
