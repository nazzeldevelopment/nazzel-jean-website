import { NextResponse } from "next/server"
import type { PrivateMessage } from "@/lib/db/models"
import { storage } from "@/lib/db/storage"

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get("userId")

    if (!otherUserId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const messages = storage.getMessages(user.id, otherUserId)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Get messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
    const { receiverId, content, type, mediaUrl } = body

    if (!receiverId || !content) {
      return NextResponse.json({ error: "Receiver ID and content are required" }, { status: 400 })
    }

    const receiver = storage.getUserById(receiverId)
    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    const message: PrivateMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderUsername: user.username,
      receiverId: receiver.id,
      receiverUsername: receiver.username,
      content,
      type: type || "text",
      mediaUrl: mediaUrl || undefined,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    storage.saveMessage(message)

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error("[v0] Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
