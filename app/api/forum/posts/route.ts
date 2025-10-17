import { NextResponse } from "next/server"
import type { ForumPost } from "@/lib/db/models"
import { storage } from "@/lib/db/storage"
import { sendAdminLog } from "@/lib/email"

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }
    const posts = await storage.getPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Nazzel and Aviona Get posts error:", error)
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

    // Admin log
    try {
      console.log(`Sending admin log for forum post creation by ${user.username}`)
      const adminLogResult = await sendAdminLog(
        "Forum post created",
        `<p>User <strong>${user.username}</strong> created a post titled "${title}".</p>`
      )
      console.log("✅ Admin log sent successfully:", adminLogResult)
    } catch (e) {
      console.error("❌ Admin log failed:", e)
    }

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error("Nazzel and Aviona Create post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
