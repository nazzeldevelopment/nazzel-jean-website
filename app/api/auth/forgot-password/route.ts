// path: /app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage" // your DB helper
import { generateOTP } from "@/lib/auth/client-utils"
import { sendPasswordResetEmail, sendAdminLog } from "@/lib/email"

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    let user = undefined
    try {
      user = await storage.getUserByEmail(email)
    } catch (e) {
      // Treat DB unavailability as success to avoid user enumeration
      return NextResponse.json({
        success: true,
        message: "If the email exists, a reset code has been sent.",
      })
    }

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

    try {
      await storage.saveUser(user)
    } catch (e) {
      // still respond success
      return NextResponse.json({
        success: true,
        message: "If the email exists, a reset code has been sent.",
      })
    }

    // Send reset email
    try {
      const result = await sendPasswordResetEmail(email, user.username, resetCode)
      console.log("Password reset email sent successfully:", result)
    } catch (e) {
      console.error("Password reset email failed to send:", e)
      // Don't fail the request if email fails
    }

    // Admin log
    try {
      await sendAdminLog(
        "Password reset requested",
        `<p>Reset requested for <strong>${email}</strong>.</p>`
      )
    } catch (e) {
      console.warn("Admin log failed:", e)
    }

    return NextResponse.json({
      success: true,
      message: "If the email exists, a reset code has been sent.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
