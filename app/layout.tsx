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

const {
  site: {
    name: SITE_NAME,
    tagline: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    authors: SITE_AUTHORS,
    creator: SITE_CREATOR,
    publisher: SITE_PUBLISHER,
    url: SITE_URL,
    metadataBase: SITE_METADATA_BASE,
    openGraphImage: SITE_OG_IMAGE,
    openGraphWidth: SITE_OG_IMAGE_WIDTH,
    openGraphHeight: SITE_OG_IMAGE_HEIGHT,
    openGraphAlt: SITE_OG_IMAGE_ALT,
    openGraphLocale: SITE_OG_LOCALE,
    openGraphType: SITE_OG_TYPE,
    twitterCard: SITE_TWITTER_CARD,
    twitterTitle: SITE_TWITTER_TITLE,
    twitterDescription: SITE_TWITTER_DESCRIPTION,
    twitterImage: SITE_TWITTER_IMAGE,
    robotsIndex: SITE_ROBOTS_INDEX,
    robotsFollow: SITE_ROBOTS_FOLLOW,
  },
} = siteConfig

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: SITE_AUTHORS.map((name) => ({ name })),
  creator: SITE_CREATOR,
  publisher: SITE_PUBLISHER,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_METADATA_BASE),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: SITE_OG_IMAGE_WIDTH,
        height: SITE_OG_IMAGE_HEIGHT,
        alt: SITE_OG_IMAGE_ALT,
      },
    ],
    locale: SITE_OG_LOCALE,
    type: SITE_OG_TYPE,
  },
  twitter: {
    card: SITE_TWITTER_CARD,
    title: SITE_TWITTER_TITLE,
    description: SITE_TWITTER_DESCRIPTION,
    images: [SITE_TWITTER_IMAGE],
  },
  robots: {
    index: SITE_ROBOTS_INDEX,
    follow: SITE_ROBOTS_FOLLOW,
    googleBot: {
      index: SITE_ROBOTS_INDEX,
      follow: SITE_ROBOTS_FOLLOW,
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
