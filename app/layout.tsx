import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { ThemeCustomizer } from "@/components/theme-customizer"
import { HeartBackground } from "@/components/heart-background"
import { siteConfig } from "@/config/site"

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

const { site } = siteConfig

export const metadata: Metadata = {
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
  keywords: site.keywords,
  authors: site.authors.map((name) => ({ name })),
  creator: site.creator,
  publisher: site.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(site.metadataBase),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [
      {
        url: site.openGraph.image,
        width: site.openGraph.width,
        height: site.openGraph.height,
        alt: site.openGraph.alt,
      },
    ],
    locale: site.openGraph.locale,
    type: site.openGraph.type,
  },
  twitter: {
    card: site.twitter.card,
    title: site.twitter.title,
    description: site.twitter.description,
    images: [site.twitter.image],
  },
  robots: {
    index: site.robots.index,
    follow: site.robots.follow,
    googleBot: {
      index: site.robots.index,
      follow: site.robots.follow,
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
