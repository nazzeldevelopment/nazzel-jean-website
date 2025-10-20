# Change Logs

## Subdomain header middleware - October 20, 2025

### Summary

Introduced middleware to detect wildcard subdomains and forward the extracted value to the app via a custom header, enabling all pages to respond to subdomain-specific contexts while keeping primary hosts unaffected.

### Key Changes

- **`middleware.ts`** Added new middleware that:
  - Computes the apex domain from `NEXT_PUBLIC_SITE_URL` and auto-allows the apex plus `www`.
  - Whitelists direct hosts from `NEXT_PUBLIC_DIRECT_HOSTS` as well as `localhost` and `127.0.0.1`.
  - Extracts the subdomain portion for wildcard hosts and injects it into the `x-subdomain` request header for downstream handlers.
  - Rewrites subdomains based on pairs supplied through `NEXT_PUBLIC_SUBDOMAIN_ROUTES`; when at least one mapping is defined, other subdomains fall back to a same-name path (e.g., `gallery.domain.com` → `/gallery`).
- **Environment** Documented expected variables:
  - `NEXT_PUBLIC_SITE_URL` must point to the apex domain (e.g., `https://www.nazzelandavionna.site`).
  - `NEXT_PUBLIC_DIRECT_HOSTS` can list comma-separated hosts that should bypass subdomain processing (optional).
  - `NEXT_PUBLIC_SUBDOMAIN_ROUTES` accepts comma-separated `subdomain=/path` pairs to override routing defaults.

### Deployment Notes

- Configure DNS/hosting for `*.nazzelandavionna.site` (or equivalent) to forward requests to the Next.js app.
- Verify deployments by inspecting incoming request headers to confirm `x-subdomain` is present when accessing wildcard hosts.

* **Consistent Sender Identity** - Standardized "from" field with proper name and address
* **Reliable Delivery** - Eliminated SMTP connection and authentication issues
* **Maintained Templates** - Preserved professional email templates while improving delivery

### Files Modified

#### Updated Files
* `lib/email.ts` - Completely refactored to use Resend instead of Nodemailer/SMTP
* `app/api/auth/forgot-password/route.ts` - Updated to work with Resend email service
* `app/api/auth/verify-email/route.ts` - Enhanced error handling for email sending
* `app/api/auth/reset-password/route.ts` - Updated to use correct email functions with Resend

### Features Implemented

#### Email Reliability
* **Modern API Integration** - Using Resend's reliable API instead of SMTP
* **Simplified Architecture** - Removed complex SMTP configuration and connection handling
* **Fallback Mechanisms** - Added retry logic for failed email attempts
* **Comprehensive Logging** - Better tracking of email success and failures

#### User Experience
* **Consistent Email Delivery** - Users receive authentication emails reliably
* **Maintained Professional Templates** - Same high-quality email designs with better delivery
* **Faster Email Processing** - Quicker email delivery through modern API

### Expected Results
* **Improved Email Reliability** - Higher success rate for verification and password reset emails
* **Simplified Maintenance** - Easier configuration with single API key
* **Better Deliverability** - Reduced chance of emails landing in spam folders
* **Robust Error Handling** - System continues functioning even if emails fail

### Environment Variables (required)

```env
# Required for email functionality
RESEND_API_KEY=re_xxxxxxxxxxxx

# Optional but recommended
DEFAULT_FROM_EMAIL=no-reply@nazzelandavionna.site
ADMIN_EMAIL=nazzelv.quinto@gmail.com
```

---

=======
## Email System Redesign - October 2025

### Summary

Completely redesigned the email system to simplify functionality while improving the visual design of email templates. Removed the complex email queue system and focused on direct email sending with professional templates for authentication flows.

### Key Changes
````markdown
# Change Logs

## Email Service Migration to Resend - October 16, 2025

### Summary

Migrated the email system from SMTP (Hostinger) to Resend email service for improved deliverability and reliability. This change addresses issues with the custom domain email sending and simplifies the email configuration.

### Key Changes

#### Email Service Migration
* **Switched to Resend API** - Replaced SMTP configuration with Resend's modern email API
* **Simplified Configuration** - Reduced environment variables to just `RESEND_API_KEY`
* **Improved Deliverability** - Better email delivery rates and inbox placement
* **Enhanced Error Handling** - Added fallback mechanisms and better error reporting

#### Authentication Email Improvements
* **Consistent Sender Identity** - Standardized "from" field with proper name and address
* **Reliable Delivery** - Eliminated SMTP connection and authentication issues
* **Maintained Templates** - Preserved professional email templates while improving delivery

### Files Modified

