import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nazzelandavionna.site"

const allowedHosts = new Set(
  (process.env.NEXT_PUBLIC_DIRECT_HOSTS ?? "")
    .split(",")
    .map((value: string) => value.trim())
    .filter((value): value is string => Boolean(value)),
)

const subdomainRoutes = new Map<string, string>()

function normalizeRouteTarget(target: string | undefined | null) {
  if (!target) {
    return null
  }

  const trimmed = target.trim()

  if (!trimmed) {
    return null
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

const envRouteConfig = process.env.NEXT_PUBLIC_SUBDOMAIN_ROUTES ?? ""

if (envRouteConfig) {
  for (const entry of envRouteConfig.split(",")) {
    const [rawKey, rawValue] = entry.split("=")
    const key = rawKey?.trim().toLowerCase()
    const normalizedTarget = normalizeRouteTarget(rawValue)

    if (!key || !normalizedTarget) {
      continue
    }

    subdomainRoutes.set(key, normalizedTarget)
  }
}

function resolveApexDomain(url: string) {
  try {
    return new URL(url).hostname
  } catch (error) {
    return null
  }
}

const apexDomain = resolveApexDomain(defaultSiteUrl)

if (apexDomain) {
  allowedHosts.add(apexDomain)
  allowedHosts.add(`www.${apexDomain}`)
}

allowedHosts.add("localhost")
allowedHosts.add("127.0.0.1")

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host")

  if (!hostHeader) {
    return NextResponse.next()
  }

  const [hostname] = hostHeader.split(":")

  if (allowedHosts.has(hostname)) {
    return NextResponse.next()
  }

  if (!apexDomain || !hostname.endsWith(`.${apexDomain}`)) {
    return NextResponse.next()
  }

  const subdomain = hostname.slice(0, -(`.${apexDomain}`.length))

  if (!subdomain) {
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)

  requestHeaders.set("x-subdomain", subdomain)

  const lowerSubdomain = subdomain.toLowerCase()
  const mappedPath = subdomainRoutes.get(lowerSubdomain)

  if (mappedPath) {
    const rewriteUrl = request.nextUrl.clone()
    const suffixPath = rewriteUrl.pathname === "/" ? "" : rewriteUrl.pathname
    const normalizedBase = mappedPath.endsWith("/") ? mappedPath.slice(0, -1) : mappedPath
    rewriteUrl.pathname = `${normalizedBase}${suffixPath}` || "/"

    return NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    })
  }

  if (subdomainRoutes.size > 0) {
    const fallbackPath = `/${lowerSubdomain}`
    const rewriteUrl = request.nextUrl.clone()
    const suffixPath = rewriteUrl.pathname === "/" ? "" : rewriteUrl.pathname
    const normalizedBase = fallbackPath.endsWith("/") ? fallbackPath.slice(0, -1) : fallbackPath
    rewriteUrl.pathname = `${normalizedBase}${suffixPath}` || "/"

    return NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\..*).*)"],
}
