import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
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
  keywords: [
    "Nazzel",
    "Avionna", 
    "love story",
    "couple",
    "relationship",
    "romance",
    "forever",
    "together",
    "nazzelandavionna",
    "nazzel and avionna"
  ],
  authors: [{ name: "Nazzel & Avionna" }],
  creator: "Nazzel & Avionna",
  publisher: "Nazzel & Avionna",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.nazzelandavionna.site'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Nazzel & Avionna | Our Love Story Forever",
    description: "Welcome to the official page of Nazzel and Avionna — a story of love, faith, and forever. Discover our journey together, filled with laughter, adventures, and unbreakable bond.",
    url: 'https://www.nazzelandavionna.site',
    siteName: 'Nazzel & Avionna',
    images: [
      {
        url: '/romantic-couple-sitting-together-outdoors-warm-sun.jpg',
        width: 1200,
        height: 630,
        alt: 'Nazzel and Avionna - Our Love Story',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Nazzel & Avionna | Our Love Story Forever",
    description: "Welcome to the official page of Nazzel and Avionna — a story of love, faith, and forever.",
    images: ['/romantic-couple-sitting-together-outdoors-warm-sun.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/placeholder-logo.png",
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
        {/* Analytics removed for host-agnostic deployment */}
      </body>
    </html>
  )
}
