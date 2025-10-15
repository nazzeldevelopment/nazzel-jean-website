import { NextResponse } from "next/server"
import type { TypingStatus } from "@/lib/db/models"
import { storage } from "@/lib/db/storage"

export async function POST(request: Request) {
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

    const user = storage.getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { isTyping } = body

    const typingStatus: TypingStatus = {
      userId: user.id,
      username: user.username,
      isTyping: isTyping || false,
      lastUpdate: new Date(),
    }

    storage.updateTypingStatus(typingStatus)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update typing status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const typingStatus = storage.getTypingStatus(userId)

    return NextResponse.json({ typingStatus })
  } catch (error) {
    console.error("[v0] Get typing status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
