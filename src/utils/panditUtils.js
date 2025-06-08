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
    console.log(`[updatePandit] Starting with ID: ${id} (type: ${typeof id})`);
    
    if (!id) {
      console.error('[updatePandit] Invalid document ID for update:', id);
      throw new Error('Invalid document ID for update. ID cannot be empty.');
    }
    
    // First, try to find the document with a numeric ID field
    if (/^\d+$/.test(id)) {
      console.log(`[updatePandit] Numeric ID detected: ${id}. Searching for matching document.`);
      
      // Query for documents with a matching numeric ID field
      const q = query(panditsCollection, where("id", "==", parseInt(id)));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found a document with this numeric ID
        const docRef = querySnapshot.docs[0];
        const realDocId = docRef.id;
        console.log(`[updatePandit] Found document with numeric ID ${id}, using Firestore document ID: ${realDocId}`);
        
        // Update with the real document ID
        const realDocRef = doc(db, 'pandits', realDocId);
        
        // Clean data for update
        const cleanData = { ...panditData };
        
        // Remove any undefined values
        Object.keys(cleanData).forEach(key => {
          if (cleanData[key] === undefined) {
            delete cleanData[key];
          }
        });
        
        console.log(`[updatePandit] Updating document with data:`, cleanData);
        await updateDoc(realDocRef, cleanData);
        
        console.log(`[updatePandit] Successfully updated pandit with ID: ${realDocId}`);
        return {
          id: realDocId,
          ...panditData
        };
      } else {
        console.log(`[updatePandit] No document found with numeric ID: ${id}. Creating new document.`);
        // No document found, create a new one
        const newPandit = {
          ...panditData,
          id: parseInt(id) // Store the numeric ID in the document
        };
        
        console.log(`[updatePandit] Creating new pandit:`, newPandit);
        const docRef = await addDoc(panditsCollection, newPandit);
        
        console.log(`[updatePandit] Successfully created new pandit with ID: ${docRef.id}`);
        return {
          id: docRef.id,
          ...newPandit
        };
      }
    }
    
    // If it's not a numeric ID, proceed with regular update
    console.log(`[updatePandit] Updating document with ID: ${id}`);
    const docRef = doc(db, 'pandits', id);
    
    // Clean data for update
    const cleanData = { ...panditData };
    
    // Remove any undefined values
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined) {
        delete cleanData[key];
      }
    });
    
    console.log(`[updatePandit] Updating document with data:`, cleanData);
    await updateDoc(docRef, cleanData);
    
    console.log(`[updatePandit] Successfully updated pandit with ID: ${id}`);
    return {
      id,
      ...panditData
    };
  } catch (error) {
    console.error('[updatePandit] Error updating pandit:', error);
    throw error;
  }
};

// Delete a pandit
export const deletePandit = async (id) => {
  try {
    console.log(`[deletePandit] Starting with ID: ${id} (type: ${typeof id})`);
    
    if (!id) {
      console.error('[deletePandit] Invalid document ID for deletion:', id);
      throw new Error('Invalid document ID for deletion. ID cannot be empty.');
    }
    
    // First, try to find the document with a numeric ID field
    if (/^\d+$/.test(id)) {
      console.log(`[deletePandit] Numeric ID detected: ${id}. Searching for matching document.`);
      
      // Query for documents with a matching numeric ID field
      const q = query(panditsCollection, where("id", "==", parseInt(id)));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found a document with this numeric ID
        const docRef = querySnapshot.docs[0];
        const realDocId = docRef.id;
        console.log(`[deletePandit] Found document with numeric ID ${id}, using Firestore document ID: ${realDocId}`);
        
        // Delete with the real document ID
        const realDocRef = doc(db, 'pandits', realDocId);
        await deleteDoc(realDocRef);
        
        console.log(`[deletePandit] Successfully deleted pandit with ID: ${realDocId}`);
        return true;
      } else {
        console.log(`[deletePandit] No document found with numeric ID: ${id}.`);
        throw new Error(`No pandit found with ID: ${id}`);
      }
    }
    
    // If it's not a numeric ID, proceed with regular delete
    console.log(`[deletePandit] Deleting document with ID: ${id}`);
    const docRef = doc(db, 'pandits', id);
    await deleteDoc(docRef);
    
    console.log(`[deletePandit] Successfully deleted pandit with ID: ${id}`);
    return true;
  } catch (error) {
    console.error('[deletePandit] Error deleting pandit:', error);
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