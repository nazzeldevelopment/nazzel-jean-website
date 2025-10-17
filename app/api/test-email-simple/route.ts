import { NextResponse } from "next/server"
import { sendEmail, validateEmailConfig } from "@/lib/email"

export async function POST(request: Request) {
  try {
    console.log("=== EMAIL TEST START ===")
    
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

    console.log(`Testing email to: ${email}`)

    // Send test email
    const result = await sendEmail({
      to: email,
      subject: "🧪 Test Email - Nazzel & Avionna",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b9d;">Test Email from Nazzel & Avionna</h2>
          <p>If you received this email, the system is working correctly!</p>
          <p><strong>From:</strong> no-reply@nazzelandavionna.site</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is a test email to verify email delivery functionality.
          </p>
        </div>
      `,
      immediate: true
    })

    console.log("=== EMAIL TEST SUCCESS ===")
    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      result
    })

  } catch (error) {
    console.error("=== EMAIL TEST FAILED ===")
    console.error("Error:", error)
    
    return NextResponse.json({ 
      error: "Email test failed", 
      details: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
