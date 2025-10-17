import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"
import { sendAdminLog } from "@/lib/email"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { userId } = body

    const post = await storage.getPostById(id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Increment view count
    post.views = (post.views || 0) + 1

    // Add user to seenBy if not already there
    if (userId && !post.seenBy.includes(userId)) {
      post.seenBy.push(userId)
    }

    await storage.savePost(post)

    try {
      console.log(`Sending admin log for post view: ${post.title}`)
      const adminLogResult = await sendAdminLog(
        "Post viewed",
        `<p>Post titled "${post.title}" viewed. Total views: ${post.views}.</p>`
      )
      console.log("✅ Admin log sent successfully:", adminLogResult)
    } catch (e) {
      console.error("❌ Admin log failed:", e)
    }

    return NextResponse.json({ success: true, views: post.views, seenCount: post.seenBy.length })
  } catch (error) {
    console.error("Nazzel and Aviona View post error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
