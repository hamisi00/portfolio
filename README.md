# Githinji Isaac Hamisi - Portfolio Website

Professional portfolio website for Electrical & Electronics Engineering student seeking industrial attachment opportunities.

---

## Overview

A modern, responsive single-page portfolio website showcasing academic background, technical skills, projects, and professional experience. Designed specifically for industrial attachment applications with emphasis on power systems, control systems, and circuit design expertise.

**Purpose:** Present qualifications and experience to potential employers for 3-month industrial attachment (July-September 2026)

---

## Technology Stack

### Core Technologies
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with custom properties, flexbox, grid
- **JavaScript (ES6+)** - Interactive features and animations

### Libraries & Frameworks
- **AOS (Animate On Scroll)** - Scroll-triggered animations
- **Font Awesome 6.5.1** - Icon library
- **Google Fonts (Inter)** - Typography

### Features
- Fully responsive design (mobile-first approach)
- Dark theme with black & gold color scheme
- Smooth scroll navigation
- Animated hamburger menu with drawer (mobile) and expandable nav (desktop)
- Animated golden border light effect
- Scroll progress indicator
- Lazy loading optimization

---

## File Structure

```
portfolio/
├── home.html                 # Main HTML file (entry point)
├── assets/
│   ├── icon.ico             # Website favicon
│   ├── isaac-githinji-resume.pdf
│   ├── industrial-attachment-letter.pdf
│   └── images/              # Image assets folder
│       ├── profile.jpg      # (To be added) Professional photo
│       └── projects/        # (To be added) Project screenshots
├── css/
│   └── style.css            # Main stylesheet (1500+ lines)
├── js/
│   └── main.js              # Main JavaScript file (460+ lines)
└── README.md                # This file
```

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

### Spacing Scale
```css
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 1.5rem    /* 24px */
--spacing-xl: 2rem      /* 32px */
--spacing-2xl: 3rem     /* 48px */
--spacing-3xl: 4rem     /* 64px */
```

---

## Image Asset Guidelines

### Naming Conventions

**Use kebab-case (lowercase-with-hyphens)** for all file names:

✅ **Good:**
- `profile-photo.jpg`
- `solar-project-thumbnail.png`
- `power-supply-circuit.jpg`

❌ **Bad:**
- `Profile Photo.jpg` (spaces)
- `SolarProjectThumbnail.png` (PascalCase)
- `power_supply_circuit.jpg` (snake_case)

### Directory Structure

```
assets/images/
├── profile.jpg                          # Professional headshot (500×500px)
├── profile-placeholder.svg              # Temporary placeholder
├── projects/
│   ├── solar-energy-analysis.jpg        # Solar PV project
│   ├── power-supply-circuit.jpg         # Dual-output power supply
│   ├── noise-detection-system.jpg       # Smart noise monitoring
│   ├── residential-wiring.jpg           # Electrical installation
│   ├── led-matrix-display.jpg           # 8×8 LED matrix
│   └── calculator-cpp.jpg               # C++ calculator
└── icons/
    └── skills/                          # Custom skill icons (optional)
```

### Image Specifications

#### Profile Photo
- **Dimensions:** Any square ratio (1:1 recommended)
- **Format:** JPG or PNG
- **Size:** < 200KB (optimized recommended)
- **Content:** Clear, well-lit photo
- **Note:** Currently using profile-photo.jpg in assets/images/

#### Project Images
- **Dimensions:** 1200×675px (16:9 ratio)
- **Format:** JPG or PNG
- **Size:** < 200KB each
- **Content:** Clear, well-lit photos of projects
- **Quality:** High resolution, sharp focus

#### Icons
- **Format:** SVG (vector) preferred, PNG fallback
- **Size:** 48×48px or 64×64px
- **Style:** Consistent with gold theme

### Optimization Tips
1. **Compress images** before uploading (use TinyPNG, ImageOptim)
2. **Use WebP format** for modern browsers (with JPG fallback)
3. **Lazy load** images below the fold
4. **Provide alt text** for accessibility

---

## Navigation System

