// Beyond the Classroom - Public Page Logic - Compat SDK

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Load activities
    loadPublishedActivities();

    // Update current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
});

async function loadPublishedActivities() {
    const loadingDiv = document.getElementById('loadingActivities');
    const emptyDiv = document.getElementById('emptyActivities');
    const containerDiv = document.getElementById('activitiesContainer');

    // Check if Firestore is initialized
    if (!window.db) {
        console.error('Firestore not initialized');
        loadingDiv.style.display = 'none';
        emptyDiv.style.display = 'block';
        return;
    }

    try {
        const snapshot = await db.collection(window.BEYOND_CLASSROOM_COLLECTION)
            .where('published', '==', true)
            .orderBy('order', 'desc')
            .get();

        const activities = [];
        snapshot.forEach(doc => {
            activities.push({
                id: doc.id,
                ...doc.data()
            });
        });

        loadingDiv.style.display = 'none';

        if (activities.length === 0) {
            emptyDiv.style.display = 'block';
        } else {
            containerDiv.style.display = 'block';
            renderActivities(activities);
        }

    } catch (error) {
        console.error('Error loading activities:', error);
        loadingDiv.style.display = 'none';
        emptyDiv.style.display = 'block';
    }
}

function renderActivities(activities) {
    const container = document.getElementById('activitiesContainer');
    container.innerHTML = '';

    activities.forEach((activity, index) => {
        const activityCard = createActivityCard(activity, index);
        container.appendChild(activityCard);
    });
}

function createActivityCard(activity, index) {
    const article = document.createElement('article');
    article.className = 'activity-item';
    article.setAttribute('data-aos', 'fade-up');
    article.setAttribute('data-aos-delay', (index % 3) * 100);

    const photos = activity.photos || [];
    const slideshowId = `slideshow-${activity.id}`;

    article.innerHTML = `
        <div class="activity-content">
            <h3 class="activity-title">${activity.title}</h3>
            <p class="activity-description">${activity.description}</p>
        </div>
        <div class="activity-slideshow" id="${slideshowId}">
            ${photos.length > 0 ? createSlideshow(photos, slideshowId) : '<div class="slideshow-placeholder"><i class="fas fa-image"></i></div>'}
        </div>
    `;

    // Initialize slideshow if there are photos
    if (photos.length > 1) {
        setTimeout(() => {
            initializeSlideshow(slideshowId, photos.length);
        }, 100);
    }

    return article;
}

function createSlideshow(photos, slideshowId) {
    if (photos.length === 0) {
        return '<div class="slideshow-placeholder"><i class="fas fa-image"></i></div>';
    }

    if (photos.length === 1) {
        return `
            <div class="slideshow-single">
                <img src="${photos[0]}" alt="Activity photo" loading="lazy">
            </div>
        `;
    }

    const slidesHTML = photos.map((photo, index) => `
        <div class="slide ${index === 0 ? 'active' : ''}">
            <img src="${photo}" alt="Activity photo ${index + 1}" loading="lazy">
        </div>
    `).join('');

    const dotsHTML = photos.map((_, index) => `
        <span class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide('${slideshowId}', ${index})"></span>
    `).join('');

    return `
        <div class="slideshow-wrapper">
            <div class="slides-container">
                ${slidesHTML}
            </div>
            <button class="slide-btn prev" onclick="changeSlide('${slideshowId}', -1)">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="slide-btn next" onclick="changeSlide('${slideshowId}', 1)">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="slide-dots">
                ${dotsHTML}
            </div>
        </div>
    `;
}

// Slideshow management
const slideshows = {};

function initializeSlideshow(slideshowId, photoCount) {
    if (photoCount <= 1) return;

    slideshows[slideshowId] = {
        currentIndex: 0,
        totalSlides: photoCount,
        autoplayInterval: null,
        isPaused: false
    };

    startAutoplay(slideshowId);

    // Pause on hover
    const slideshowElement = document.getElementById(slideshowId);
    if (slideshowElement) {
        slideshowElement.addEventListener('mouseenter', () => {
            pauseAutoplay(slideshowId);
        });

        slideshowElement.addEventListener('mouseleave', () => {
            resumeAutoplay(slideshowId);
        });
    }
}

function changeSlide(slideshowId, direction) {
    const slideshow = slideshows[slideshowId];
    if (!slideshow) return;

    slideshow.currentIndex += direction;

    if (slideshow.currentIndex >= slideshow.totalSlides) {
        slideshow.currentIndex = 0;
    } else if (slideshow.currentIndex < 0) {
        slideshow.currentIndex = slideshow.totalSlides - 1;
    }

    updateSlideDisplay(slideshowId);
    resetAutoplay(slideshowId);
}

function goToSlide(slideshowId, index) {
    const slideshow = slideshows[slideshowId];
    if (!slideshow) return;

    slideshow.currentIndex = index;
    updateSlideDisplay(slideshowId);
    resetAutoplay(slideshowId);
}

function updateSlideDisplay(slideshowId) {
    const slideshow = slideshows[slideshowId];
    if (!slideshow) return;

    const element = document.getElementById(slideshowId);
    if (!element) return;

    const slides = element.querySelectorAll('.slide');
    const dots = element.querySelectorAll('.dot');

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === slideshow.currentIndex);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideshow.currentIndex);
    });
}

function startAutoplay(slideshowId) {
    const slideshow = slideshows[slideshowId];
    if (!slideshow || slideshow.autoplayInterval) return;

    slideshow.autoplayInterval = setInterval(() => {
        if (!slideshow.isPaused) {
            changeSlide(slideshowId, 1);
        }
    }, 4000); // Auto-advance every 4 seconds
}

function pauseAutoplay(slideshowId) {
    const slideshow = slideshows[slideshowId];
    if (!slideshow) return;

    slideshow.isPaused = true;
}

function resumeAutoplay(slideshowId) {
    const slideshow = slideshows[slideshowId];
    if (!slideshow) return;

    slideshow.isPaused = false;
}

function resetAutoplay(slideshowId) {
    const slideshow = slideshows[slideshowId];
    if (!slideshow) return;

    clearInterval(slideshow.autoplayInterval);
    slideshow.autoplayInterval = null;
    startAutoplay(slideshowId);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    Object.keys(slideshows).forEach(id => {
        const slideshow = slideshows[id];
        if (slideshow.autoplayInterval) {
            clearInterval(slideshow.autoplayInterval);
        }
    });
});

// Make slideshow functions available globally for onclick handlers
window.changeSlide = changeSlide;
window.goToSlide = goToSlide;
