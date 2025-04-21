/**
 * FIREBASE CONFIGURATION
 *
 * This file initializes Firebase and sets up the core services:
 * - Authentication (auth)
 * - Cloud Storage (storage)
 * - Firestore Database (database)
 *
 * The Firebase config values are loaded from environment variables.
 * This ensures sensitive data like API keys aren't hardcoded.
 *
 */

import { initializeApp } from "firebase/app";
import { initializeAuth, inMemoryPersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: inMemoryPersistence,
});
export const storage = getStorage(app);
export const db = getFirestore(app);
