# Email Configuration Guide

## Gmail Setup for Professional Email System

This guide will help you set up professional email sending using Gmail with your custom domain `donotreply@nazzelandavionna.site`.

### Prerequisites

1. Gmail account
2. Custom domain `nazzelandavionna.site` configured with Cloudflare
3. Access to Cloudflare DNS settings

### Step 1: Configure Custom Domain Email in Cloudflare

1. **Login to Cloudflare Dashboard**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Select your domain `nazzelandavionna.site`

2. **Set up Email Routing**
   - Go to Email → Email Routing
   - Add custom email address: `donotreply@nazzelandavionna.site`
   - Forward to your Gmail address

3. **Configure DNS Records**
   - Add MX record: `@` → `route1.mx.cloudflare.net` (Priority: 1)
   - Add MX record: `@` → `route2.mx.cloudflare.net` (Priority: 2)
   - Add TXT record: `@` → `v=spf1 include:_spf.google.com ~all`

### Step 2: Gmail App Password Setup

1. **Enable 2-Factor Authentication**
   - Go to Google Account Settings
   - Security → 2-Step Verification → Turn on

2. **Generate App Password**
   - Go to Google Account Settings
   - Security → App passwords
   - Select "Mail" and "Other (custom name)"
   - Enter "Nazzel Avionna Website"
   - Copy the generated 16-character password

### Step 3: Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Gmail Configuration
GMAIL_USER=donotreply@nazzelandavionna.site
GMAIL_APP_PASSWORD=your_16_character_app_password_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://nazzelandavionna.site
```

### Step 4: Test Email System

Create a test API route to verify email functionality:

```typescript
// app/api/test-email/route.ts
import { sendTestEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await sendTestEmail(email)
    
    return NextResponse.json({ 
      success: true, 
      message: "Test email sent successfully!" 
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json({ 
      error: "Failed to send test email" 
    }, { status: 500 })
  }
}
```

### Step 5: Production Deployment (Vercel)

1. **Add Environment Variables in Vercel**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add:
     - `GMAIL_USER` = `donotreply@nazzelandavionna.site`
     - `GMAIL_APP_PASSWORD` = `your_app_password`
     - `NEXT_PUBLIC_SITE_URL` = `https://nazzelandavionna.site`

2. **Redeploy**
   - Trigger a new deployment to apply the environment variables

### Email Templates Available

The system includes professional email templates for:

1. **Email Verification** (`sendVerificationEmail`)
   - Welcome message with verification code
   - Expires in 24 hours
   - Professional styling with love story theme

2. **Password Reset** (`sendPasswordResetEmail`)
   - Secure password reset with code
   - Expires in 1 hour
   - Security warnings and instructions

3. **Welcome Member** (`sendWelcomeEmail`)
   - Congratulatory message for verified members
   - Lists all available features
   - Community welcome

4. **Forum Notifications** (`sendForumNotificationEmail`)
   - Notifications for forum activity
   - Post mentions and interactions
   - Direct links to forum

5. **Test Email** (`sendTestEmail`)
   - System verification email
   - Configuration status check

### Usage Examples

```typescript
// Send verification email
import { sendVerificationEmail } from "@/lib/email"
await sendVerificationEmail("user@example.com", "John", "123456")

// Send password reset
import { sendPasswordResetEmail } from "@/lib/email"
await sendPasswordResetEmail("user@example.com", "John", "789012")

// Send welcome email
import { sendWelcomeEmail } from "@/lib/email"
await sendWelcomeEmail("user@example.com", "John")

// Send forum notification
import { sendForumNotificationEmail } from "@/lib/email"
await sendForumNotificationEmail("user@example.com", "John", "My Post Title", "New Reply")
```

### Security Features

- ✅ Gmail App Password (not regular password)
- ✅ TLS encryption
- ✅ Custom domain authentication
- ✅ SPF records for email validation
- ✅ Professional "From" address
- ✅ Rate limiting and error handling

### Troubleshooting

**Common Issues:**

1. **"Authentication failed"**
   - Check if 2FA is enabled
   - Verify App Password is correct
   - Ensure Gmail account is active

2. **"Email not delivered"**
   - Check spam folder
   - Verify DNS records are propagated
   - Test with different email providers

3. **"Connection timeout"**
   - Check internet connection
   - Verify Gmail SMTP settings
   - Check firewall settings

### Support

For email configuration issues:
1. Check Cloudflare Email Routing status
2. Verify Gmail App Password
3. Test with different email addresses
4. Check Vercel environment variables

---

**Email System Status:** ✅ Ready for Production  
**Custom Domain:** donotreply@nazzelandavionna.site  
**Provider:** Gmail via Cloudflare  
**Templates:** 5 Professional Templates  
**Security:** Enterprise Grade
