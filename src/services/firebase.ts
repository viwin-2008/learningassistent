import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { UserProfile } from '../types';

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if valid Firebase credentials exist
const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: any = null;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn("Firebase initialization skipped or failed. Fallback guest mode active.", err);
  }
}

export { auth, db, isFirebaseConfigured };

// Guest storage keys
const LOCAL_STORAGE_USER_KEY = 'edugenie_user';

export const getStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  }
};

// Login Helper
export const loginGuestUser = (name: string, email: string): UserProfile => {
  const guestUser: UserProfile = {
    uid: 'guest_' + Date.now(),
    displayName: name || 'Student Guest',
    email: email || 'student@edugenie.ai',
    isGuest: true
  };
  setStoredUser(guestUser);
  return guestUser;
};
