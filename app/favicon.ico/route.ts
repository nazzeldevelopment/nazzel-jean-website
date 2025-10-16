import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Redirect favicon requests to an existing public image
  const url = new URL("/placeholder-logo.png", request.url)
  return NextResponse.redirect(url, 308)
}


