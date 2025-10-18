import { Resend } from 'resend';

// -------------------- ENV Variables --------------------
const DEFAULT_FROM_EMAIL =
  process.env.EMAIL_FROM || process.env.NOREPLY_EMAIL || "no-reply@nazzelandavionna.site"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "nazzelv.quinto@gmail.com"

// -------------------- Environment Validation --------------------
export function validateEmailConfig() {
  const required = ['RESEND_API_KEY']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.warn("Missing required email environment variable:", missing)
    return false
  }
  
  console.log("Email configuration validated successfully")
  return true
}

// -------------------- Resend Client --------------------
export const resend = new Resend(process.env.RESEND_API_KEY || '');

// -------------------- Email Templates --------------------
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
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333333;
            line-height: 1.6;
          }
          
          .container {
            max-width: 650px;
            margin: 0 auto;
            padding: 0;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          
          .header {
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
            padding: 35px 0;
            text-align: center;
          }
          
          .header img {
            width: 180px;
            height: auto;
          }
          
          .header h1 {
            color: white;
            margin: 15px 0 0;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
          
          .content {
            padding: 40px;
            color: #444;
          }
          
          h2 {
            color: #c44569;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          p {
            margin-bottom: 20px;
            font-size: 16px;
            color: #555;
          }
          
          .verification-code {
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 5px;
            box-shadow: 0 4px 15px rgba(196, 69, 105, 0.3);
          }
          
          .btn-container {
            text-align: center;
            margin: 35px 0;
          }
          
          .btn {
            display: inline-block;
            padding: 15px 40px;
            font-size: 16px;
            font-weight: 600;
            color: white;
            text-decoration: none;
            border-radius: 50px;
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
            box-shadow: 0 4px 15px rgba(196, 69, 105, 0.3);
            transition: all 0.3s ease;
          }
          
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 20px rgba(196, 69, 105, 0.4);
          }
          
          .note {
            background-color: #f8f9fa;
            border-left: 4px solid #c44569;
            padding: 15px;
            margin: 30px 0;
            font-size: 14px;
            color: #666;
            border-radius: 4px;
          }
          
          .signature {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-style: italic;
            color: #777;
          }
          
          .signature strong {
            color: #c44569;
            font-style: normal;
          }
          
          .footer {
            background-color: #f8f9fa;
            text-align: center;
            padding: 30px;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #eee;
          }
          
          .social-links {
            margin: 20px 0;
          }
          
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #c44569;
            text-decoration: none;
          }
          
          .copyright {
            margin-top: 20px;
            font-size: 13px;
            color: #aaa;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💕 Nazzel & Avionna 💕</h1>
          </div>
          
          <div class="content">
            <h2>Hello ${username}!</h2>
            
            <p>Thank you for joining our love story! To complete your registration and access all features, please verify your email address using the verification code below:</p>
            
            <div class="verification-code">${verificationCode}</div>
            
            <div class="btn-container">
              <a href="https://www.nazzelandavionna.site/account/verify-email?code=${verificationCode}" class="btn">Verify Email Now</a>
            </div>
            
            <div class="note">
              <strong>Note:</strong> This verification code will expire in 24 hours. If you did not create an account with us, please disregard this email.
            </div>
            
            <p>Once verified, you'll have full access to our community features, including our forum, gallery, and more!</p>
            
            <div class="signature">
              With love,<br>
              <strong>Nazzel & Avionna</strong> 💕
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent from ${DEFAULT_FROM_EMAIL}</p>
            <div class="copyright">© 2025 Nazzel & Avionna's Love Story. All rights reserved.</div>
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
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333333;
            line-height: 1.6;
          }
          
          .container {
            max-width: 650px;
            margin: 0 auto;
            padding: 0;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          
          .header {
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
            padding: 35px 0;
            text-align: center;
          }
          
          .header img {
            width: 180px;
            height: auto;
          }
          
          .header h1 {
            color: white;
            margin: 15px 0 0;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
          
          .content {
            padding: 40px;
            color: #444;
          }
          
          h2 {
            color: #c44569;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          p {
            margin-bottom: 20px;
            font-size: 16px;
            color: #555;
          }
          
          .reset-code {
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 5px;
            box-shadow: 0 4px 15px rgba(196, 69, 105, 0.3);
          }
          
          .btn-container {
            text-align: center;
            margin: 35px 0;
          }
          
          .btn {
            display: inline-block;
            padding: 15px 40px;
            font-size: 16px;
            font-weight: 600;
            color: white;
            text-decoration: none;
            border-radius: 50px;
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
            box-shadow: 0 4px 15px rgba(196, 69, 105, 0.3);
            transition: all 0.3s ease;
          }
          
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 7px 20px rgba(196, 69, 105, 0.4);
          }
          
          .warning {
            background-color: #fff8e1;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 30px 0;
            font-size: 14px;
            color: #856404;
            border-radius: 4px;
          }
          
          .signature {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-style: italic;
            color: #777;
          }
          
          .signature strong {
            color: #c44569;
            font-style: normal;
          }
          
          .footer {
            background-color: #f8f9fa;
            text-align: center;
            padding: 30px;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #eee;
          }
          
          .social-links {
            margin: 20px 0;
          }
          
          .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #c44569;
            text-decoration: none;
          }
          
          .copyright {
            margin-top: 20px;
            font-size: 13px;
            color: #aaa;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          
          <div class="content">
            <h2>Hello ${username}!</h2>
            
            <p>We received a request to reset your password. Use the code below to create a new password:</p>
            
            <div class="reset-code">${resetCode}</div>
            
            <div class="btn-container">
              <a href="https://www.nazzelandavionna.site/account/reset-password?code=${resetCode}" class="btn">Reset Password</a>
            </div>
            
            <div class="warning">
              <strong>Important:</strong> This reset code will expire in 1 hour for security reasons. If you did not request a password reset, please ignore this email or contact support if you have concerns.
            </div>
            
            <p>For security reasons, please create a strong password that you don't use on other websites.</p>
            
            <div class="signature">
              With love,<br>
              <strong>Nazzel & Avionna</strong> 💕
            </div>
          </div>
          
          <div class="footer">
            <p>This email was sent from ${DEFAULT_FROM_EMAIL}</p>
            <div class="copyright">© 2025 Nazzel & Avionna's Love Story. All rights reserved.</div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
}

