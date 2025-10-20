import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const defaultSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nazzelandavionna.site"

const allowedHosts = new Set(
  (process.env.NEXT_PUBLIC_DIRECT_HOSTS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
)

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

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\..*).*)"],
}
