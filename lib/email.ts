import nodemailer from "nodemailer"

// SMTP transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Default "from" email
const DEFAULT_FROM_EMAIL = process.env.EMAIL_FROM || "no-reply@nazzelandavionna.site"

// =====================
// Email Templates
// =====================
export const emailTemplates = {
  // Email verification
  emailVerification: (username: string, verificationCode: string) => ({
    subject: "✨ Welcome to Nazzel & Avionna's Love Story - Verify Your Email",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #ffe6eb 0%, #fff8f9 100%); }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #ff6b9d, #c44569); border-radius: 15px; margin-bottom: 30px; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 300; }
          .content { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .verification-code { background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0; font-size: 24px; font-weight: bold; letter-spacing: 3px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💕 Welcome to Our Love Story 💕</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Welcome to <strong>Nazzel & Avionna's</strong> community! Please verify your email using the code below:</p>
            <div class="verification-code">${verificationCode}</div>
            <p>This verification code expires in <strong>24 hours</strong>.</p>
            <p>If you didn't create an account, just ignore this email.</p>
            <p>With love,<br><strong>Nazzel & Avionna</strong> 💕</p>
          </div>
          <div class="footer">
            <p>This email was sent from ${DEFAULT_FROM_EMAIL}</p>
            <p>© 2025 Nazzel & Avionna's Love Story. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Password reset
  passwordReset: (username: string, resetCode: string) => ({
    subject: "🔐 Password Reset Request - Nazzel & Avionna's Love Story",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #ffe6eb 0%, #fff8f9 100%); }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #ff6b9d, #c44569); border-radius: 15px; margin-bottom: 30px; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 300; }
          .content { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .reset-code { background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0; font-size: 24px; font-weight: bold; letter-spacing: 3px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Use the code below to reset your password:</p>
            <div class="reset-code">${resetCode}</div>
            <div class="warning">
              ⚠️ This code expires in 1 hour. If you didn't request a reset, ignore this email.
            </div>
            <p>With love,<br><strong>Nazzel & Avionna</strong> 💕</p>
          </div>
          <div class="footer">
            <p>This email was sent from ${DEFAULT_FROM_EMAIL}</p>
            <p>© 2025 Nazzel & Avionna's Love Story. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Welcome member
  welcomeMember: (username: string) => ({
    subject: "🎉 Welcome to Our Community! - You're Now a Verified Member",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Member</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #ffe6eb 0%, #fff8f9 100%); }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #ff6b9d, #c44569); border-radius: 15px; margin-bottom: 30px; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 300; }
          .content { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Your email is verified. You now have full access to our community!</p>
            <ul>
              <li>💬 Forum Discussions</li>
              <li>📸 Photo Gallery</li>
              <li>💌 Private Messages</li>
              <li>🎯 Community Events</li>
            </ul>
            <p>With love,<br><strong>Nazzel & Avionna</strong> 💕</p>
          </div>
          <div class="footer">
            <p>This email was sent from ${DEFAULT_FROM_EMAIL}</p>
            <p>© 2025 Nazzel & Avionna's Love Story. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Forum notification
  forumNotification: (username: string, postTitle: string, notificationType: string) => ({
    subject: `🔔 New Activity in Forum - ${postTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forum Notification</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #ffe6eb 0%, #fff8f9 100%); }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #ff6b9d, #c44569); border-radius: 15px; margin-bottom: 30px; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 300; }
          .content { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .notification { background: #e8f5e8; border: 1px solid #4caf50; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Forum Activity</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>New forum activity:</p>
            <div class="notification">
              <strong>${notificationType}</strong><br>Post: ${postTitle}
            </div>
            <p>Check it out!</p>
            <p>With love,<br><strong>Nazzel & Avionna</strong> 💕</p>
          </div>
          <div class="footer">
            <p>This email was sent from ${DEFAULT_FROM_EMAIL}</p>
            <p>© 2025 Nazzel & Avionna's Love Story. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}

// =====================
// Send email generic function
// =====================
export async function sendEmail({
  to,
  subject,
  html,
  from = `"Nazzel & Avionna" <${DEFAULT_FROM_EMAIL}>`,
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
    envelope: {
      from: DEFAULT_FROM_EMAIL,
      to,
    },
    replyTo: DEFAULT_FROM_EMAIL,
  })
  return { success: true, messageId: info.messageId }
}

// Convenience functions
export async function sendVerificationEmail(to: string, username: string, verificationCode: string) {
  const template = emailTemplates.emailVerification(username, verificationCode)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendPasswordResetEmail(to: string, username: string, resetCode: string) {
  const template = emailTemplates.passwordReset(username, resetCode)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendWelcomeEmail(to: string, username: string) {
  const template = emailTemplates.welcomeMember(username)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendForumNotificationEmail(to: string, username: string, postTitle: string, notificationType: string) {
  const template = emailTemplates.forumNotification(username, postTitle, notificationType)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

// Admin log email
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
export async function sendAdminLog(subject: string, html: string) {
  if (!ADMIN_EMAIL) return
  try {
    await sendEmail({ to: ADMIN_EMAIL, subject, html })
  } catch (_) {}
}

// Test email
export async function sendTestEmail(to: string) {
  return sendEmail({
    to,
    subject: "🧪 Test Email - Nazzel & Avionna's Love Story",
    html: `<div style="font-family: Arial, sans-serif; padding:20px; background:#fdf0f5;">
      <h2>✅ Test Email Successful!</h2>
      <p>If you received this email, the email system is working.</p>
      <p>With love, <strong>Nazzel & Avionna</strong> 💕</p>
    </div>`,
  })
}
