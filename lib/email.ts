import nodemailer from "nodemailer"

// SMTP transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.GMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD,
  },
})

// Email templates for different purposes
export const emailTemplates = {
  // Email verification template
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
          .button { display: inline-block; background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .heart { color: #ff6b9d; font-size: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💕 Welcome to Our Love Story 💕</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Welcome to <strong>Nazzel & Avionna's</strong> beautiful love story website! We're so excited to have you join our community.</p>
            
            <p>To complete your registration and become a verified member, please verify your email address using the code below:</p>
            
            <div class="verification-code">
              ${verificationCode}
            </div>
            
            <p>This verification code will expire in <strong>24 hours</strong> for security purposes.</p>
            
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>✨ Post in our forum discussions</li>
              <li>💬 Send private messages</li>
              <li>📸 Access our photo gallery</li>
              <li>🎉 Participate in our community events</li>
            </ul>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <p>With love and warmest regards,<br>
            <strong>Nazzel & Avionna</strong> <span class="heart">💕</span></p>
          </div>
          <div class="footer">
            <p>This email was sent from donotreply@nazzelandavionna.site</p>
            <p>© 2025 Nazzel & Avionna's Love Story. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Password reset template
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
          .button { display: inline-block; background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .heart { color: #ff6b9d; font-size: 20px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>We received a request to reset your password for your account on <strong>Nazzel & Avionna's Love Story</strong> website.</p>
            
            <p>If you requested this password reset, please use the code below:</p>
            
            <div class="reset-code">
              ${resetCode}
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This reset code will expire in <strong>1 hour</strong> for your security. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </div>
            
            <p>To reset your password:</p>
            <ol>
              <li>Go to the password reset page</li>
              <li>Enter the code above</li>
              <li>Create a new secure password</li>
            </ol>
            
            <p>For your security, please choose a strong password that includes:</p>
            <ul>
              <li>At least 8 characters</li>
              <li>A mix of letters, numbers, and symbols</li>
              <li>No personal information</li>
            </ul>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            
            <p>With love and care,<br>
            <strong>Nazzel & Avionna</strong> <span class="heart">💕</span></p>
          </div>
          <div class="footer">
            <p>This email was sent from donotreply@nazzelandavionna.site</p>
            <p>© 2025 Nazzel & Avionna's Love Story. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Welcome message for new members
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
          .celebration { text-align: center; font-size: 48px; margin: 20px 0; }
          .feature { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #ff6b9d; }
          .button { display: inline-block; background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .heart { color: #ff6b9d; font-size: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <div class="celebration">🎊✨🎉</div>
            
            <h2>Hello ${username}!</h2>
            <p>Congratulations! Your email has been successfully verified and you are now a <strong>verified member</strong> of our beautiful love story community!</p>
            
            <p>As a verified member, you now have access to all the amazing features of our website:</p>
            
            <div class="feature">
              <strong>💬 Forum Discussions</strong><br>
              Share your thoughts, memories, and join conversations in our community forum.
            </div>
            
            <div class="feature">
              <strong>📸 Photo Gallery</strong><br>
              Access our private photo collections and create your own albums.
            </div>
            
            <div class="feature">
              <strong>💌 Private Messages</strong><br>
              Send and receive private messages with other community members.
            </div>
            
            <div class="feature">
              <strong>🎯 Community Events</strong><br>
              Participate in special events and celebrations.
            </div>
            
            <p>We're so excited to have you as part of our community! Your journey with us is just beginning.</p>
            
            <p>Feel free to explore all the features and don't hesitate to reach out if you have any questions.</p>
            
            <p>Welcome to our family!<br>
            <strong>Nazzel & Avionna</strong> <span class="heart">💕</span></p>
          </div>
          <div class="footer">
            <p>This email was sent from donotreply@nazzelandavionna.site</p>
            <p>© 2025 Nazzel & Avionna's Love Story. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // Forum notification template
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
          .button { display: inline-block; background: linear-gradient(135deg, #ff6b9d, #c44569); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .heart { color: #ff6b9d; font-size: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Forum Activity</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>There's new activity in our forum that might interest you!</p>
            
            <div class="notification">
              <h3>${notificationType}</h3>
              <p><strong>Post:</strong> ${postTitle}</p>
              <p>Someone has interacted with a post you're following or mentioned you in a discussion.</p>
            </div>
            
            <p>Click the button below to view the latest activity and join the conversation!</p>
            
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nazzelandavionna.site'}/forum" class="button">
              View Forum Activity
            </a>
            
            <p>Stay connected with our community and never miss an update!</p>
            
            <p>With love,<br>
            <strong>Nazzel & Avionna</strong> <span class="heart">💕</span></p>
          </div>
          <div class="footer">
            <p>This email was sent from donotreply@nazzelandavionna.site</p>
            <p>© 2025 Nazzel & Avionna's Love Story. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}
const DEFAULT_FROM_EMAIL = process.env.EMAIL_FROM || process.env.NOREPLY_EMAIL || "no-reply@nazzelandavionna.site"
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

// Convenience functions for different email types
export async function sendVerificationEmail(to: string, username: string, verificationCode: string) {
  const template = emailTemplates.emailVerification(username, verificationCode)
  return await sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendPasswordResetEmail(to: string, username: string, resetCode: string) {
  const template = emailTemplates.passwordReset(username, resetCode)
  return await sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendWelcomeEmail(to: string, username: string) {
  const template = emailTemplates.welcomeMember(username)
  return await sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

export async function sendForumNotificationEmail(to: string, username: string, postTitle: string, notificationType: string) {
  const template = emailTemplates.forumNotification(username, postTitle, notificationType)
  return await sendEmail({
    to,
    subject: template.subject,
    html: template.html,
  })
}

// Test email function
export async function sendTestEmail(to: string) {
  return await sendEmail({
    to,
    subject: "🧪 Test Email - Nazzel & Avionna's Love Story",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Email</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #ffe6eb 0%, #fff8f9 100%); }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #ff6b9d, #c44569); border-radius: 15px; margin-bottom: 30px; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 300; }
          .content { background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 10px; margin: 20px 0; color: #155724; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .heart { color: #ff6b9d; font-size: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🧪 Test Email</h1>
          </div>
          <div class="content">
            <div class="success">
              <h3>✅ Email System Working!</h3>
              <p>This is a test email to verify that the email system is working correctly.</p>
            </div>
            
            <h2>Email Configuration Status:</h2>
            <ul>
              <li>✅ SMTP Server: Gmail</li>
              <li>✅ From Address: donotreply@nazzelandavionna.site</li>
              <li>✅ Templates: Ready</li>
              <li>✅ Professional Styling: Active</li>
            </ul>
            
            <p>If you received this email, the email system is working perfectly!</p>
            
            <p>With love,<br>
            <strong>Nazzel & Avionna</strong> <span class="heart">💕</span></p>
          </div>
          <div class="footer">
            <p>This email was sent from donotreply@nazzelandavionna.site</p>
            <p>© 2025 Nazzel & Avionna's Love Story. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

// Admin log email helper
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "nazzelv.quinto@gmail.com"
export async function sendAdminLog(subject: string, html: string) {
  if (!ADMIN_EMAIL) return
  try {
    await sendEmail({ to: ADMIN_EMAIL, subject, html })
  } catch (_) {
    // swallow admin log failures
  }
}
