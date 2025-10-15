import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"
import { hashPassword } from "@/lib/auth/client-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, code, newPassword } = body

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const user = storage.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    if (!user.resetPasswordCode || !user.resetPasswordCodeExpiry) {
      return NextResponse.json({ error: "No reset code found" }, { status: 400 })
    }

    if (new Date() > user.resetPasswordCodeExpiry) {
      return NextResponse.json({ error: "Reset code expired" }, { status: 400 })
    }

    if (user.resetPasswordCode !== code) {
      return NextResponse.json({ error: "Invalid reset code" }, { status: 400 })
    }

    // Reset password
    user.password = hashPassword(newPassword)
    user.resetPasswordCode = undefined
    user.resetPasswordCodeExpiry = undefined
    user.updatedAt = new Date()
    storage.saveUser(user)

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now login.",
    })
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
