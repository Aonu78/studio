'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, memoryLocalCache, type Firestore } from 'firebase/firestore'

type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

let firebaseServices: FirebaseServices | null = null;

// This function is the single source of truth for Firebase initialization.
function getFirebaseServices(): FirebaseServices {
  if (firebaseServices) {
    return firebaseServices;
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  
  // We are now also caching the firestore instance to prevent re-initialization
  const db = initializeFirestore(app, {
    localCache: memoryLocalCache(),
  });
  
  const auth = getAuth(app);
  
  firebaseServices = {
    firebaseApp: app,
    auth: auth,
    firestore: db
  };

  return firebaseServices;
}


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  // We always get the services from our singleton provider function.
  return getFirebaseServices();
}

export * from './provider';
export * from './client-provider';
export * from './non-blocking-login';
