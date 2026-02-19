// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe-ahf9bd4vLyikc9xNuikxi70fUy_tIA",
  authDomain: "fintwitch-2e2a0.firebaseapp.com",
  projectId: "fintwitch-2e2a0",
  storageBucket: "fintwitch-2e2a0.firebasestorage.app",
  messagingSenderId: "1073440564184",
  appId: "1:1073440564184:web:8a1d51827fb430e1d208ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Connect Firestore + Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enforce Persistence (Keep user logged in)
import { setPersistence, browserLocalPersistence } from "firebase/auth";
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Persistence error:", err);
});