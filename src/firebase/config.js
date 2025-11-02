// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGC4wLk1n1r6aeVhTdTSGPaZWsP5fVHYc",
  authDomain: "labrynth-bbf88.firebaseapp.com",
  projectId: "labrynth-bbf88",
  storageBucket: "labrynth-bbf88.firebasestorage.app",
  messagingSenderId: "61094037653",
  appId: "1:61094037653:web:587f6f0624317de8f8739c",
  measurementId: "G-LJ6C7TL410"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Auth
export const auth = getAuth(app);

export { app, analytics };
export default app;

