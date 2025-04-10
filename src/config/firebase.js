import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

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
