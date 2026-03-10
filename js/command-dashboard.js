// Command Dashboard Logic - Compat SDK

let currentUser = null;
let uploadedPhotos = [];
let currentFilter = 'all';

/**
 * Get current authenticated user
 * Uses onAuthStateChanged to check authentication state
 */
function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        });
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    const loadingOverlay = document.getElementById('authLoadingOverlay');
    const dashboardHeader = document.getElementById('dashboardHeader');
    const dashboardContent = document.getElementById('dashboardContent');

    try {
        // Check authentication
        const user = await getCurrentUser();

        if (!user) {
            // Not logged in, redirect to login page
            window.location.href = 'login.html';
            return;
        }

        // User is authenticated, initialize dashboard
        currentUser = user;

        // Hide loading overlay and show dashboard
        loadingOverlay.style.display = 'none';
        dashboardHeader.style.display = 'block';
        dashboardContent.style.display = 'block';

        initializeDashboard();
    } catch (error) {
        console.error('Error during auth check:', error);
        window.location.href = 'login.html';
    }

    // Logout button
    document.getElementById('logoutButton').addEventListener('click', async () => {
        if (confirm('Are you sure you want to logout?')) {
            await auth.signOut();
            window.location.href = 'login.html';
        }
    });

    // Toggle upload form
    document.getElementById('toggleFormBtn').addEventListener('click', toggleForm);

    // Photo upload area click
    document.getElementById('photoUploadArea').addEventListener('click', () => {
        document.getElementById('photoInput').click();
    });

    // Photo input change
    document.getElementById('photoInput').addEventListener('change', handlePhotoSelection);

    // Form submission
    document.getElementById('uploadForm').addEventListener('submit', handleFormSubmit);

    // Reset form
    document.getElementById('resetFormBtn').addEventListener('click', resetForm);

    // Character counters
    document.getElementById('activityTitle').addEventListener('input', updateCharCount);
    document.getElementById('activityDescription').addEventListener('input', updateCharCount);

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            loadActivities();
        });
    });

    // Edit modal
    document.getElementById('closeModal').addEventListener('click', closeEditModal);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
});

function toggleForm() {
    const form = document.getElementById('uploadForm');
    const btn = document.getElementById('toggleFormBtn');
    const isHidden = form.style.display === 'none';

    form.style.display = isHidden ? 'block' : 'none';
    btn.classList.toggle('active', isHidden);
}

function updateCharCount(e) {
    const input = e.target;
    const countId = input.id === 'activityTitle' ? 'titleCount' : 'descCount';
    document.getElementById(countId).textContent = input.value.length;
}

function handlePhotoSelection(e) {
    const files = Array.from(e.target.files);

    files.forEach(file => {
        // Validate file
        if (!file.type.startsWith('image/')) {
            showError('Please select only image files.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError(`File ${file.name} is too large. Maximum size is 5MB.`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedPhotos.push({
                file: file,
                dataUrl: e.target.result
            });
            renderPhotoPreview();
        };
        reader.readAsDataURL(file);
    });
}

function renderPhotoPreview() {
    const container = document.getElementById('photoPreviewContainer');
    container.innerHTML = '';

    uploadedPhotos.forEach((photo, index) => {
        const preview = document.createElement('div');
        preview.className = 'photo-preview';
        preview.innerHTML = `
            <img src="${photo.dataUrl}" alt="Preview ${index + 1}">
            <button type="button" class="remove-photo" onclick="removePhoto(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(preview);
    });
}

function removePhoto(index) {
    uploadedPhotos.splice(index, 1);
    renderPhotoPreview();
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('activityTitle').value.trim();
    const description = document.getElementById('activityDescription').value.trim();
    const submitBtn = document.getElementById('submitBtn');

    // Validation
    if (!title || !description) {
        showError('Please fill in all required fields.');
        return;
    }

    if (uploadedPhotos.length === 0) {
        showError('Please upload at least one photo.');
        return;
    }

    submitBtn.disabled = true;

    try {
        // Upload photos to Cloudinary
        const urls = await uploadPhotosToCloudinary(uploadedPhotos);

        // Save to Firestore
        await db.collection(window.BEYOND_CLASSROOM_COLLECTION).add({
            title: title,
            description: description,
            photos: urls,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            published: false,
            order: Date.now() // For ordering
        });

        showSuccess('Activity added successfully!');
        resetForm();
        loadActivities();

    } catch (error) {
        console.error('Error adding activity:', error);
        showError('Failed to add activity: ' + error.message);
    } finally {
        submitBtn.disabled = false;
    }
}

async function uploadPhotosToCloudinary(photos) {
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    uploadProgress.style.display = 'block';

    const urls = [];
    const total = photos.length;

    for (let i = 0; i < total; i++) {
        const photo = photos[i];

        try {
            // Compress image
            const compressedBlob = await compressImage(photo.file);

            // Create form data for Cloudinary upload
            const formData = new FormData();
            formData.append('file', compressedBlob, photo.file.name);
            formData.append('upload_preset', window.CLOUDINARY_CONFIG.uploadPreset);
            formData.append('folder', 'portfolio/beyond-classroom');

            // Upload to Cloudinary
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${window.CLOUDINARY_CONFIG.cloudName}/image/upload`;

            const response = await fetch(cloudinaryUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Cloudinary upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            urls.push(data.secure_url);

            // Update progress
            const progress = Math.round(((i + 1) / total) * 100);
            progressFill.style.width = progress + '%';
            progressText.textContent = `${progress}%`;

        } catch (error) {
            console.error('Error uploading photo:', error);
            throw new Error(`Failed to upload ${photo.file.name}: ${error.message}`);
        }
    }

    uploadProgress.style.display = 'none';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';

    return urls;
}

async function compressImage(file, maxSizeMB = 1) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Scale down if necessary
                const maxDimension = 1920;
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height *= maxDimension / width;
                        width = maxDimension;
                    } else {
                        width *= maxDimension / height;
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        resolve(blob);
                    },
                    'image/jpeg',
                    0.85
                );
            };

            img.onerror = reject;
        };

        reader.onerror = reject;
    });
}

