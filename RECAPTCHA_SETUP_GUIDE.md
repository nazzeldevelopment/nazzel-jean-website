# Google reCAPTCHA Setup Guide

## 🛡️ Overview
This guide helps you set up Google reCAPTCHA v2 for the signup forms to prevent spam and bot registrations.

## 🔧 Setup Steps

### 1. **Get reCAPTCHA Keys from Google**

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to add a new site
3. Fill in the details:
   - **Label**: Nazzel & Avionna Website
   - **reCAPTCHA type**: reCAPTCHA v2 ("I'm not a robot" Checkbox)
   - **Domains**: 
     - `nazzelandavionna.site`
     - `www.nazzelandavionna.site`
     - `localhost` (for development)
4. Accept the Terms of Service
5. Click "Submit"

### 2. **Get Your Keys**

After creating the site, you'll get:
- **Site Key** (public) - for frontend
- **Secret Key** (private) - for backend

### 3. **Environment Variables**

Add these to your `.env.local` file:

```env
# reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here
```

### 4. **Deploy Environment Variables**

For production deployment (Vercel/Netlify), add these environment variables:
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

## 🎯 Features Implemented

### **Frontend Components**
- ✅ Real Google reCAPTCHA v2 widget
- ✅ Custom React component with TypeScript
- ✅ Error handling and validation
- ✅ Auto-reset on form errors
- ✅ Loading states and user feedback

### **Backend Verification**
- ✅ Server-side token verification
- ✅ Google API integration
- ✅ Error handling and logging
- ✅ Fallback for missing configuration

### **Security Features**
- ✅ Token validation on every signup
- ✅ Prevents bot registrations
- ✅ Rate limiting protection
- ✅ Secure secret key handling

## 📁 Files Modified

### **New Files Created:**
- `components/recaptcha.tsx` - reCAPTCHA React component
- `RECAPTCHA_SETUP_GUIDE.md` - This setup guide

### **Updated Files:**
- `app/signup/account/page.tsx` - Main signup form
- `app/account/signup/page.tsx` - Alternative signup form
- `app/api/auth/signup/route.ts` - Signup API with reCAPTCHA verification
- `package.json` - Added reCAPTCHA dependencies

## 🔍 How It Works

### **1. User Experience**
1. User fills out signup form
2. reCAPTCHA widget appears at bottom
3. User clicks "I'm not a robot" checkbox
4. Google verifies user is human
5. Form submits with reCAPTCHA token

### **2. Backend Process**
1. API receives signup request with token
2. Server sends token to Google for verification
3. Google responds with success/failure
4. If valid, user account is created
5. If invalid, error is returned

### **3. Error Handling**
- **Token missing**: "reCAPTCHA verification required"
- **Token invalid**: "reCAPTCHA verification failed"
- **Network error**: "An error occurred. Please try again."
- **Expired token**: Auto-reset reCAPTCHA widget

## 🧪 Testing

### **Development Testing**
1. Set up local environment variables
2. Test with valid reCAPTCHA
3. Test with invalid/expired tokens
4. Test error scenarios

### **Production Testing**
1. Deploy with environment variables
2. Test signup flow on live site
3. Verify reCAPTCHA appears correctly
4. Test bot prevention

## ⚙️ Configuration Options

### **reCAPTCHA Themes**
- `light` - Light theme (default)
- `dark` - Dark theme

### **reCAPTCHA Sizes**
- `normal` - Standard size (default)
- `compact` - Smaller size
- `invisible` - Hidden (advanced)

### **Customization**
```tsx
<ReCaptcha
  onVerify={handleVerify}
  onExpire={handleExpire}
  onError={handleError}
  theme="dark"        // or "light"
  size="compact"      // or "normal", "invisible"
  className="custom-class"
/>
```

## 🚨 Troubleshooting

### **Common Issues**

#### **1. reCAPTCHA Not Loading**
- Check `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
- Verify domain is added to reCAPTCHA settings
- Check browser console for errors

#### **2. Verification Always Fails**
- Check `RECAPTCHA_SECRET_KEY` is set
- Verify secret key matches the site key
- Check server logs for API errors

#### **3. Widget Not Appearing**
- Ensure domain is whitelisted in Google Console
- Check for JavaScript errors
- Verify network connectivity

### **Debug Mode**
Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📊 Monitoring

### **Google reCAPTCHA Console**
- Monitor verification attempts
- View success/failure rates
- Check for suspicious activity

### **Application Logs**
- Track verification failures
- Monitor error rates
- Debug integration issues

## 🔒 Security Best Practices

### **1. Key Management**
- Never commit secret keys to version control
- Use environment variables for all keys
- Rotate keys regularly

### **2. Domain Validation**
- Only allow verified domains
- Remove test domains from production
- Use HTTPS in production

### **3. Error Handling**
- Don't expose sensitive information in errors
- Log security events
- Implement rate limiting

## 🚀 Deployment Checklist

### **Before Deployment**
- [ ] Get reCAPTCHA keys from Google
- [ ] Add environment variables
- [ ] Test locally with real keys
- [ ] Verify domain configuration

### **After Deployment**
- [ ] Test signup flow on live site
- [ ] Verify reCAPTCHA appears
- [ ] Test error scenarios
- [ ] Monitor verification success rate

## 📈 Performance Impact

### **Loading Time**
- reCAPTCHA adds ~50-100ms to page load
- Widget loads asynchronously
- No impact on form validation

### **User Experience**
- One additional click required
- Visual feedback during verification
- Clear error messages

## 🎯 Success Metrics

### **Security Improvements**
- Reduced bot registrations
- Lower spam accounts
- Better user quality

### **User Experience**
- Smooth verification process
- Clear error messages
- Minimal friction

Your signup forms are now protected with Google reCAPTCHA v2! 🛡️
