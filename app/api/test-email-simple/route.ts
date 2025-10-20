import { NextResponse } from "next/server"
import { sendEmail, validateEmailConfig } from "@/lib/email"

export async function POST(request: Request) {
  try {
    console.log("=== EMAIL TEST START ===")
    
    // Check environment variables
  console.log("Environment check:")
  console.log("- RESEND_API_KEY:", !!process.env.RESEND_API_KEY ? "SET" : "NOT SET")
  console.log("- EMAIL_FROM:", process.env.EMAIL_FROM || "NOT SET")
  console.log("- ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "NOT SET")

    // Validate configuration
    if (!validateEmailConfig()) {
      return NextResponse.json({ 
        error: "Email configuration invalid",
        details: "Missing required RESEND_API_KEY"
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
          <h2 style="color: #ff6b9d;">Test Email from ${process.env.NEXT_PUBLIC_SITE_NAME || 'Nazzel & Avionna'}</h2>
          <p>If you received this email, the system is working correctly!</p>
          <p><strong>From:</strong> ${process.env.EMAIL_FROM || process.env.NOREPLY_EMAIL || `no-reply@${new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nazzelandavionna.site').hostname}`}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is a test email to verify email delivery functionality.
          </p>
        </div>
      `
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
