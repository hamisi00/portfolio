// Firebase Configuration - Compat SDK

const firebaseConfig = {
  apiKey: "AIzaSyBnfM3dV1V71GtqWECreDNLdXty3HmnToc",
  authDomain: "portfolio-44e4b.firebaseapp.com",
  projectId: "portfolio-44e4b",
  storageBucket: "portfolio-44e4b.firebasestorage.app",
  messagingSenderId: "887523917408",
  appId: "1:887523917408:web:3ae9b4af390a1eeb1e8d05",
  measurementId: "G-1MLZVQRKD1"
};

// Check if Firebase SDK is loaded
if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Make sure firebase-app-compat.js is loaded before this script.');
    throw new Error('Firebase SDK not found. Check script loading order.');
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
var auth = null;
var db = null;

if (typeof firebase.auth === 'function') {
    auth = firebase.auth();
    window.auth = auth;

    // Set auth persistence to LOCAL (uses indexedDB/localStorage)
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch((error) => {
        console.error('Auth persistence setup failed:', error);
    });
} else {
    console.warn('Firebase Auth not available - auth features disabled');
}

if (typeof firebase.firestore === 'function') {
    db = firebase.firestore();
    window.db = db;
} else {
    console.warn('Firebase Firestore not available - database features disabled');
}

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = 'dnmp1jys0';
const CLOUDINARY_UPLOAD_PRESET = 'portfolio-uploads';

// Collection name
const BEYOND_CLASSROOM_COLLECTION = 'beyondClassroom';

// Export for use in other scripts
window.firebaseApp = firebase;
window.CLOUDINARY_CONFIG = {
    cloudName: CLOUDINARY_CLOUD_NAME,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET
};
window.BEYOND_CLASSROOM_COLLECTION = BEYOND_CLASSROOM_COLLECTION;
