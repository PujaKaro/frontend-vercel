import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  doc, 
  query, 
  where, 
  getDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection reference
export const panditsCollection = collection(db, 'pandits');

// Get all pandits
export const getAllPandits = async () => {
  try {
    const snapshot = await getDocs(panditsCollection);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      // Prevent ID collisions by preserving internal numeric ID as a separate field
      return {
        id: doc.id,
        ...(data.id ? { internalId: data.id } : {}), // preserve internal ID if it exists
        ...data
      };
    });
  } catch (error) {
    console.error('Error getting pandits:', error);
    throw error;
  }
};

// Get pandit by ID
export const getPanditById = async (id) => {
  try {
    const docRef = doc(db, 'pandits', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    // If not found directly, try to find by internal id field
    let querySnapshot = await getDocs(query(panditsCollection, where("id", "==", id)));
    
    // If not found, try with numeric id (in case id was passed as string but stored as number)
    if (querySnapshot.empty) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        querySnapshot = await getDocs(query(panditsCollection, where("id", "==", numericId)));
      }
    }
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting pandit:', error);
    throw error;
  }
};

// Add a new pandit
export const addPandit = async (panditData) => {
  try {
    const docRef = await addDoc(panditsCollection, panditData);
    return {
      id: docRef.id,
      ...panditData
    };
  } catch (error) {
    console.error('Error adding pandit:', error);
    throw error;
  }
};

// Update a pandit
export const updatePandit = async (id, panditData) => {
  try {
    const docRef = doc(db, 'pandits', id);
    await updateDoc(docRef, panditData);
    return {
      id,
      ...panditData
    };
  } catch (error) {
    console.error('Error updating pandit:', error);
    throw error;
  }
};

// Delete a pandit
export const deletePandit = async (id) => {
  try {
    const docRef = doc(db, 'pandits', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting pandit:', error);
    throw error;
  }
};

// Get featured pandits
export const getFeaturedPandits = async (limit = 6) => {
  try {
    // You might want to adjust this query based on your actual data structure
    // e.g., if you have a 'featured' field or if you want to sort by rating
    const q = query(
      panditsCollection,
      limit
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting featured pandits:', error);
    throw error;
  }
};

// Get pandits by specialization
export const getPanditsBySpecialization = async (specialization) => {
  try {
    const q = query(
      panditsCollection,
      where('specializations', 'array-contains', specialization)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting pandits by specialization:', error);
    throw error;
  }
};

// Search pandits
export const searchPandits = async (searchTerm) => {
  try {
    // Get all pandits (Firestore doesn't support direct text search)
    const snapshot = await getDocs(panditsCollection);
    const pandits = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter client-side
    const searchLower = searchTerm.toLowerCase();
    return pandits.filter(pandit => 
      pandit.name?.toLowerCase().includes(searchLower) ||
      pandit.description?.toLowerCase().includes(searchLower) ||
      pandit.location?.toLowerCase().includes(searchLower) ||
      (pandit.specializations && 
        pandit.specializations.some(spec => 
          spec.toLowerCase().includes(searchLower)
        ))
    );
  } catch (error) {
    console.error('Error searching pandits:', error);
    throw error;
  }
}; 