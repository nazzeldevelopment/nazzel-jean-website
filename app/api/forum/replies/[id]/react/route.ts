import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"
import type { PostReaction } from "@/lib/db/models"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
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
    const { emoji } = body

    if (!emoji) {
      return NextResponse.json({ error: "Emoji is required" }, { status: 400 })
    }

    const reply = storage.getReplyById(id)
    if (!reply) {
      return NextResponse.json({ error: "Reply not found" }, { status: 404 })
    }

    // Check if user already reacted with this emoji
    const existingReaction = reply.reactions.find((r) => r.userId === user.id && r.emoji === emoji)

    if (existingReaction) {
      // Remove reaction
      reply.reactions = reply.reactions.filter((r) => !(r.userId === user.id && r.emoji === emoji))
    } else {
      // Add reaction
      const reaction: PostReaction = {
        userId: user.id,
        username: user.username,
        emoji,
        createdAt: new Date(),
      }
      reply.reactions.push(reaction)
    }

    storage.saveReply(reply)

    return NextResponse.json({ success: true, reactions: reply.reactions })
  } catch (error) {
    console.error("[v0] React to reply error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