// -------------------- Generic Send Email --------------------
export async function sendEmail({
  to,
  subject,
  html,
  from = `"Nazzel & Avionna" <${DEFAULT_FROM_EMAIL}>`
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  try {
    // Verify configuration
    if (!validateEmailConfig()) {
      console.error("Email configuration validation failed")
      throw new Error("Resend API key not configured properly")
    }

    console.log(`Attempting to send email to ${to} from ${from}`)

    try {
      const data = await resend.emails.send({
        from: `Nazzel & Avionna <${DEFAULT_FROM_EMAIL}>`,
        to: [to],
        subject: subject,
        html: html,
        reply_to: DEFAULT_FROM_EMAIL,
      });

      console.log(`✅ Email sent successfully to ${to}:`, data.id)
      return { success: true, messageId: data.id }
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError)
      
      // Try with alternative settings (just the domain email without the name)
      try {
        const data = await resend.emails.send({
          from: DEFAULT_FROM_EMAIL,
          to: [to],
          subject: subject,
          html: html,
        });
        
        console.log(`✅ Email sent successfully with alternative settings to ${to}:`, data.id)
        return { success: true, messageId: data.id }
      } catch (retryError) {
        throw retryError; // Re-throw to be caught by outer catch
      }
    }
  } catch (error) {
    console.error("❌ Email sending failed after all attempts:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    // Return failure instead of throwing to prevent API routes from crashing
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// -------------------- Convenience Send Functions --------------------
export async function sendVerificationEmail(to: string, username: string, verificationCode: string) {
  try {
    const template = emailTemplates.emailVerification(username, verificationCode)
    return await sendEmail({ 
      to, 
      subject: template.subject, 
      html: template.html
    })
  } catch (error) {
    console.error("Verification email failed:", error)
    throw error
  }
}

export async function sendPasswordResetEmail(to: string, username: string, resetCode: string) {
  try {
    const template = emailTemplates.passwordReset(username, resetCode)
    return await sendEmail({ 
      to, 
      subject: template.subject, 
      html: template.html
    })
  } catch (error) {
    console.error("Password reset email failed:", error)
    throw error
  }
}

// -------------------- Admin Log --------------------
export async function sendAdminLog(subject: string, html: string) {
  if (!ADMIN_EMAIL) {
    console.warn("Admin email not configured, skipping admin log")
    return
  }
  try {
    return await sendEmail({ to: ADMIN_EMAIL, subject, html })
  } catch (error) {
    console.error("Admin log email failed:", error)
    throw error
  }
}

// -------------------- Test Email --------------------
export async function sendTestEmail(to: string) {
  return sendEmail({
    to,
    subject: "🧪 Test Email - Nazzel & Avionna",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Email</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333333;
            line-height: 1.6;
          }
          
          .container {
            max-width: 650px;
            margin: 0 auto;
            padding: 0;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          
          .header {
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
            padding: 35px 0;
            text-align: center;
          }
          
          .header h1 {
            color: white;
            margin: 15px 0 0;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }
          
          .content {
            padding: 40px;
            color: #444;
            text-align: center;
          }
          
          h2 {
            color: #c44569;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          p {
            margin-bottom: 20px;
            font-size: 16px;
            color: #555;
          }
          
          .success-icon {
            font-size: 48px;
            margin: 20px 0;
            color: #4caf50;
          }
          
          .footer {
            background-color: #f8f9fa;
            text-align: center;
            padding: 30px;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #eee;
          }
          
          .copyright {
            margin-top: 20px;
            font-size: 13px;
            color: #aaa;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Email Test</h1>
          </div>
          
          <div class="content">
            <div class="success-icon">✅</div>
            <h2>Email System Working!</h2>
            <p>If you received this email, the email system is configured correctly and working as expected.</p>
            <p>This is a test email sent from the Nazzel & Avionna website.</p>
          </div>
          
          <div class="footer">
            <p>This email was sent from ${DEFAULT_FROM_EMAIL}</p>
            <div class="copyright">© 2025 Nazzel & Avionna's Love Story. All rights reserved.</div>
          </div>
        </div>
      </body>
      </html>
    `
  })
}
