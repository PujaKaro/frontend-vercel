import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Collection references
export const blogsCollection = collection(db, 'blogs');

// Blog schema
/*
blogs: {
  id: string,
  title: string,
  slug: string,
  content: string,
  excerpt: string,
  coverImage: string,
  author: {
    name: string,
    image: string
  },
  categories: string[],
  tags: string[],
  publishedAt: timestamp,
  updatedAt: timestamp,
  readTime: number,
  featured: boolean
}
*/

export default app;
