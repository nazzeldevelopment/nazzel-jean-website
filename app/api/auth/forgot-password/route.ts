// path: /app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage" // your DB helper
import { generateOTP } from "@/lib/auth/client-utils"
import { sendPasswordResetEmail, sendAdminLog } from "@/lib/email" // Using Resend service

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

    // Send reset email with Resend
    try {
      console.log(`Sending password reset email via Resend to ${email} for user ${user.username}`)
      const emailResult = await sendPasswordResetEmail(email, user.username || user.email, resetCode)
      if (!emailResult.success) {
        console.error("Failed to send password reset email with Resend:", emailResult.error)
        // Continue with success response to avoid user enumeration
      } else {
        console.log("✅ Password reset email sent successfully with Resend:", emailResult)
      }
    } catch (e) {
      console.error("❌ Password reset email failed to send with Resend:", e)
      // Don't fail the request if email fails
    }

    // Admin log via Resend
    try {
      console.log(`Sending admin log via Resend for password reset request from ${email}`)
      const adminLogResult = await sendAdminLog(
        "Password reset requested",
        `<p>Reset requested for <strong>${email}</strong>.</p>`
      )
      console.log("✅ Admin log sent successfully via Resend:", adminLogResult)
    } catch (e) {
      console.error("❌ Admin log failed with Resend:", e)
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
