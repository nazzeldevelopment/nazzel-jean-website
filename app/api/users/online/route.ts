import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }
    const onlineUsers = await storage.getOnlineUsers()
    return NextResponse.json({ users: onlineUsers })
  } catch (error) {
    console.error("[v0] Get online users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await storage.getSessionByToken(token)
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const body = await request.json()
    const { isOnline } = body

    await storage.updateUserOnlineStatus(session.userId, isOnline)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update online status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
