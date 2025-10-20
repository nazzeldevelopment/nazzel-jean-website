import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { siteConfig } from '@/config/site'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// External API base URL for mobile apps and web client
const SITE_URL = siteConfig.site.url.replace(/\/$/, '')
const API_BASE_PATH = siteConfig.api?.basePath ?? '/api'
export const API_BASE_URL: string = `${SITE_URL}${API_BASE_PATH.startsWith('/') ? API_BASE_PATH : `/${API_BASE_PATH}`}`

type ApiFetchOptions = RequestInit & { headers?: Record<string, string> }

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, options)
  return res
}
