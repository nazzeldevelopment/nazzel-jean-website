import { NextResponse } from "next/server"
import type { ForumReply } from "@/lib/db/models"
import { storage } from "@/lib/db/storage"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const replies = storage.getReplies(params.id)
    return NextResponse.json({ replies })
  } catch (error) {
    console.error("[v0] Get replies error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const user = storage.getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const reply: ForumReply = {
      id: Date.now().toString(),
      postId: params.id,
      userId: user.id,
      username: user.username,
      content,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    storage.saveReply(reply)

    // Update post reply count
    const post = storage.getPostById(params.id)
    if (post) {
      post.replies += 1
      post.updatedAt = new Date()
      storage.savePost(post)
    }

    return NextResponse.json({ success: true, reply })
  } catch (error) {
    console.error("[v0] Create reply error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
