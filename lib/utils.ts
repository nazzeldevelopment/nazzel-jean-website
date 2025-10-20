import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// External API base URL for mobile apps and web client
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nazzelandavionna.site'
export const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_BASE_URL || `${SITE_URL}/api`

type ApiFetchOptions = RequestInit & { headers?: Record<string, string> }

export async function apiFetch(path: string, options: ApiFetchOptions = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, options)
  return res
}
