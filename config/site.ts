import configData from "../config.json"

export interface SiteConfig {
  site: {
    name: string
    tagline: string
    description: string
    url: string
    metadataBase: string
    keywords: string[]
    authors: string[]
    creator: string
    publisher: string
    copy: string
    legalName: string
    openGraph: {
      image: string
      width: number
      height: number
      alt: string
      locale: string
      type: string
    }
    twitter: {
      card: string
      title: string
      description: string
      image: string
    }
    robots: {
      index: boolean
      follow: boolean
    }
  }
  couple?: {
    primaryName: string
    partnerName: string
    combinedName: string
  }
  forum?: {
    brandName?: string
    featuredLine?: string
  }
  footer?: {
    legalName?: string
  }
  emails?: {
    defaultFromName?: string
  }
  api?: {
    basePath?: string
  }
  calendar?: {
    defaultEvents?: Array<{
      id: string
      title: string
      month: number
      day: number
      type: "anniversary" | "birthday" | "milestone" | "special"
      description?: string
    }>
  }
}

export const siteConfig = configData as SiteConfig
