import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// EXPLICIT ACCESS IS REQUIRED FOR BUNDLERS
// We check import.meta.env first (Vite), then process.env (Standard/Webpack), then fallback
// @ts-ignore
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env?.[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }
  return undefined;
};

const apiKey = getEnv('VITE_FIREBASE_API_KEY') || getEnv('FIREBASE_API_KEY');
const authDomain = getEnv('VITE_FIREBASE_AUTH_DOMAIN') || getEnv('FIREBASE_AUTH_DOMAIN');
const projectId = getEnv('VITE_FIREBASE_PROJECT_ID') || getEnv('FIREBASE_PROJECT_ID');
const storageBucket = getEnv('VITE_FIREBASE_STORAGE_BUCKET') || getEnv('FIREBASE_STORAGE_BUCKET');
const messagingSenderId = getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID') || getEnv('FIREBASE_MESSAGING_SENDER_ID');
const appId = getEnv('VITE_FIREBASE_APP_ID') || getEnv('FIREBASE_APP_ID');

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};

let app = null;
let auth = null;
let db = null;

try {
  if (apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } else {
    console.warn("Firebase configuration missing. Check your .env file.");
  }
} catch (error) {
  console.error("Firebase init error", error);
}

export { auth, db };