#### Updated Files
* `lib/email.ts` - Completely refactored to use Resend instead of Nodemailer/SMTP
* `app/api/auth/forgot-password/route.ts` - Updated to work with Resend email service
* `app/api/auth/verify-email/route.ts` - Enhanced error handling for email sending
* `app/api/auth/reset-password/route.ts` - Updated to use correct email functions with Resend

### Features Implemented

#### Email Reliability
* **Modern API Integration** - Using Resend's reliable API instead of SMTP
* **Simplified Architecture** - Removed complex SMTP configuration and connection handling
* **Fallback Mechanisms** - Added retry logic for failed email attempts
* **Comprehensive Logging** - Better tracking of email success and failures

#### User Experience
* **Consistent Email Delivery** - Users receive authentication emails reliably
* **Maintained Professional Templates** - Same high-quality email designs with better delivery
* **Faster Email Processing** - Quicker email delivery through modern API

### Expected Results
* **Improved Email Reliability** - Higher success rate for verification and password reset emails
* **Simplified Maintenance** - Easier configuration with single API key
* **Better Deliverability** - Reduced chance of emails landing in spam folders
* **Robust Error Handling** - System continues functioning even if emails fail

### Environment Variables (required)

```env

# Optional but recommended
DEFAULT_FROM_EMAIL=no-reply@nazzelandavionna.site
ADMIN_EMAIL=nazzelv.quinto@gmail.com
```
NEXT_PUBLIC_SITE_NAME=
NEXT_PUBLIC_SITE_TAGLINE=
NEXT_PUBLIC_SITE_DESCRIPTION=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_API_BASE_URL=

# Server-side secrets (do NOT commit real keys)
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=no-reply@nazzelandavionna.site
ADMIN_EMAIL=you@yourdomain.com
---

## Email System Redesign - October 2025

### Summary

Completely redesigned the email system to simplify functionality while improving the visual design of email templates. Removed the complex email queue system and focused on direct email sending with professional templates for authentication flows.

### Key Changes

#### Email System Simplification
* **Removed Email Queue System** - Eliminated unnecessary complexity for better reliability
* **Simplified Email Sending** - Direct email delivery without queuing delays
* **Professional Email Templates** - Modern, responsive HTML email designs
* **Retained Admin Logging** - Maintained essential admin notification emails

#### Authentication Email Improvements
* **Email Verification** - Redesigned template with improved layout and styling
* **Password Reset** - Enhanced template with clear instructions and branding
* **Test Email Functionality** - Maintained for development and testing

### Files Modified

#### Updated Files
* `lib/email.ts` - Completely refactored to remove queue system and improve templates

### Email Templates Redesigned

#### User-Facing Emails
* **Verification Emails** - Modern design with clear verification button
* **Password Reset Emails** - Professional layout with secure reset link
* **Test Emails** - Maintained for development and testing

### Features Implemented

#### Email Reliability
* **Direct Delivery** - Emails sent immediately without complex queue system
* **Simplified Architecture** - Removed potential points of failure
* **Maintained Logging** - Kept essential admin notification functionality

#### User Experience
* **Professional Templates** - Modern HTML emails with consistent branding
* **Responsive Design** - Templates work well on all devices
* **Clear Call-to-Action** - Prominent buttons for verification and password reset
* **Improved Readability** - Better typography and spacing

### Expected Results
* **Simplified Email System** - More reliable and easier to maintain
* **Professional Email Templates** - Better user experience with modern design
* **Maintained Compatibility** - Works with all existing authentication flows
* **Admin Logging** - Essential admin notifications still functional

---

## October 20, 2025 — Environment variable handling

- Removed reliance on a local `.env.local` file in the repository. The project uses environment variables provided by the host (Vercel, Netlify, etc.) for production.
- If you need a local example for development, copy `.env.local.example` to `.env.local` (this file is ignored by git). Do not commit real secrets.
- Minimum recommended environment variables to set on your host:
	- `NEXT_PUBLIC_SITE_NAME` (optional, friendly name shown in UI)
	- `NEXT_PUBLIC_SITE_URL` (recommended, used in metadata and email links)
	- `RESEND_API_KEY` (required for email delivery)
	- `EMAIL_FROM` (recommended override for the from address)
	- `ADMIN_EMAIL` (optional admin notification address)

---

## October 20, 2025 — Forum theme configuration

- **`NEXT_PUBLIC_FORUM_THEME`** controls which forum theme tokens are loaded from `config/forum-theme.ts`.
- Supported keys (case-sensitive):
	- `default` → Aurora palette (soft rose & cyan, bright surfaces)
	- `sunset` → Vesper palette (warm evening oranges & ambers)
	- `midnight` → Lumen palette (cool midnight blues & violets)
- When the variable is unset or an unknown key is supplied, the forum falls back to `default` automatically.
- Update your deployment settings or `.env.local` with the desired key, for example:

```env
NEXT_PUBLIC_FORUM_THEME=midnight
```

---
