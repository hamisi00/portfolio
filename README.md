# Githinji Isaac Hamisi - Portfolio Website

Professional portfolio website for Electrical & Electronics Engineering student seeking industrial attachment opportunities.

---

## Quick Start

### Running Locally

```bash
cd /media/sf_Shared/portfolio
python3 -m http.server 8080
```

**Access at:** http://localhost:8080

**Pages:**
- **Main Portfolio**: http://localhost:8080/index.html
- **Beyond the Classroom**: http://localhost:8080/beyond-classroom.html
- **Admin Dashboard**: http://localhost:8080/command/login.html (requires authentication)

> **Note:** You must use an HTTP server (not file://) because Firebase Authentication requires a proper origin for security.

---

## Overview

A modern, responsive portfolio website featuring:
- **Main Portfolio** - Academic background, technical skills, projects, and professional experience
- **Beyond the Classroom** - Public showcase of extracurricular activities and leadership roles
- **Command Dashboard** - Secure admin panel for managing activities (Firebase authenticated)

**Purpose:** Present qualifications and experience to potential employers for 3-month industrial attachment (July-September 2026)

---

## Technology Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with custom properties, flexbox, grid
- **JavaScript (ES6+)** - Interactive features and animations

### Backend Services
- **Firebase Authentication** - Secure admin login
- **Firebase Firestore** - Database for activities
- **Cloudinary** - Image hosting and optimization (no Cloud Functions needed)

### Libraries
- **AOS (Animate On Scroll)** - Scroll-triggered animations
- **Font Awesome 6.5.1** - Icon library
- **Google Fonts (Inter)** - Typography

---

## Image Management Workflow

### Upload Process
1. **Client-Side Compression**
   - Images compressed to max 1MB using JavaScript canvas API
   - Maintains quality while reducing file size
   - Automatic aspect ratio preservation

2. **Cloudinary Upload**
   - Direct browser upload to Cloudinary API
   - No backend/Cloud Functions needed
   - Organized in folder: `portfolio/beyond-classroom/`
   - Returns secure HTTPS URLs

3. **Firestore Storage**
   - Only Cloudinary URLs stored in database
   - Lightweight document structure
   - Fast queries and real-time updates

### Deletion Process
**Manual deletion via Cloudinary console:**

When you delete an activity from the dashboard:
1. Activity removed from Firestore ✅
2. Console logs Cloudinary photo URLs
3. Follow printed instructions to delete from Cloudinary:
   - Visit https://console.cloudinary.com/console
   - Navigate to Media Library
   - Search folder: `portfolio/beyond-classroom`
   - Delete listed images manually

**Why manual?** Keeps architecture simple on Spark (free) plan - no Cloud Functions or Blaze plan upgrade needed.

---

## Cloudinary Configuration

### Current Setup
```javascript
// In js/firebase-config.js
CLOUDINARY_CLOUD_NAME: 'dnmp1jys0'
CLOUDINARY_UPLOAD_PRESET: 'portfolio-uploads'
CLOUDINARY_FOLDER: 'portfolio/beyond-classroom'
```

### Features
- ✅ **Free Tier:** 25GB storage + 25GB bandwidth/month
- ✅ **Direct Upload:** Browser → Cloudinary (no backend)
- ✅ **Automatic CDN:** Fast global image delivery
- ✅ **Secure URLs:** HTTPS by default

### Access
- **Dashboard:** https://console.cloudinary.com/console
- **Media Library:** View/manage all uploaded images
- **Usage Stats:** Monitor storage and bandwidth

### Maintenance
- Review uploaded images monthly
- Delete unused/test images to stay within free tier
- Console logs provide direct URLs for easy identification

---

## File Structure

```
portfolio/
├── index.html                      # Main portfolio page
├── beyond-classroom.html           # Public activities showcase
├── command/
│   ├── login.html                  # Admin login page
│   └── dashboard.html              # Admin dashboard
├── assets/
│   ├── icon.ico                    # Website favicon
│   ├── isaac-githinji-resume.pdf
│   ├── industrial-attachment-letter.pdf
│   └── images/
│       ├── profile-photo.jpg
│       └── projects/               # Project screenshots
├── css/
│   ├── style.css                   # Main portfolio styles
│   └── command.css                 # Admin dashboard styles
├── js/
│   ├── main.js                     # Main portfolio logic
│   ├── firebase-config.js          # Firebase & Cloudinary config
│   ├── command-auth.js             # Admin login logic
│   ├── command-dashboard.js        # Dashboard logic
│   └── beyond-classroom.js         # Public activities page logic
├── firebase.json                   # Firebase hosting config
├── .firebaserc                     # Firebase project config
├── firestore.rules                 # Database security rules
├── firestore.indexes.json          # Database indexes
└── README.md                       # This file
```

---

## Features

### Main Portfolio
- ✅ Fully responsive design (mobile-first approach)
- ✅ Dark theme with black & gold color scheme
- ✅ Smooth scroll navigation
- ✅ Animated sections with AOS
- ✅ Scroll progress indicator
- ✅ Professional resume and documents download

### Beyond the Classroom
- ✅ Public showcase of extracurricular activities
- ✅ Photo slideshow with auto-advance
- ✅ Responsive card layout
- ✅ Only displays published activities

### Command Dashboard
- ✅ Secure Firebase authentication
- ✅ Upload activities with multiple photos
- ✅ Image compression and Cloudinary hosting
- ✅ Publish/unpublish activities
- ✅ Edit and delete functionality (Firestore)
- ✅ Manual photo deletion via Cloudinary console (console logs provide URLs)
- ✅ Real-time statistics
- ✅ Upload progress indicator

---

## Design System

### Color Scheme: Black & Gold Theme

**Primary Colors:**
```css
--bg-primary: #0a0a0a        /* Deep black */
--bg-secondary: #1a1a1a      /* Dark grey */
--bg-tertiary: #2a2a2a       /* Medium grey */
```

**Accent Colors:**
```css
--accent-gold: #d4af37       /* Classic gold */
--gold-light: #f0d971        /* Bright gold */
--gold-dark: #b8941f         /* Darker gold */
```

**Text Colors:**
```css
--text-primary: #ffffff      /* White */
--text-secondary: #e0e0e0    /* Light grey */
```

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Font Weights:** 300, 400, 500, 600, 700, 800
- **Base Size:** 16px (1rem)

---

## Development

### Local Development

1. **Start the server:**
   ```bash
   python3 -m http.server 8080
   ```

2. **Open in browser:**
   - Main portfolio: http://localhost:8080/index.html
   - Activities: http://localhost:8080/beyond-classroom.html

3. **Admin access:**
   - Login: http://localhost:8080/command/login.html
   - Use credentials from Firebase Authentication

### Testing Authentication

1. Make sure you're accessing via HTTP (not file://)
2. Navigate to `/command/login.html`
3. Enter your Firebase admin credentials
4. You'll be redirected to the dashboard
5. Auth state persists across page refreshes

---

## Deployment

### Firebase Hosting (Production)

The site is deployed on Firebase Hosting:

**Live URL:** https://portfolio-44e4b.web.app

**Deploy updates:**
```bash
firebase deploy
```

**Deploy only hosting:**
```bash
firebase deploy --only hosting
```

### GitHub Pages (Alternative)

1. Push to GitHub repository
2. Go to Settings → Pages
3. Source: Deploy from branch (main)
4. Folder: / (root)
5. Save and wait for deployment

---

## Firebase Configuration

### Configuration Files in Root Directory

The following files are required for Firebase deployment and **must remain in the project root**:

- **firebase.json** (20 lines) - Firebase hosting configuration and Firestore references
- **.firebaserc** (5 lines) - Firebase project ID for CLI commands
- **firestore.rules** (26 lines) - **CRITICAL** Database security rules
- **firestore.indexes.json** (4 lines) - Firestore database indexes (required by Firebase CLI)
- **js/firebase-config.js** (59 lines) - Frontend Firebase initialization code

> ⚠️ **Important:** Do not move or delete these files. They enable `firebase deploy` and protect your database security.

### Services Configured
- **Authentication:** Email/Password enabled
- **Firestore Database:** `beyondClassroom` collection
- **Hosting:** Deployed at portfolio-44e4b.web.app

### Security Rules (firestore.rules)
The `firestore.rules` file contains critical security configurations:
- ✅ Public users can read **only published** activities
- ✅ Authenticated admins can read **all** activities
- ✅ Only authenticated admins can create, update, or delete activities
- ✅ All other collections are denied by default

**Never delete firestore.rules** - it protects your database from unauthorized access.

### Admin Access
Create admin users in [Firebase Console](https://console.firebase.google.com/project/portfolio-44e4b/authentication/users)

---

## Contact Information

**Name:** Githinji Isaac Hamisi
**Program:** Electrical & Electronics Engineering (4th Year)
**Institution:** University of Nairobi
**Email:** isaacgithinji003@gmail.com
**Phone:** (+254) 717 205 175
**GitHub:** [github.com/hamisi00](https://github.com/hamisi00)
**Software Portfolio:** [Hamster Innovations](https://hamisi00.github.io/hamster-innovations/)

**Seeking:** 3-month industrial attachment (July-September 2026)

---

## License

© 2026 Githinji Isaac Hamisi. All rights reserved.

This portfolio is for personal use and industrial attachment applications.

---

## Browser Compatibility

✅ **Fully Supported:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari 12.1+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Maintenance

### Regular Updates
- [x] Update year in footer (auto-generated via JavaScript)
- [x] Profile photo added
- [x] Firebase backend configured
- [ ] Update resume PDF as needed
- [ ] Add new projects/certifications as earned
- [ ] Add new activities via command dashboard

---

**Happy coding!** 🎉
