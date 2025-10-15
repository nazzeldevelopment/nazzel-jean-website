import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"
import { generateOTP, sendEmailOTP } from "@/lib/auth/client-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = storage.getUserByEmail(email)
    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        success: true,
        message: "If the email exists, a reset code has been sent.",
      })
    }

    // Generate reset code
    const resetCode = generateOTP()
    const resetCodeExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    user.resetPasswordCode = resetCode
    user.resetPasswordCodeExpiry = resetCodeExpiry
    user.updatedAt = new Date()
    storage.saveUser(user)

    // Send reset email
    sendEmailOTP(email, resetCode, "reset")

    return NextResponse.json({
      success: true,
      message: "If the email exists, a reset code has been sent.",
    })
  } catch (error) {
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
