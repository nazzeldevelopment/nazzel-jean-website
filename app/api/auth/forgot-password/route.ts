import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"
import { generateOTP } from "@/lib/auth/client-utils"
import { sendPasswordResetEmail, sendAdminLog } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const user = await storage.getUserByEmail(email)
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
    await storage.saveUser(user)

    // Send reset email via SMTP
    await sendPasswordResetEmail(email, user.username, resetCode)

    // Admin log
    await sendAdminLog(
      "Password reset requested",
      `<p>Reset requested for <strong>${email}</strong>.</p>`
    )

    return NextResponse.json({
      success: true,
      message: "If the email exists, a reset code has been sent.",
    })
  } catch (error) {
    console.error("Nazzel and Aviona Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
