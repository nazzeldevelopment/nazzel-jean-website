import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    // Check if this is an authenticated request (for current user profile)
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    let user

    if (token) {
      // Authenticated request - get current user profile
      const session = await storage.getSessionByToken(token)
      if (!session) {
        return NextResponse.json({ error: "Invalid session" }, { status: 401 })
      }
      user = await storage.getUserById(session.userId)
    } else if (userId) {
      // Public request - get specific user profile
      user = await storage.getUserById(userId)
    } else {
      return NextResponse.json({ error: "User ID is required for public profiles" }, { status: 400 })
    }

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

    const session = await storage.getSessionByToken(token)
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const user = await storage.getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { location, bio, relationshipStatus } = body

    if (location !== undefined) user.location = location
    if (bio !== undefined) user.bio = bio
    if (relationshipStatus !== undefined) user.relationshipStatus = relationshipStatus

    await storage.saveUser(user)

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[v0] Update user profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
