import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"
import { sendWelcomeEmail, sendAdminLog } from "@/lib/email"

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }
    const body = await request.json()
    const { userId, code } = body

    if (!userId || !code) {
      return NextResponse.json({ error: "User ID and code are required" }, { status: 400 })
    }

    let user = undefined
    try {
      user = await storage.getUserById(userId)
    } catch (_) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }
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
  try {
    await storage.saveUser(user)
  } catch (_) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
  }

  // Send welcome email and admin log
  try {
    console.log(`Sending welcome email to ${user.email} for verified user ${user.username}`)
    const welcomeResult = await sendWelcomeEmail(user.email, user.username)
    console.log("Welcome email result:", welcomeResult)
  } catch (e) {
    console.error("Welcome email failed:", e)
  }

  try {
    console.log(`Sending admin log for verified user ${user.username}`)
    const adminLogResult = await sendAdminLog(
      "Email verified",
      `<p>User <strong>${user.username}</strong> verified their email.</p>`
    )
    console.log("Admin log result:", adminLogResult)
  } catch (e) {
    console.error("Admin log failed:", e)
  }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now login.",
    })
  } catch (error) {
    console.error("Nazzel and Aviona Verify email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
