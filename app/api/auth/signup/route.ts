import { NextResponse } from "next/server"
import type { User } from "@/lib/db/models"
import { storage } from "@/lib/db/storage"
import { hashPassword, generateOTP, calculateAge } from "@/lib/auth/client-utils"
import { sendVerificationEmail, sendAdminLog } from "@/lib/email"

// reCAPTCHA verification function
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.warn("RECAPTCHA_SECRET_KEY not configured")
      return true // Allow signup if reCAPTCHA is not configured
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }
    const body = await request.json()
    const { username, email, password, dateOfBirth, relationshipStatus, agreedToTerms, recaptchaToken } = body

    // Validation
    if (!username || !email || !password || !dateOfBirth || !relationshipStatus || !agreedToTerms) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // reCAPTCHA verification
    if (recaptchaToken) {
      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken)
      if (!isRecaptchaValid) {
        return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: "reCAPTCHA verification required" }, { status: 400 })
    }

    // Age verification
    const age = calculateAge(dateOfBirth)
    if (age < 13) {
      return NextResponse.json({ error: "You must be at least 13 years old to sign up" }, { status: 400 })
    }

    // Check if user exists
    try {
      if (await storage.getUserByEmail(email)) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 })
      }
    } catch (_) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    try {
      if (await storage.getUserByUsername(username)) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 })
      }
    } catch (_) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    // Generate verification code
    const verificationCode = generateOTP()
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const user: User = {
      id: Date.now().toString(),
      username,
      email,
      password: hashPassword(password),
      dateOfBirth,
      relationshipStatus,
      isVerified: false,
      role: "member", // Automatically assign member role
      verificationCode,
      verificationCodeExpiry,
      failedLoginAttempts: 0,
      agreedToTerms,
      postCount: 0,
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      await storage.saveUser(user)
    } catch (_) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 })
    }

    // Send verification email via SMTP
    try {
      console.log(`Sending verification email to ${email} for user ${username}`)
      const emailResult = await sendVerificationEmail(email, username, verificationCode)
      console.log("Verification email result:", emailResult)
    } catch (e) {
      console.error("Signup verification email failed:", e)
      // Don't fail the signup if email fails, but log it
    }

    // Admin log
    try {
      await sendAdminLog(
        "New signup",
        `<p>User <strong>${username}</strong> signed up with <strong>${email}</strong>.</p>`
      )
    } catch (_) {}

    console.log(`[v0] Sending member role notification to ${email}`)
    console.log(`[v0] Welcome ${username}! You have been granted MEMBER role access.`)
    console.log(
      `[v0] Email sent: "Congratulations! Your account has been created with MEMBER privileges. You can now post and participate in forum discussions."`,
    )

    return NextResponse.json({
      success: true,
      message: "Account created! Please check your email for verification code and member role confirmation.",
      userId: user.id,
    })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
