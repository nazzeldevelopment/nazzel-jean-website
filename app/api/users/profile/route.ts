import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const user = storage.getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return public profile data
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        relationshipStatus: user.relationshipStatus,
        location: user.location,
        bio: user.bio,
        postCount: user.postCount || 0,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("[v0] Get user profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
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
    const { location, bio, relationshipStatus } = body

    if (location !== undefined) user.location = location
    if (bio !== undefined) user.bio = bio
    if (relationshipStatus !== undefined) user.relationshipStatus = relationshipStatus

    storage.saveUser(user)

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[v0] Update user profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
