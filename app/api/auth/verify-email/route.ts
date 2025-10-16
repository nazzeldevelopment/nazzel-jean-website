import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, code } = body

    if (!userId || !code) {
      return NextResponse.json({ error: "User ID and code are required" }, { status: 400 })
    }

    const user = await storage.getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 })
    }

    if (!user.verificationCode || !user.verificationCodeExpiry) {
      return NextResponse.json({ error: "No verification code found" }, { status: 400 })
    }

    if (new Date() > user.verificationCodeExpiry) {
      return NextResponse.json({ error: "Verification code expired" }, { status: 400 })
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Verify user
    user.isVerified = true
    user.verificationCode = undefined
    user.verificationCodeExpiry = undefined
    user.updatedAt = new Date()
    await storage.saveUser(user)

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now login.",
    })
  } catch (error) {
    console.error("[v0] Verify email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
