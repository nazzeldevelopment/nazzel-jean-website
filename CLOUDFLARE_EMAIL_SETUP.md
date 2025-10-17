# Cloudflare Email Routing Setup Guide

## Overview
This guide helps you optimize email delivery through Cloudflare Email Routing for your custom domain `nazzelandavionna.site`.

## 1. Cloudflare Email Routing Configuration

### Step 1: Enable Email Routing
1. Go to Cloudflare Dashboard → Email → Email Routing
2. Add your domain `nazzelandavionna.site`
3. Verify domain ownership

### Step 2: Configure Email Addresses
1. Create catch-all rule: `*@nazzelandavionna.site` → `your-gmail@gmail.com`
2. Create specific address: `no-reply@nazzelandavionna.site` → `your-gmail@gmail.com`

### Step 3: DNS Records
Ensure these DNS records are set in Cloudflare:
```
Type: MX
Name: @
Value: route.nazzelandavionna.site
Priority: 10

Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all

Type: TXT
Name: @
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@nazzelandavionna.site
```

## 2. SMTP Configuration

### For Gmail SMTP (Recommended)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=no-reply@nazzelandavionna.site
ADMIN_EMAIL=your-gmail@gmail.com
```

### For Cloudflare SMTP (Alternative)
```env
SMTP_HOST=smtp.cloudflare.com
SMTP_PORT=587
SMTP_USER=your-cloudflare-email
SMTP_PASS=your-cloudflare-password
EMAIL_FROM=no-reply@nazzelandavionna.site
ADMIN_EMAIL=your-gmail@gmail.com
```

## 3. Gmail App Password Setup

1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account → Security → App passwords
3. Generate app password for "Mail"
4. Use this password in `SMTP_PASS`

## 4. Email Delivery Optimization

### Immediate vs Queued Delivery
- **Critical emails** (verification, password reset): Sent immediately
- **Non-critical emails** (welcome, notifications): Queued for reliable delivery

### Queue Management
- Emails are retried with exponential backoff
- Failed emails are retried up to 3-5 times
- Queue processes every 30 seconds

## 5. Testing Email Delivery

### Test Endpoint
```bash
POST /api/test-email
{
  "email": "test@example.com",
  "testType": "test",
  "immediate": true
}
```

### Test Types
- `test`: Basic test email
- `verification`: Email verification template
- `password-reset`: Password reset template
- `welcome`: Welcome email template
- `queue-status`: Check email queue status

## 6. Troubleshooting

### Common Issues
1. **403 Forbidden**: Check SMTP credentials
2. **500 Internal Error**: Verify environment variables
3. **Email delays**: Check Cloudflare DNS propagation
4. **Authentication failed**: Verify Gmail app password

### Debug Mode
Set `NODE_ENV=development` to enable SMTP debug logging.

### Queue Status
Check `/api/test-email` with `testType: "queue-status"` to monitor email queue.

## 7. Performance Tips

1. **Use connection pooling**: Already enabled in configuration
2. **Rate limiting**: Set to 10 emails per second
3. **Retry logic**: Exponential backoff for failed emails
4. **Queue processing**: Every 30 seconds for reliability

## 8. Monitoring

Monitor email delivery through:
- Cloudflare Email Routing dashboard
- Application logs
- Email queue status endpoint
- Gmail delivery reports

## 9. Security Considerations

1. Use app passwords instead of main Gmail password
2. Enable 2FA on Gmail account
3. Regularly rotate SMTP credentials
4. Monitor for unusual email activity
5. Use HTTPS for all email-related endpoints

## 10. Environment Variables Checklist

```env
# Required
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password

# Optional
SMTP_PORT=587
EMAIL_FROM=no-reply@nazzelandavionna.site
ADMIN_EMAIL=your-gmail@gmail.com
NODE_ENV=production
```
