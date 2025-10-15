import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { userId } = body

    const post = storage.getPostById(id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Increment view count
    post.views = (post.views || 0) + 1

    // Add user to seenBy if not already there
    if (userId && !post.seenBy.includes(userId)) {
      post.seenBy.push(userId)
    }

    storage.savePost(post)

    return NextResponse.json({ success: true, views: post.views, seenCount: post.seenBy.length })
  } catch (error) {
    console.error("[v0] View post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
