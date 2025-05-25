import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAvdGVXFzqU-DrAi3Sw223qyscDuYjKbG0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vahta1-76378.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vahta1-76378",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vahta1-76378.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1037943763154",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1037943763154:web:0e2a2dffc1de4d7279bd0b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DVYZFE1PN7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