function resetForm() {
    document.getElementById('uploadForm').reset();
    uploadedPhotos = [];
    renderPhotoPreview();
    document.getElementById('titleCount').textContent = '0';
    document.getElementById('descCount').textContent = '0';
    hideMessages();
}

function initializeDashboard() {
    loadActivities();
}

async function loadActivities() {
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const activitiesGrid = document.getElementById('activitiesGrid');

    loadingState.style.display = 'block';
    emptyState.style.display = 'none';
    activitiesGrid.style.display = 'none';

    try {
        const snapshot = await db.collection(window.BEYOND_CLASSROOM_COLLECTION)
            .orderBy('order', 'asc')
            .get();

        const activities = [];
        snapshot.forEach(doc => {
            activities.push({
                id: doc.id,
                ...doc.data()
            });
        });

        loadingState.style.display = 'none';

        if (activities.length === 0) {
            emptyState.style.display = 'block';
        } else {
            renderActivities(activities);
            updateStats(activities);
        }

    } catch (error) {
        console.error('Error loading activities:', error);
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
    }
}

function renderActivities(activities) {
    // Filter activities
    let filtered = activities;
    if (currentFilter === 'published') {
        filtered = activities.filter(a => a.published);
    } else if (currentFilter === 'unpublished') {
        filtered = activities.filter(a => !a.published);
    }

    const grid = document.getElementById('activitiesGrid');
    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="no-results">No activities found for this filter.</p>';
        grid.style.display = 'block';
        return;
    }

    filtered.forEach(activity => {
        const card = createActivityCard(activity);
        grid.appendChild(card);
    });

    grid.style.display = 'grid';
}

function createActivityCard(activity) {
    const div = document.createElement('div');
    div.className = 'activity-card';

    const thumbnail = activity.photos && activity.photos.length > 0
        ? activity.photos[0]
        : 'assets/placeholder.jpg';

    div.innerHTML = `
        <div class="activity-thumbnail">
            <img src="${thumbnail}" alt="${activity.title}">
            <div class="photo-count">
                <i class="fas fa-images"></i> ${activity.photos ? activity.photos.length : 0}
            </div>
        </div>
        <div class="activity-details">
            <h3 class="activity-card-title">${activity.title}</h3>
            <p class="activity-card-description">${activity.description}</p>
            <div class="activity-status ${activity.published ? 'published' : 'unpublished'}">
                <i class="fas ${activity.published ? 'fa-eye' : 'fa-eye-slash'}"></i>
                ${activity.published ? 'Published' : 'Unpublished'}
            </div>
        </div>
        <div class="activity-actions">
            <button class="btn-action btn-edit" onclick="openEditModal('${activity.id}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-action btn-toggle" onclick="togglePublish('${activity.id}', ${activity.published})">
                <i class="fas ${activity.published ? 'fa-eye-slash' : 'fa-eye'}"></i>
                ${activity.published ? 'Unpublish' : 'Publish'}
            </button>
            <button class="btn-action btn-delete" onclick="deleteActivity('${activity.id}')">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;

    return div;
}

function updateStats(activities) {
    const total = activities.length;
    const published = activities.filter(a => a.published).length;
    const unpublished = total - published;
    const totalPhotos = activities.reduce((sum, a) => sum + (a.photos ? a.photos.length : 0), 0);

    document.getElementById('totalCount').textContent = total;
    document.getElementById('publishedCount').textContent = published;
    document.getElementById('unpublishedCount').textContent = unpublished;
    document.getElementById('photoCount').textContent = totalPhotos;
}

async function togglePublish(id, currentStatus) {
    try {
        await db.collection(window.BEYOND_CLASSROOM_COLLECTION).doc(id).update({
            published: !currentStatus
        });

        showSuccess(`Activity ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
        loadActivities();

    } catch (error) {
        console.error('Error toggling publish status:', error);
        showError('Failed to update activity: ' + error.message);
    }
}

