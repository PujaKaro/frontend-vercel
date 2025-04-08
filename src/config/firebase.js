import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgnSPZSlR_pwb7JOcGlxwBaHXnL5DaIF8",
    authDomain: "pujakaro-b8209.firebaseapp.com",
    projectId: "pujakaro-b8209",
    storageBucket: "pujakaro-b8209.firebasestorage.app",
    messagingSenderId: "271339673701",
    appId: "1:271339673701:web:7df65f716ee03c51ee0e8c",
    measurementId: "G-YF3JJ7Z2G1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;