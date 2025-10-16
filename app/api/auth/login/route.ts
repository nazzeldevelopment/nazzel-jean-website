import { NextResponse } from "next/server"
import { storage } from "@/lib/db/storage"
import { verifyPassword, generateToken } from "@/lib/auth/client-utils"
import type { Session } from "@/lib/db/models"
import { sendAdminLog } from "@/lib/email"

const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION = 300000 // 5 minutes in milliseconds

// Admin backdoor removed for security

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { usernameOrEmail, password } = body

    if (!usernameOrEmail || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Note: No admin bypass. Only regular credential checks below.

    // Find user by email or username
    let user = await storage.getUserByEmail(usernameOrEmail)
    if (!user) {
      user = await storage.getUserByUsername(usernameOrEmail)
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if account is locked
    if (user.accountLockedUntil && new Date() < user.accountLockedUntil) {
      const remainingTime = Math.ceil((user.accountLockedUntil.getTime() - Date.now()) / 1000)
      return NextResponse.json({ error: `Account locked. Try again in ${remainingTime} seconds.` }, { status: 423 })
    }

    // Check if email is verified
    if (!user.isVerified) {
      return NextResponse.json({ error: "Please verify your email first" }, { status: 403 })
    }

    // Verify password
    if (!verifyPassword(password, user.password)) {
      user.failedLoginAttempts += 1

      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.accountLockedUntil = new Date(Date.now() + LOCK_DURATION)
        user.failedLoginAttempts = 0
        await storage.saveUser(user)
        return NextResponse.json({ error: "Too many failed attempts. Account locked for 5 minutes." }, { status: 423 })
      }

      await storage.saveUser(user)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Reset failed attempts
    user.failedLoginAttempts = 0
    user.accountLockedUntil = undefined
    await storage.saveUser(user)

    // Create session
    const token = generateToken()
    const session: Session = {
      id: Date.now().toString(),
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    }
    await storage.saveSession(session)

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })

    await sendAdminLog(
      "User login",
      `<p>User <strong>${user.username}</strong> logged in.</p>`
    )
    return response
  } catch (error) {
    console.error("Nazzel and Aviona Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
