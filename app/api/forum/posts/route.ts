import { NextResponse } from "next/server"
import type { ForumPost } from "@/lib/db/models"
import { storage } from "@/lib/db/storage"

export async function GET() {
  try {
    const posts = await storage.getPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("[v0] Get posts error:", error)
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

    const session = await storage.getSessionByToken(token)
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const user = await storage.getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { title, content, category, tags, mood } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 })
    }

    const post: ForumPost = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      title,
      content,
      category,
      tags: tags || [],
      mood: mood || undefined,
      likes: 0,
      replies: 0,
      views: 0,
      seenBy: [],
      shares: 0,
      reactions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await storage.savePost(post)

    user.postCount = (user.postCount || 0) + 1
    await storage.saveUser(user)

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("[v0] Create post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
