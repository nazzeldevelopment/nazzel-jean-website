// path: /app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"
import { hashPassword } from "@/lib/auth/client-utils"
import { sendAdminLog, sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const body = await request.json()
    const { email, code, newPassword } = body

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    let user
    try {
      user = await storage.getUserByEmail(email)
    } catch (_) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

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

    try {
      await storage.saveUser(user)
    } catch (_) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    // Send confirmation email to user
    try {
      console.log(`Sending password reset confirmation email to ${email} for user ${user.username}`)
      const confirmationResult = await sendPasswordChangedEmail(email, user.username || user.email)
      if (!confirmationResult.success) {
        console.error("❌ Password reset confirmation email failed:", confirmationResult.error)
      } else {
        console.log("✅ Password reset confirmation email sent successfully")
      }
    } catch (e) {
      console.error("❌ Password reset confirmation email failed:", e)
    }

    // Admin log
    try {
      console.log(`Sending admin log for password reset completion for ${email}`)
      const adminLogResult = await sendAdminLog(
        "Password reset completed",
        `<p>Password successfully reset for <strong>${email}</strong>.</p>`
      )
      console.log("✅ Admin log sent successfully:", adminLogResult)
    } catch (e) {
      console.error("❌ Admin log failed:", e)
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now login.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
