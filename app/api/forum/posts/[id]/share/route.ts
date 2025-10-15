import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const post = storage.getPostById(id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    post.shares = (post.shares || 0) + 1
    storage.savePost(post)

    return NextResponse.json({ success: true, shares: post.shares })
  } catch (error) {
    console.error("[v0] Share post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
