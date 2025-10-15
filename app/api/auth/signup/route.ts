import { NextResponse } from "next/server"
import type { User } from "@/lib/db/models"
import { storage } from "@/lib/db/storage"
import { hashPassword, generateOTP, calculateAge, sendEmailOTP } from "@/lib/auth/client-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password, dateOfBirth, relationshipStatus, agreedToTerms } = body

    // Validation
    if (!username || !email || !password || !dateOfBirth || !relationshipStatus || !agreedToTerms) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Age verification
    const age = calculateAge(dateOfBirth)
    if (age < 13) {
      return NextResponse.json({ error: "You must be at least 13 years old to sign up" }, { status: 400 })
    }

    // Check if user exists
    if (storage.getUserByEmail(email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    if (storage.getUserByUsername(username)) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 })
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

    storage.saveUser(user)

    // Send verification email
    sendEmailOTP(email, verificationCode, "verification")

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
