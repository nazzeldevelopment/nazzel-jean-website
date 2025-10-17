# Email Troubleshooting Guide

## 🚨 Problem: No Emails Received from no-reply@nazzelandavionna.site

### Quick Fix Checklist

#### 1. **Environment Variables Setup**
Create `.env.local` file with these variables:

```env
# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-character-app-password

# Email Configuration
EMAIL_FROM=no-reply@nazzelandavionna.site
ADMIN_EMAIL=nazzelv.quinto@gmail.com

# reCAPTCHA (if using)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

#### 2. **Gmail App Password Setup**
1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account → Security → App passwords
3. Generate app password for "Mail"
4. Use this 16-character password in `SMTP_PASS`

#### 3. **Test Email Functionality**
Use the test endpoint to verify email sending:

```bash
POST /api/test-email-simple
{
  "email": "your-test-email@gmail.com"
}
```

### Common Issues & Solutions

#### Issue 1: "SMTP credentials not configured properly"
**Solution:**
- Check all environment variables are set
- Verify Gmail app password is correct
- Ensure no extra spaces in .env.local

#### Issue 2: "Authentication failed"
**Solution:**
- Use Gmail App Password, not regular password
- Enable 2FA on Gmail account
- Check SMTP_USER is correct Gmail address

#### Issue 3: "Connection timeout"
**Solution:**
- Check internet connection
- Verify SMTP_HOST and SMTP_PORT
- Try different port (465 with secure: true)

#### Issue 4: "Email sent but not received"
**Solution:**
- Check spam/junk folder
- Verify recipient email address
- Check Gmail sending limits (500/day for free accounts)

### Step-by-Step Debugging

#### Step 1: Check Environment Variables
```bash
# In your terminal, check if variables are loaded
echo $SMTP_HOST
echo $SMTP_USER
```

#### Step 2: Test SMTP Connection
```bash
# Test with curl (optional)
curl -v --url 'smtp://smtp.gmail.com:587' \
  --user 'your-gmail@gmail.com:your-app-password' \
  --mail-from 'no-reply@nazzelandavionna.site' \
  --mail-rcpt 'test@example.com'
```

#### Step 3: Check Server Logs
Look for these log messages:
- ✅ "Email configuration validated successfully"
- ✅ "Email sent successfully to [email]"
- ❌ "Email sending failed"
- ❌ "SMTP credentials not configured properly"

#### Step 4: Test Individual Components
1. **Test basic email sending:**
   ```bash
   POST /api/test-email-simple
   ```

2. **Test verification email:**
   ```bash
   POST /api/test-email
   {
     "email": "test@example.com",
     "testType": "verification"
   }
   ```

### Production Deployment

#### Vercel Environment Variables
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add all required variables
3. Redeploy the application

#### Other Hosting Platforms
- **Netlify:** Site settings → Environment variables
- **Railway:** Project → Variables
- **Heroku:** Settings → Config vars

### Email Templates Verification

All email templates include:
- ✅ Professional HTML design
- ✅ "From: Nazzel & Avionna <no-reply@nazzelandavionna.site>"
- ✅ Proper subject lines
- ✅ Verification codes and links

### Monitoring Email Delivery

#### Check These Locations:
1. **Inbox** - Primary location
2. **Spam/Junk** - Common for automated emails
3. **Promotions Tab** - Gmail may categorize here
4. **All Mail** - Gmail's catch-all folder

#### Gmail Specific:
- Check "Promotions" tab
- Add no-reply@nazzelandavionna.site to contacts
- Mark as "Not Spam" if in spam folder

### Advanced Configuration

#### For Custom SMTP (Not Gmail):
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=no-reply@nazzelandavionna.site
SMTP_PASS=your-smtp-password
```

#### For Cloudflare Email Routing:
```env
SMTP_HOST=smtp.cloudflare.com
SMTP_PORT=587
SMTP_USER=your-cloudflare-email
SMTP_PASS=your-cloudflare-password
```

### Testing Commands

#### 1. Test Email Configuration
```bash
curl -X POST http://localhost:3000/api/test-email-simple \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

#### 2. Test Verification Email
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com","testType":"verification"}'
```

### Success Indicators

#### ✅ Email System Working:
- Console shows "Email sent successfully"
- Test emails arrive in inbox
- Verification emails work
- Password reset emails work

#### ❌ Email System Failing:
- Console shows "Email sending failed"
- No emails received
- SMTP authentication errors
- Connection timeouts

### Emergency Fallback

If emails still don't work:
1. Check Gmail account for sent emails
2. Verify SMTP credentials
3. Try different email provider
4. Check hosting platform email restrictions

### Support

If issues persist:
1. Check server logs for detailed error messages
2. Verify all environment variables
3. Test with different email addresses
4. Check Gmail account security settings

---

## Quick Reference

### Required Environment Variables:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=no-reply@nazzelandavionna.site
ADMIN_EMAIL=nazzelv.quinto@gmail.com
```

### Test Endpoints:
- `/api/test-email-simple` - Basic email test
- `/api/test-email` - Advanced email testing

### Common Ports:
- 587 - SMTP with STARTTLS (recommended)
- 465 - SMTP with SSL/TLS
- 25 - SMTP (often blocked)

Your email system should now work properly! 🎉
