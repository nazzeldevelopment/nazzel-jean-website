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

    const session = await storage.getSessionByToken(token)
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const user = await storage.getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { emoji } = body

    if (!emoji) {
      return NextResponse.json({ error: "Emoji is required" }, { status: 400 })
    }

    const post = await storage.getPostById(id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user already reacted with this emoji
    const existingReaction = post.reactions.find((r) => r.userId === user.id && r.emoji === emoji)

    if (existingReaction) {
      // Remove reaction
      post.reactions = post.reactions.filter((r) => !(r.userId === user.id && r.emoji === emoji))
    } else {
      // Add reaction
      const reaction: PostReaction = {
        userId: user.id,
        username: user.username,
        emoji,
        createdAt: new Date(),
      }
      post.reactions.push(reaction)
    }

    await storage.savePost(post)

    return NextResponse.json({ success: true, reactions: post.reactions })
  } catch (error) {
    console.error("[v0] React to post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
