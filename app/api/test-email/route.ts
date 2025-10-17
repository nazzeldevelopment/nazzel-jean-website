import { NextResponse } from "next/server"
import { sendTestEmail, sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail, validateEmailConfig, getEmailQueueStatus } from "@/lib/email"

export async function POST(request: Request) {
  try {
    // First validate email configuration
    if (!validateEmailConfig()) {
      return NextResponse.json({ 
        error: "Email configuration invalid", 
        details: "Missing required SMTP environment variables" 
      }, { status: 503 })
    }

    const body = await request.json()
    const { email, testType = "test", immediate = true } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    let result
    switch (testType) {
      case "verification":
        result = await sendVerificationEmail(email, "TestUser", "123456", immediate)
        break
      case "password-reset":
        result = await sendPasswordResetEmail(email, "TestUser", "123456", immediate)
        break
      case "welcome":
        result = await sendWelcomeEmail(email, "TestUser", immediate)
        break
      case "queue-status":
        return NextResponse.json({
          success: true,
          message: "Email queue status retrieved",
          queueStatus: getEmailQueueStatus()
        })
      default:
        result = await sendTestEmail(email, immediate)
    }

    return NextResponse.json({
      success: true,
      message: `Test email ${immediate ? 'sent immediately' : 'queued for delivery'}`,
      result,
      queueStatus: getEmailQueueStatus()
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json({ 
      error: "Email test failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
