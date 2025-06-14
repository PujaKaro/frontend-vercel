import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection reference
export const panditServicesCollection = collection(db, 'panditServices');

// Get all pandit services
export const getPanditServices = async () => {
  try {
    console.log('[getPanditServices] Fetching all pandit services');
    const snapshot = await getDocs(panditServicesCollection);
    const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`[getPanditServices] Found ${services.length} pandit services`);
    return services;
  } catch (error) {
    console.error('[getPanditServices] Error getting pandit services:', error);
    throw error;
  }
};

// Get a pandit service by ID
export const getPanditServiceById = async (id) => {
  try {
    console.log(`[getPanditServiceById] Fetching pandit service with ID: ${id}`);
    
    // First, check if it's a numeric ID
    if (/^\d+$/.test(id)) {
      console.log(`[getPanditServiceById] Numeric ID detected: ${id}. Searching for matching document.`);
      
      // Query for documents with a matching numeric ID field
      const q = query(panditServicesCollection, where("id", "==", parseInt(id)));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found a document with this numeric ID
        const docData = querySnapshot.docs[0].data();
        const result = { id: querySnapshot.docs[0].id, ...docData };
        console.log(`[getPanditServiceById] Found pandit service:`, result);
        return result;
      }
      
      console.log(`[getPanditServiceById] No pandit service found with numeric ID: ${id}`);
      return null;
    }
    
    // If it's not a numeric ID, use regular document reference
    const docRef = doc(db, 'panditServices', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const result = { id: docSnap.id, ...docSnap.data() };
      console.log(`[getPanditServiceById] Found pandit service:`, result);
      return result;
    }
    
    console.log(`[getPanditServiceById] No pandit service found with ID: ${id}`);
    return null;
  } catch (error) {
    console.error('[getPanditServiceById] Error getting pandit service:', error);
    throw error;
  }
};

// Add a pandit service
export const addPanditService = async (serviceData) => {
  try {
    console.log('[addPanditService] Adding new pandit service:', serviceData);
    const docRef = await addDoc(panditServicesCollection, serviceData);
    const result = { id: docRef.id, ...serviceData };
    console.log('[addPanditService] Successfully added pandit service:', result);
    return result;
  } catch (error) {
    console.error('[addPanditService] Error adding pandit service:', error);
    throw error;
  }
};

// Update a pandit service
export const updatePanditService = async (id, serviceData) => {
  try {
    console.log(`[updatePanditService] Starting with ID: ${id} (type: ${typeof id})`);
    
    if (!id) {
      console.error('[updatePanditService] Invalid document ID for update:', id);
      throw new Error('Invalid document ID for update. ID cannot be empty.');
    }
    
    // First, try to find the document with a numeric ID field
    if (/^\d+$/.test(id)) {
      console.log(`[updatePanditService] Numeric ID detected: ${id}. Searching for matching document.`);
      
      // Query for documents with a matching numeric ID field
      const q = query(panditServicesCollection, where("id", "==", parseInt(id)));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found a document with this numeric ID
        const docRef = querySnapshot.docs[0];
        const realDocId = docRef.id;
        console.log(`[updatePanditService] Found document with numeric ID ${id}, using Firestore document ID: ${realDocId}`);
        
        // Update with the real document ID
        const realDocRef = doc(db, 'panditServices', realDocId);
        
        // Clean data for update
        const cleanData = { ...serviceData };
        
        // Remove any undefined values
        Object.keys(cleanData).forEach(key => {
          if (cleanData[key] === undefined) {
            delete cleanData[key];
          }
        });
        
        console.log(`[updatePanditService] Updating document with data:`, cleanData);
        await updateDoc(realDocRef, cleanData);
        
        console.log(`[updatePanditService] Successfully updated pandit service with ID: ${realDocId}`);
        return {
          id: realDocId,
          ...serviceData
        };
      } else {
        console.log(`[updatePanditService] No document found with numeric ID: ${id}. Creating new document.`);
        // No document found, create a new one
        const newService = {
          ...serviceData,
          id: parseInt(id) // Store the numeric ID in the document
        };
        
        console.log(`[updatePanditService] Creating new pandit service:`, newService);
        const docRef = await addDoc(panditServicesCollection, newService);
        
        console.log(`[updatePanditService] Successfully created new pandit service with ID: ${docRef.id}`);
        return {
          id: docRef.id,
          ...newService
        };
      }
    }
    
    // If it's not a numeric ID, proceed with regular update
    console.log(`[updatePanditService] Updating document with ID: ${id}`);
    const docRef = doc(db, 'panditServices', id);
    
    // Clean data for update
    const cleanData = { ...serviceData };
    
    // Remove any undefined values
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined) {
        delete cleanData[key];
      }
    });
    
    console.log(`[updatePanditService] Updating document with data:`, cleanData);
    await updateDoc(docRef, cleanData);
    
    console.log(`[updatePanditService] Successfully updated pandit service with ID: ${id}`);
    return {
      id,
      ...serviceData
    };
  } catch (error) {
    console.error('[updatePanditService] Error updating pandit service:', error);
    throw error;
  }
};

// Delete a pandit service
export const deletePanditService = async (id) => {
  try {
    console.log(`[deletePanditService] Starting with ID: ${id} (type: ${typeof id})`);
    
    if (!id) {
      console.error('[deletePanditService] Invalid document ID for deletion:', id);
      throw new Error('Invalid document ID for deletion. ID cannot be empty.');
    }
    
    // First, try to find the document with a numeric ID field
    if (/^\d+$/.test(id)) {
      console.log(`[deletePanditService] Numeric ID detected: ${id}. Searching for matching document.`);
      
      // Query for documents with a matching numeric ID field
      const q = query(panditServicesCollection, where("id", "==", parseInt(id)));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found a document with this numeric ID
        const docRef = querySnapshot.docs[0];
        const realDocId = docRef.id;
        console.log(`[deletePanditService] Found document with numeric ID ${id}, using Firestore document ID: ${realDocId}`);
        
        // Delete with the real document ID
        const realDocRef = doc(db, 'panditServices', realDocId);
        await deleteDoc(realDocRef);
        
        console.log(`[deletePanditService] Successfully deleted pandit service with ID: ${realDocId}`);
        return true;
      } else {
        console.log(`[deletePanditService] No document found with numeric ID: ${id}.`);
        throw new Error(`No pandit service found with ID: ${id}`);
      }
    }
    
    // If it's not a numeric ID, proceed with regular delete
    console.log(`[deletePanditService] Deleting document with ID: ${id}`);
    const docRef = doc(db, 'panditServices', id);
    await deleteDoc(docRef);
    
    console.log(`[deletePanditService] Successfully deleted pandit service with ID: ${id}`);
    return true;
  } catch (error) {
    console.error('[deletePanditService] Error deleting pandit service:', error);
    throw error;
  }
}; 