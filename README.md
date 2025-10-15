# Nazzel & Avionna - Love Story Website

## 🌐 Website Overview

**Title:** Nazzel & Avionna | Our Love Story Forever

**Description:** A romantic, full-featured love story website with forum discussions, private messaging, couple features, and comprehensive user management.

---

## ✨ Features

### 🏠 Main Pages

- **Homepage** (`/home`) - Beautiful landing page with animated couple spinner logo and rotating love quotes
- **About Story** (`/about/story`) - Your love story timeline from meeting in "One Love GC" to September 25
- **Forum Discussions** (`/forum`) - Full-featured community forum with categories, reactions, and social sharing
- **Private Messages** (`/messages`) - Secure DMs between Nazzel and Avionna
- **Couple Dashboard** (`/couple-dashboard`) - Anniversary countdown, love calendar, mood tracker
- **Gallery** (`/gallery`) - Photo albums with password-protected private folders
- **Admin Panel** (`/admin`) - Post moderation, user management, and analytics

### 🔐 Authentication System

- **Sign Up** (`/signup/account`)
  - Age verification (13+ required)
  - Relationship status selection (Single, In a Relationship, Complicated, Married, Engaged)
  - Password strength checker
  - Email verification with OTP
  - ReCaptcha anti-bot protection
  - Automatic "member" role assignment

- **Login** (`/login`)
  - Username or email login
  - Account locking after failed attempts (5 attempts = 5 min lock)
  - Forgot password link

- **Email Verification** (`/account/verify-email`)
  - 6-digit OTP code verification
  - Automatic member role notification via email

- **Password Reset** (`/account/forgot-password`, `/account/reset-password`)
  - OTP code sent to email
  - Password strength validation
  - Secure password reset flow

### 💬 Forum Features

- **Categories:**
  - Love Letters ❤️
  - Memories 📸
  - Thoughts & Quotes 💬
  - Future Dreams ✨
  - Open Talks 🌍

- **Advanced Features:**
  - Search posts and tags
  - Sort by newest, most liked, most discussed
  - Couple Mode filter (only Nazzel & Avionna posts)
  - Mood tags (Happy, Hopeful, Sentimental, Thoughtful, Excited)
  - Hashtag system (#anniversary, #promise, #memory)
  - Emoji reactions (❤️ 👍 😂 😮 😢 🔥)
  - View counts, seen counts, comment counts, share counts
  - Social media sharing (Facebook, Twitter, Instagram)
  - Online user list with live status indicators

### 👤 User Profile

- **Profile Settings** (`/profile/settings`)
  - Relationship status
  - Location
  - Bio (500 characters)
  - Join date display
  - Post count tracking

### 💑 Couple Features

- **Anniversary Countdown** - Live timer to September 25 with celebration popup
- **Love Calendar** - Important dates (anniversaries, birthdays, milestones)
- **Daily Love Quote Widget** - Rotating romantic quotes with fade animations
- **Shared Mood Tracker** - Daily mood logging with 7-day compatibility graph
- **Love Gallery** - Photo albums with password protection for private moments

### 🛡️ Admin Panel

**Credentials:**
- Username: `admin`
- Password: `Nazzelandavionna62529`

**Features:**
- Post moderation and deletion
- User management
- Analytics dashboard
- View counts, reactions, shares tracking
- Category distribution charts
- Top posts ranking

### 🎨 Design Features

- **Romantic Gradient Palette** - Day and night modes with rose/pink tones
- **Animated Elements:**
  - Couple spinner logo with rotating quotes
  - Floating hearts and sparkles
  - Smooth fade-in animations
  - Pulsing heart reactions
  - Glow effects on buttons

- **Typography:**
  - Playfair Display for romantic headings
  - Inter for clean body text
  - Enhanced readability with proper contrast

- **Responsive Design:**
  - Optimized for desktop, tablet, and mobile
  - Adaptive layouts for all screen sizes

### 🍪 Additional Features

- **Cookie Consent Banner** - "I accept the cookies and policy for better performance"
- **Footer** - "© 2025 Nazzel & Avionna — Our Love, Our Story, Our Forever. Made with ❤️ and destiny."
- **Theme Customizer** - Light/dark mode toggle with accent color selection
- **Heart Background** - Animated SVG hearts with floating effects

### 📄 Legal Pages

- **Terms of Service** (`/legal/terms`) - Community guidelines and forum rules
- **Privacy Policy** (`/legal/privacy`) - Data protection and privacy information

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Modern web browser

### Installation

1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal in the project directory
4. Run: `npm install`
5. Run: `npm run dev`
6. Open browser to `http://localhost:3000`

### First Steps

1. **Create Admin Account:**
   - Go to `/login`
   - Username: `admin`
   - Password: `Nazzelandavionna62529`

2. **Create User Account:**
   - Go to `/signup/account`
   - Fill in all required fields including relationship status
   - Verify email with OTP code (check console logs for code)
   - Automatic member role granted

3. **Explore Features:**
   - Visit `/forum` to see discussions
   - Create posts in different categories
   - React to posts with emojis
   - Share posts on social media
   - Check `/couple-dashboard` for couple features
   - View `/gallery` for photo albums
   - Access `/admin` for moderation

---

## 🔧 Technical Details

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Fonts:** Playfair Display, Inter
- **Icons:** Lucide React
- **Storage:** Local Storage (ready for MongoDB integration)

### Key Files

- `app/forum/page.tsx` - Main forum page
- `app/signup/account/page.tsx` - Registration page
- `app/login/page.tsx` - Login page
- `app/admin/page.tsx` - Admin panel
- `components/enhanced-header.tsx` - Forum header with tagline
- `components/couple-spinner-logo.tsx` - Animated logo
- `lib/db/models.ts` - Data models
- `lib/db/storage.ts` - Storage layer

### Environment Variables

Currently using local storage. To connect to MongoDB, add:

\`\`\`env
MONGODB_URI=your_mongodb_connection_string
\`\`\`

---

## 📝 Notes

- All OTP codes are logged to console in development
- Email notifications are simulated (check console logs)
- Member role is automatically assigned on signup
- Relationship status is required during signup
- Admin credentials are hardcoded for security
- Forum requires member status to post
- All pages include the couple spinner logo
- Cookie consent appears on all pages

---

## 💖 Love Story Summary

**Nazzel & Avionna**

Two souls, one heart. Sa mundong puno ng ingay, kami ang tahimik na kwento ng tunay na pagmamahalan.

**Their Story:**
- Met in "One Love GC" group chat
- Started with simple conversations and laughter
- Nazzel courted Avionna
- Became official on September 25
- Building their forever together

**Nazzel:** Protector, funny, at sobrang maalaga
**Avionna:** Sweet, matalino, at ang inspirasyon ng bawat ngiti ni Nazzel

---

## 🎯 Future Plans

- Travel around the Philippines 🌴
- Build dream home 🏡
- Start own business 💼
- Stay together, forever 💖

---

**Made with ❤️ and destiny**

© 2025 Nazzel & Avionna — Our Love, Our Story, Our Forever
