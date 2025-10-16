import nodemailer from "nodemailer"

// SMTP transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "no-reply@nazzelandavionna.site",
    pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD,
  },
})

const DEFAULT_FROM_EMAIL = process.env.EMAIL_FROM || "no-reply@nazzelandavionna.site"

// ===== Email Templates =====
export const emailTemplates = {
  emailVerification: (username: string, code: string) => ({
    subject: "✨ Verify Your Email - Nazzel & Avionna",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="utf-8">
      <title>Email Verification</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff8f9; margin:0; padding:0;}
        .container { max-width:600px; margin:0 auto; padding:20px; }
        .header { text-align:center; background:#ff6b9d; color:white; padding:30px; border-radius:15px; margin-bottom:30px;}
        .content { background:white; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1);}
        .code { text-align:center; font-size:24px; font-weight:bold; background:#ff6b9d; color:white; padding:15px; border-radius:10px; margin:20px 0;}
        .footer { text-align:center; color:#666; margin-top:30px; font-size:14px; }
      </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💕 Welcome to Our Love Story 💕</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Verify your email to join our community. Your verification code:</p>
            <div class="code">${code}</div>
            <p>This code expires in 24 hours.</p>
            <p>If you didn't sign up, ignore this email.</p>
          </div>
          <div class="footer">
            <p>Sent from no-reply@nazzelandavionna.site</p>
            <p>© 2025 Nazzel & Avionna. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  passwordReset: (username: string, code: string) => ({
    subject: "🔐 Password Reset - Nazzel & Avionna",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="utf-8">
      <title>Password Reset</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff8f9; margin:0; padding:0;}
        .container { max-width:600px; margin:0 auto; padding:20px; }
        .header { text-align:center; background:#ff6b9d; color:white; padding:30px; border-radius:15px; margin-bottom:30px;}
        .content { background:white; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1);}
        .code { text-align:center; font-size:24px; font-weight:bold; background:#ff6b9d; color:white; padding:15px; border-radius:10px; margin:20px 0;}
        .footer { text-align:center; color:#666; margin-top:30px; font-size:14px; }
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
            <div class="code">${code}</div>
            <p>This code expires in 1 hour.</p>
            <p>If you didn't request this, ignore this email.</p>
          </div>
          <div class="footer">
            <p>Sent from no-reply@nazzelandavionna.site</p>
            <p>© 2025 Nazzel & Avionna. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  welcomeMember: (username: string) => ({
    subject: "🎉 Welcome to Our Community - Nazzel & Avionna",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="utf-8">
      <title>Welcome</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#fff8f9; margin:0; padding:0;}
        .container { max-width:600px; margin:0 auto; padding:20px;}
        .header { text-align:center; background:#ff6b9d; color:white; padding:30px; border-radius:15px; margin-bottom:30px;}
        .content { background:white; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1);}
        .feature { background:#f8f9fa; padding:15px; border-radius:8px; margin:10px 0; border-left:4px solid #ff6b9d;}
        .footer { text-align:center; color:#666; margin-top:30px; font-size:14px;}
      </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome!</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Your email is verified. Enjoy full access to our community:</p>
            <div class="feature">💬 Forum Discussions</div>
            <div class="feature">📸 Photo Gallery</div>
            <div class="feature">💌 Private Messages</div>
            <div class="feature">🎯 Community Events</div>
          </div>
          <div class="footer">
            <p>Sent from no-reply@nazzelandavionna.site</p>
            <p>© 2025 Nazzel & Avionna. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  forumNotification: (username: string, postTitle: string, type: string) => ({
    subject: `🔔 Forum Update - ${postTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="utf-8">
      <title>Forum Notification</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#fff8f9; margin:0; padding:0;}
        .container { max-width:600px; margin:0 auto; padding:20px;}
        .header { text-align:center; background:#ff6b9d; color:white; padding:30px; border-radius:15px; margin-bottom:30px;}
        .content { background:white; padding:40px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1);}
        .notification { background:#e8f5e8; border:1px solid #4caf50; padding:20px; border-radius:10px; margin:20px 0;}
        .footer { text-align:center; color:#666; margin-top:30px; font-size:14px;}
      </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Forum Activity</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>New activity in forum:</p>
            <div class="notification">
              <strong>${type}</strong><br>
              Post: ${postTitle}
            </div>
            <p>Visit the forum to see more!</p>
          </div>
          <div class="footer">
            <p>Sent from no-reply@nazzelandavionna.site</p>
            <p>© 2025 Nazzel & Avionna. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}

// ===== Send Email Function =====
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
    envelope: { from: DEFAULT_FROM_EMAIL, to },
    replyTo: DEFAULT_FROM_EMAIL,
  })
  return { success: true, messageId: info.messageId }
}

// ===== Convenience Functions =====
export async function sendVerificationEmail(to: string, username: string, code: string) {
  const template = emailTemplates.emailVerification(username, code)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendPasswordResetEmail(to: string, username: string, code: string) {
  const template = emailTemplates.passwordReset(username, code)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendWelcomeEmail(to: string, username: string) {
  const template = emailTemplates.welcomeMember(username)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function sendForumNotificationEmail(to: string, username: string, postTitle: string, type: string) {
  const template = emailTemplates.forumNotification(username, postTitle, type)
  return sendEmail({ to, subject: template.subject, html: template.html })
}

// ===== Admin Log Email (Optional) =====
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "nazzelv.quinto@gmail.com"
export async function sendAdminLog(subject: string, html: string) {
  if (!ADMIN_EMAIL) return
  try {
    await sendEmail({ to: ADMIN_EMAIL, subject, html })
  } catch (_) {}
}
