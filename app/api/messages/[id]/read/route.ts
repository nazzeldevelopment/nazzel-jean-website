import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = storage.getSessionByToken(token)
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    storage.markMessageAsRead(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Mark message as read error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
