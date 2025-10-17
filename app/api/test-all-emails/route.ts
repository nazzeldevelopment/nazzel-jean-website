import { NextResponse } from "next/server"
import { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  sendWelcomeEmail, 
  sendForumNotificationEmail,
  sendAdminLog,
  validateEmailConfig 
} from "@/lib/email"

export async function POST(request: Request) {
  try {
    console.log("=== COMPREHENSIVE EMAIL TEST START ===")
    
    // Check environment variables
    console.log("Environment check:")
    console.log("- SMTP_HOST:", process.env.SMTP_HOST || "NOT SET")
    console.log("- SMTP_PORT:", process.env.SMTP_PORT || "NOT SET")
    console.log("- SMTP_USER:", process.env.SMTP_USER || "NOT SET")
    console.log("- SMTP_PASS:", process.env.SMTP_PASS ? "SET" : "NOT SET")
    console.log("- EMAIL_FROM:", process.env.EMAIL_FROM || "NOT SET")
    console.log("- ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "NOT SET")

    // Validate configuration
    if (!validateEmailConfig()) {
      return NextResponse.json({ 
        error: "Email configuration invalid",
        details: "Missing required SMTP environment variables"
      }, { status: 503 })
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    console.log(`Testing all email types to: ${email}`)
    const results = []

    // Test 1: Verification Email
    try {
      console.log("1. Testing verification email...")
      const verificationResult = await sendVerificationEmail(email, "TestUser", "123456")
      results.push({ type: "verification", success: true, result: verificationResult })
      console.log("✅ Verification email sent successfully")
    } catch (e) {
      console.error("❌ Verification email failed:", e)
      results.push({ type: "verification", success: false, error: e instanceof Error ? e.message : "Unknown error" })
    }

    // Test 2: Password Reset Email
    try {
      console.log("2. Testing password reset email...")
      const resetResult = await sendPasswordResetEmail(email, "TestUser", "789012")
      results.push({ type: "password_reset", success: true, result: resetResult })
      console.log("✅ Password reset email sent successfully")
    } catch (e) {
      console.error("❌ Password reset email failed:", e)
      results.push({ type: "password_reset", success: false, error: e instanceof Error ? e.message : "Unknown error" })
    }

    // Test 3: Welcome Email
    try {
      console.log("3. Testing welcome email...")
      const welcomeResult = await sendWelcomeEmail(email, "TestUser")
      results.push({ type: "welcome", success: true, result: welcomeResult })
      console.log("✅ Welcome email sent successfully")
    } catch (e) {
      console.error("❌ Welcome email failed:", e)
      results.push({ type: "welcome", success: false, error: e instanceof Error ? e.message : "Unknown error" })
    }

    // Test 4: Forum Notification Email
    try {
      console.log("4. Testing forum notification email...")
      const forumResult = await sendForumNotificationEmail(email, "TestUser", "Test Post Title", "New Reply")
      results.push({ type: "forum_notification", success: true, result: forumResult })
      console.log("✅ Forum notification email sent successfully")
    } catch (e) {
      console.error("❌ Forum notification email failed:", e)
      results.push({ type: "forum_notification", success: false, error: e instanceof Error ? e.message : "Unknown error" })
    }

    // Test 5: Admin Log Email
    try {
      console.log("5. Testing admin log email...")
      const adminLogResult = await sendAdminLog(
        "Email System Test",
        `<p>Comprehensive email test completed for <strong>${email}</strong>.</p>`
      )
      results.push({ type: "admin_log", success: true, result: adminLogResult })
      console.log("✅ Admin log email sent successfully")
    } catch (e) {
      console.error("❌ Admin log email failed:", e)
      results.push({ type: "admin_log", success: false, error: e instanceof Error ? e.message : "Unknown error" })
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    console.log("=== COMPREHENSIVE EMAIL TEST COMPLETE ===")
    console.log(`Success: ${successCount}/${totalCount} emails sent`)

    return NextResponse.json({
      success: successCount === totalCount,
      message: `Email test completed: ${successCount}/${totalCount} emails sent successfully`,
      results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      }
    })

  } catch (error) {
    console.error("=== COMPREHENSIVE EMAIL TEST FAILED ===")
    console.error("Error:", error)
    
    return NextResponse.json({ 
      error: "Comprehensive email test failed", 
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
