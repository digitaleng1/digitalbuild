/**
 * Firebase Configuration
 * Single source of truth for Firebase settings
 */

export const firebaseConfig = {
  apiKey: "AIzaSyAmQJlJO2fIJpUi0EOxMsIAaYY3CszqgyA",
  authDomain: "test-notificator.firebaseapp.com",
  projectId: "test-notificator",
  storageBucket: "test-notificator.firebasestorage.app",
  messagingSenderId: "856141206152",
  appId: "1:856141206152:web:188688de2537173fe6053d",
  measurementId: "G-33YG9DBVL3"
};

export const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';
