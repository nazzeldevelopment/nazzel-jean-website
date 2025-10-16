import nodemailer from "nodemailer"

const DEFAULT_FROM_EMAIL = process.env.EMAIL_FROM || process.env.NOREPLY_EMAIL || "no-reply@nazzelandavionna.site"

// SMTP transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
})

// Email templates
export const emailTemplates = {
  emailVerification: (username: string, verificationCode: string) => ({
    subject: "✨ Verify Your Email - Nazzel & Avionna",
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
          .btn { display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: bold; color: white; text-decoration: none; border-radius: 8px; background: linear-gradient(135deg, #ff6b9d, #c44569); margin: 20px 0; }
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
            <p>Verify your email using the code below:</p>
            <div class="verification-code">${verificationCode}</div>
            <a href="https://www.nazzelandavionna.site/verify?code=${verificationCode}" class="btn">Verify Now</a>
            <p>If you didn't create an account, ignore this email.</p>
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

  passwordReset: (username: string, resetCode: string) => ({
    subject: "🔐 Reset Your Password - Nazzel & Avionna",
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
          .btn { display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: bold; color: white; text-decoration: none; border-radius: 8px; background: linear-gradient(135deg, #ff6b9d, #c44569); margin: 20px 0; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello ${username}!</h2>
            <p>Reset your password using the code below:</p>
            <div class="reset-code">${resetCode}</div>
            <a href="https://www.nazzelandavionna.site/reset-password?code=${resetCode}" class="btn">Reset Password</a>
            <div class="warning">
              ⚠️ Code expires in 1 hour. Ignore if you didn't request this.
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

  welcomeMember: (username: string) => ({
    subject: "🎉 Welcome to Our Community!",
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
          .btn { display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: bold; color: white; text-decoration: none; border-radius: 8px; background: linear-gradient(135deg, #ff6b9d, #c44569); margin: 20px 0; }
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
            <p>Your email is verified. Access all features now!</p>
            <a href="https://www.nazzelandavionna.site/forum" class="btn">Visit Forum</a>
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
          .btn { display: inline-block; padding: 15px 30px; font-size: 16px; font-weight: bold; color: white; text-decoration: none; border-radius: 8px; background: linear-gradient(135deg, #ff6b9d, #c44569); margin: 20px 0; }
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
            <p>There's new activity in our forum:</p>
            <div class="notification">
              <h3>${notificationType}</h3>
              <p><strong>Post:</strong> ${postTitle}</p>
            </div>
            <a href="https://www.nazzelandavionna.site/forum" class="btn">View Forum</a>
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
