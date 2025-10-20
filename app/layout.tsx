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

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Nazzel & Avionna'
const SITE_TAGLINE = process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Our Love Story Forever'
const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "Welcome to the official page of Nazzel and Avionna — a story of love, faith, and forever. Discover our journey together, filled with laughter, adventures, and unbreakable bond."

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
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
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nazzelandavionna.site',
  siteName: SITE_NAME,
    images: [
      {
        url: '/romantic-couple-sitting-together-outdoors-warm-sun.jpg',
        width: 1200,
        height: 630,
  alt: `${SITE_NAME} - ${SITE_TAGLINE}`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
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