### Desktop (≥1025px)
- **Collapsed:** 80px wide navbar with centered hamburger icon
- **Expanded:** Full-width navbar with horizontal menu
- **Animation:** 3-second theatrical expansion with 3D flip (405° rotation)
- **Logo:** Hidden when collapsed, appears on expansion

### Mobile/Tablet (≤1024px)
- **Type:** Left-sliding drawer menu
- **Width:** 280px (max 75vw)
- **Animation:** 0.8s smooth slide-in
- **Backdrop:** Solid dark overlay (70% opacity, no blur)
- **Menu Items:** Sequential fade-in with 0.2s increments

### Toggle Button
- **Desktop:** 30×30px, moves with navbar expansion
- **Mobile:** 40×40px (larger for touch), gold glow when active
- **Animation:** 405° rotation (desktop), 45° rotation (mobile)

---

## Sections

1. **Hero** - Name, title, quick links, stats
2. **About** - Professional summary, key expertise areas
3. **Education** - Academic timeline
4. **Skills** - Technical expertise (4 categories)
5. **Projects** - Academic projects organized by year
6. **Certifications** - IEEE membership, certificates
7. **Contact** - Email, phone, GitHub, portfolio link
8. **Referees** - Professional references

---

## Key Features

### Animations
- **Scroll Reveal:** AOS library for fade-in effects
- **Hover Effects:** Scale, glow, color transitions
- **Golden Border Light:** Clockwise-traveling light animation
- **Scroll Progress:** Top progress bar indicator
- **Skill Tags:** Staggered fade-in animation

### Interactions
- **Smooth Scrolling:** To section anchors
- **Active Link Highlighting:** Based on scroll position
- **Mobile Menu:** Backdrop closes drawer on click
- **Scroll to Top Button:** Appears after 300px scroll

### Performance
- **Lazy Loading:** Images load on scroll into viewport
- **Debounced Scroll:** Optimized event handlers
- **CSS Transitions:** Hardware-accelerated transforms
- **Minimal Dependencies:** Only essential libraries

---

## Browser Compatibility

✅ **Fully Supported:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari 12.1+ (conic-gradient support)
- Mobile browsers (iOS Safari, Chrome Mobile)

⚠️ **Partial Support:**
- Internet Explorer 11 (no CSS custom properties)

---

## Deployment

### Local Development
1. Open `home.html` directly in browser
2. No build process required
3. All dependencies loaded via CDN

### GitHub Pages
1. Push to GitHub repository
2. Go to Settings → Pages
3. Source: Deploy from branch (main)
4. Folder: / (root)
5. Save and wait for deployment

### Custom Domain (Optional)
1. Add `CNAME` file with domain name
2. Configure DNS records:
   - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or CNAME: `<username>.github.io`

---

## Adding Content

### Adding a Project
Edit `home.html` around line 265-365:

```html
<div class="project-card" data-aos="fade-up">
    <div class="project-image-placeholder">
        <i class="fas fa-icon-name"></i>
    </div>
    <div class="project-content">
        <h4>Project Title</h4>
        <p>Project description...</p>
        <div class="project-tags">
            <span class="tag">Tag 1</span>
            <span class="tag">Tag 2</span>
        </div>
    </div>
</div>
```

### Adding a Skill
Edit `home.html` around line 193-249:

```html
<div class="skill-category" data-aos="fade-up">
    <div class="category-header">
        <i class="fas fa-icon-name"></i>
        <h3>Category Name</h3>
    </div>
    <div class="skill-items">
        <span class="skill-tag">Skill Name</span>
    </div>
</div>
```

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

## Maintenance Notes

### Regular Updates
- [ ] Update year in footer (auto-generated via JavaScript)
- [x] Profile photo added at `assets/images/profile-photo.jpg`
- [ ] Add project screenshots to `assets/images/projects/`
- [ ] Update resume PDF as needed
- [ ] Add new projects/certifications as earned

### Future Enhancements
- [ ] Add project detail modal overlays
- [ ] Implement contact form with backend
- [ ] Add testimonials section
- [ ] Create project case studies
- [ ] Add blog/articles section (optional)

---

**Last Updated:** February 23, 2026
**Version:** 1.0.0
**Status:** Ready for deployment
