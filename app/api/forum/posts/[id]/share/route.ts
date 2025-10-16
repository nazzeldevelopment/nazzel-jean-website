import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"
import { sendAdminLog } from "@/lib/email"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const post = await storage.getPostById(id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    post.shares = (post.shares || 0) + 1
    await storage.savePost(post)

    await sendAdminLog(
      "Post shared",
      `<p>Post titled "${post.title}" was shared. Total shares: ${post.shares}.</p>`
    )

    return NextResponse.json({ success: true, shares: post.shares })
  } catch (error) {
    console.error("Nazzel and Aviona Share post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