/**
 * Log Cloudinary photo URLs for manual deletion
 * @param {string[]} photoUrls - Array of Cloudinary URLs
 */
function logCloudinaryPhotosForDeletion(photoUrls) {
    if (!photoUrls || photoUrls.length === 0) {
        return;
    }

    console.log('\n=== Cloudinary Photos to Delete Manually ===');
    console.log(`Total photos: ${photoUrls.length}`);
    console.log('\nTo delete these photos:');
    console.log('1. Go to https://console.cloudinary.com/console');
    console.log('2. Navigate to Media Library');
    console.log('3. Search for folder: portfolio/beyond-classroom');
    console.log('4. Delete the following images:\n');

    photoUrls.forEach((url, index) => {
        // Extract filename from URL for easier identification
        const parts = url.split('/');
        const filename = parts[parts.length - 1];
        console.log(`   ${index + 1}. ${filename}`);
        console.log(`      URL: ${url}`);
    });

    console.log('\n=============================================\n');
}

async function deleteActivity(id) {
    if (!confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
        return;
    }

    try {
        // 1. Get the activity document to retrieve photo URLs
        const doc = await db.collection(window.BEYOND_CLASSROOM_COLLECTION).doc(id).get();

        if (!doc.exists) {
            showError('Activity not found.');
            return;
        }

        const data = doc.data();
        const photoUrls = data.photos || [];

        // 2. Log Cloudinary photos for manual deletion
        if (photoUrls.length > 0) {
            logCloudinaryPhotosForDeletion(photoUrls);
        }

        // 3. Delete Firestore document
        await db.collection(window.BEYOND_CLASSROOM_COLLECTION).doc(id).delete();

        showSuccess('Activity deleted successfully! Check console for Cloudinary photo deletion instructions.');
        loadActivities();

    } catch (error) {
        console.error('Error deleting activity:', error);
        showError('Failed to delete activity: ' + error.message);
    }
}

function openEditModal(id) {
    db.collection(window.BEYOND_CLASSROOM_COLLECTION).doc(id).get()
        .then(doc => {
            if (!doc.exists) {
                showError('Activity not found.');
                return;
            }

            const data = doc.data();
            document.getElementById('editActivityId').value = id;
            document.getElementById('editTitle').value = data.title;
            document.getElementById('editDescription').value = data.description;

            document.getElementById('editModal').classList.add('active');
        })
        .catch(error => {
            console.error('Error loading activity:', error);
            showError('Failed to load activity: ' + error.message);
        });
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    document.getElementById('editForm').reset();
}

async function handleEditSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('editActivityId').value;
    const title = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();

    if (!title || !description) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        await db.collection(window.BEYOND_CLASSROOM_COLLECTION).doc(id).update({
            title: title,
            description: description
        });

        showSuccess('Activity updated successfully!');
        closeEditModal();
        loadActivities();

    } catch (error) {
        console.error('Error updating activity:', error);
        alert('Failed to update activity: ' + error.message);
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('uploadSuccess');
    const successText = document.getElementById('uploadSuccessText');

    successText.textContent = message;
    successDiv.style.display = 'flex';

    setTimeout(() => {
        successDiv.style.display = 'none';
    }, 5000);
}

function showError(message) {
    const errorDiv = document.getElementById('uploadError');
    const errorText = document.getElementById('uploadErrorText');

    errorText.textContent = message;
    errorDiv.style.display = 'flex';

    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function hideMessages() {
    document.getElementById('uploadSuccess').style.display = 'none';
    document.getElementById('uploadError').style.display = 'none';
}

// Make functions globally accessible
window.removePhoto = removePhoto;
window.togglePublish = togglePublish;
window.deleteActivity = deleteActivity;
window.openEditModal = openEditModal;
