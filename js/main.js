// ============================================
// NAVIGATION
// ============================================

const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');

// Create backdrop element
let navBackdrop = document.querySelector('.nav-backdrop');
if (!navBackdrop) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
}

// Navigation toggle with responsive detection
navToggle.addEventListener('click', () => {
    const isDesktop = window.innerWidth >= 1025;

    if (isDesktop) {
        // Desktop: toggle expanded class
        navbar.classList.toggle('expanded');
        navToggle.classList.toggle('active');
    } else {
        // Mobile/Tablet: toggle drawer
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
        navBackdrop.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    }
});

// Close mobile menu when clicking on backdrop
navBackdrop.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navBackdrop.classList.remove('active');
    document.body.style.overflow = '';
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const isDesktop = window.innerWidth >= 1025;

        if (isDesktop) {
            navbar.classList.remove('expanded');
            navToggle.classList.remove('active');
        } else {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Clean up states on window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const isDesktop = window.innerWidth >= 1025;

        if (isDesktop) {
            // Clean up mobile states
            navMenu.classList.remove('open');
            navBackdrop.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            // Clean up desktop states
            navbar.classList.remove('expanded');
        }

        // Reset toggle button
        navToggle.classList.remove('active');
    }, 250);
});

// Navbar scroll effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Toggle scrolled class for enhanced shadow and opacity
    if (currentScroll > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Active link highlighting
function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            link?.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightActiveLink);

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS (AOS)
// ============================================

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100,
        delay: 100
    });
});

// ============================================
// SCROLL REVEAL ANIMATIONS (Additional polish)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements WITHOUT data-aos attributes (avoid conflict)
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.project-card:not([data-aos]), .skill-category:not([data-aos]), .timeline-item:not([data-aos]), .cert-card:not([data-aos])'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ============================================
// TYPING EFFECT FOR HERO
// ============================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Optional: Uncomment to enable typing effect on hero subtitle
// document.addEventListener('DOMContentLoaded', () => {
//     const heroSubtitle = document.querySelector('.hero-subtitle');
//     const originalText = heroSubtitle.textContent;
//     typeWriter(heroSubtitle, originalText, 50);
// });

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    // Create progress bar if it doesn't exist
    let progressBar = document.getElementById('scrollProgress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'scrollProgress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(135deg, #d4af37, #f0d971);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }

    progressBar.style.width = scrolled + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ============================================
// SKILL TAGS ANIMATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const skillTags = document.querySelectorAll('.skill-tag');

    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.05}s`;
        tag.style.animation = 'fadeInUp 0.5s ease forwards';
    });
});

// Add fadeInUp animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// PROJECT CARDS HOVER EFFECT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy load images when they come into view
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// ============================================
// SCROLL TO TOP BUTTON (Optional)
// ============================================

function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.id = 'scrollToTop';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #d4af37, #f0d971);
        border: none;
        color: #000000;
        font-size: 1.25rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 998;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(scrollBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTopButton);

// ============================================
// CONTACT FORM VALIDATION (if needed)
// ============================================

// Add this if you later add a contact form
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// CURSOR EFFECT (Optional Enhancement)
// ============================================

function createCursorEffect() {
    const cursor = document.createElement('div');
    cursor.id = 'customCursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #d4af37;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;

    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.display = 'block';
    });

    // Scale cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#f0d971';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#d4af37';
        });
    });
}

// Uncomment to enable custom cursor (desktop only)
// if (window.innerWidth > 1024) {
//     document.addEventListener('DOMContentLoaded', createCursorEffect);
// }

// ============================================
// ANIMATED BORDER LIGHT
// ============================================

// Animate the golden light traveling around navbar border
function animateBorderLight() {
    let angle = 0;

    function updateAngle() {
        angle = (angle + 1) % 360;
        navbar.style.setProperty('--angle', `${angle}deg`);
        requestAnimationFrame(updateAngle);
    }

    updateAngle();
}

// Start border animation
animateBorderLight();

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c👨‍💻 Githinji Isaac Hamisi', 'font-size: 20px; font-weight: bold; color: #d4af37;');
console.log('%cElectrical & Electronics Engineering Student', 'font-size: 14px; color: #f0d971;');
console.log('%cUniversity of Nairobi | Fourth Year', 'font-size: 12px; color: #b8941f;');
console.log('%c📧 isaacgithinji003@gmail.com', 'font-size: 12px; color: #d4af37;');

// ============================================
// INITIALIZE ALL FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded successfully! ✨');

    // Set dynamic year in footer
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');

    // Preload critical assets
    const criticalAssets = [
        'assets/cv.pdf',
        // Add more critical assets here
    ];

    // Optional: Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    });
});

// ============================================
// SCROLL INDICATOR - HIDE NEAR BOTTOM
// ============================================

const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    function updateScrollIndicator() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

        // Hide when user has scrolled 80% of the page
        if (scrollPercent > 80) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
        }
    }

    window.addEventListener('scroll', updateScrollIndicator);
    // Initial check
    updateScrollIndicator();
}
