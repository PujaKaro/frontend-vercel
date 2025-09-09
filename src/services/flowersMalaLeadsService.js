import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Save lead data to Firebase
export const saveLead = async (leadData) => {
  const docRef = await addDoc(collection(db, 'flowers_mala_leads'), {
    ...leadData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};