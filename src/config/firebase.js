import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMcgysXBf8RoGlcqmxcyaaJchrQnIngbs",
  authDomain: "pujakaro-aaadc.firebaseapp.com",
  projectId: "pujakaro-aaadc",
  storageBucket: "pujakaro-aaadc.firebasestorage.app",
  messagingSenderId: "890234110086",
  appId: "1:890234110086:web:c99d5438da1b3fc5025107",
  measurementId: "G-2V4L3RVNZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
