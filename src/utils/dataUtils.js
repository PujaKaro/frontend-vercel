import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  setDoc
} from 'firebase/firestore';
import { products, pujaServices, pandits } from '../data/data';

// Collection references
export const productsCollection = collection(db, 'products');
export const pujasCollection = collection(db, 'pujas');
export const panditsCollection = collection(db, 'pandits');

// Migration function to upload all data from static files to Firestore
export const migrateDataToFirestore = async () => {
  try {
    console.log('Starting data migration to Firestore...');
    
    // Check if data already exists to avoid duplicates
    const existingProducts = await getDocs(productsCollection);
    const existingPujas = await getDocs(pujasCollection);
    const existingPandits = await getDocs(panditsCollection);
    
    if (existingProducts.empty && existingPujas.empty && existingPandits.empty) {
      // Upload products
      console.log(`Uploading ${products.length} products...`);
      const productPromises = products.map(product => addDoc(productsCollection, product));
      await Promise.all(productPromises);
      console.log('Products uploaded successfully.');
      
      // Upload pujas
      console.log(`Uploading ${pujaServices.length} pujas...`);
      const pujaPromises = pujaServices.map(puja => addDoc(pujasCollection, puja));
      await Promise.all(pujaPromises);
      console.log('Pujas uploaded successfully.');
      
      // Upload pandits
      console.log(`Uploading ${pandits.length} pandits...`);
      const panditPromises = pandits.map(pandit => addDoc(panditsCollection, pandit));
      await Promise.all(panditPromises);
      console.log('Pandits uploaded successfully.');
      
      return { success: true, message: 'Data migration completed successfully' };
    } else {
      return { 
        success: false, 
        message: 'Some data already exists in Firestore. Migration skipped to avoid duplicates.' 
      };
    }
  } catch (error) {
    console.error('Error migrating data to Firestore:', error);
    return { success: false, message: `Migration failed: ${error.message}` };
  }
};

// CRUD operations for products
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    console.log(`Looking for product with ID: ${id}`);
    
    // First, try to find by document ID
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log(`Found product document with ID ${id} directly`);
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } 
    
    // If not found by document ID, search by the internal id field
    console.log(`Document with ID ${id} not found, searching by internal id field...`);
    const q = query(productsCollection, where("id", "==", id));
    
    // Try as number if the id looks like a number
    const numericId = !isNaN(id) ? parseInt(id) : null;
    let querySnapshot;
    
    if (numericId !== null) {
      console.log(`Trying to find product with numeric id field: ${numericId}`);
      querySnapshot = await getDocs(query(productsCollection, where("id", "==", numericId)));
      
      if (querySnapshot.empty) {
        console.log(`No document found with numeric id=${numericId}, trying with string id="${id}"`);
        querySnapshot = await getDocs(q);
      }
    } else {
      querySnapshot = await getDocs(q);
    }
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      console.log(`Found product via id field. Document ID: ${doc.id}, Internal id: ${doc.data().id}`);
      return {
        id: doc.id, // Using the Firestore document ID
        ...doc.data()
      };
    }
    
    console.log(`No product found with id=${id} (neither as document ID nor as internal field)`);
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(productsCollection, productData);
    return {
      id: docRef.id,
      ...productData
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productData);
    return {
      id,
      ...productData
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return { id };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// CRUD operations for pujas
export const getAllPujas = async () => {
  try {
    console.log('Retrieving pujas from Firestore collection:', pujasCollection.path);
    const snapshot = await getDocs(pujasCollection);
    console.log(`Firestore returned ${snapshot.docs.length} puja documents`);
    
    // Log all document IDs for debugging
    const documentIds = snapshot.docs.map(doc => doc.id);
    console.log('Document IDs in Firestore:', documentIds);
    
    const pujas = snapshot.docs.map(doc => {
      const data = doc.data();
      // Prevent ID collisions by preserving internal numeric ID as a separate field
      return {
        id: doc.id,
        ...(data.id ? { internalId: data.id } : {}), // preserve internal ID if it exists
        ...data
      };
    });
    
    console.log('Mapped puja data:', pujas);
    return pujas;
  } catch (error) {
    console.error('Error getting pujas:', error);
    throw error;
  }
};

export const getPujaById = async (id) => {
  try {
    console.log(`Looking for puja with ID: ${id}`);
    
    // First, try to find by document ID
    const docRef = doc(db, 'pujas', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log(`Found puja document with ID ${id} directly`);
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } 
    
    // If not found by document ID, search by the internal id field
    console.log(`Document with ID ${id} not found, searching by internal id field...`);
    const q = query(pujasCollection, where("id", "==", id));
    
    // Try as number if the id looks like a number
    const numericId = !isNaN(id) ? parseInt(id) : null;
    let querySnapshot;
    
    if (numericId !== null) {
      console.log(`Trying to find puja with numeric id field: ${numericId}`);
      querySnapshot = await getDocs(query(pujasCollection, where("id", "==", numericId)));
      
      if (querySnapshot.empty) {
        console.log(`No document found with numeric id=${numericId}, trying with string id="${id}"`);
        querySnapshot = await getDocs(q);
      }
    } else {
      querySnapshot = await getDocs(q);
    }
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      console.log(`Found puja via id field. Document ID: ${doc.id}, Internal id: ${doc.data().id}`);
      return {
        id: doc.id, // Using the Firestore document ID
        ...doc.data()
      };
    }
    
    console.log(`No puja found with id=${id} (neither as document ID nor as internal field)`);
    return null;
  } catch (error) {
    console.error('Error getting puja:', error);
    throw error;
  }
};

export const addPuja = async (pujaData) => {
  try {
    // Just add the document with all fields (including id if present)
    const docRef = await addDoc(pujasCollection, pujaData);
    return {
      id: docRef.id,
      ...pujaData
    };
  } catch (error) {
    console.error('Error adding puja:', error);
    throw error;
  }
};

export const updatePuja = async (id, pujaData) => {
  try {
    console.log('Updating puja with ID:', id, 'Type:', typeof id);
    
    // Convert ID to string if it's not already
    const stringId = String(id);
    
    // Create a new object omitting the id to avoid Firebase errors
    const { id: docId, ...dataToUpdate } = pujaData;
    
    // First, try to find the document with the exact ID
    const docRef = doc(db, 'pujas', stringId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Document exists with the exact ID, update it
      console.log(`Document with ID ${stringId} found. Updating...`);
      await updateDoc(docRef, dataToUpdate);
      console.log('Document updated successfully.');
      return { id: stringId, ...dataToUpdate };
    } else {
      // Document with exact ID doesn't exist, try to find by internal ID
      console.log(`Document with ID ${stringId} not found. Attempting to find by name...`);
      
      // Query Firestore to find the document with matching name (or other unique identifier)
      const q = query(pujasCollection, where("name", "==", pujaData.name));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found a document with matching name
        const firestoreDoc = querySnapshot.docs[0];
        const firestoreId = firestoreDoc.id;
        
        console.log(`Found document with name "${pujaData.name}" - Firestore ID: ${firestoreId}`);
        
        // Update the document using its actual Firestore ID
        const actualDocRef = doc(db, 'pujas', firestoreId);
        await updateDoc(actualDocRef, dataToUpdate);
        
        console.log('Document updated successfully using matched Firestore ID.');
        return { id: firestoreId, ...dataToUpdate };
      } else {
        // No document found with this name either
        console.error(`Error: No document found with ID ${stringId} or name "${pujaData.name}"`);
        throw new Error(`Cannot update puja: No document found with ID ${stringId} or name "${pujaData.name}"`);
      }
    }
  } catch (error) {
    console.error('Error updating puja:', error);
    throw error;
  }
};

export const deletePuja = async (id) => {
  try {
    console.log('Deleting puja with ID:', id, 'Type:', typeof id);
    
    // Convert ID to string if it's not already
    const stringId = String(id);
    
    try {
      // Try to delete the document
      const docRef = doc(db, 'pujas', stringId);
      await deleteDoc(docRef);
      console.log('Document deleted successfully');
      return { id: stringId };
    } catch (error) {
      // If the document doesn't exist, just return success
      if (error.message && error.message.includes('No document to delete')) {
        console.log(`Document with ID ${stringId} doesn't exist, considering delete successful`);
        return { id: stringId };
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting puja:', error);
    throw error;
  }
};

// Functions for getting suggested products and pujas
export const getSuggestedProducts = async (productId, limit = 3) => {
  try {
    // Get the product
    const product = await getProductById(productId);
    
    if (!product) return [];
    
    // Query products in the same category
    const q = query(
      productsCollection,
      where('category', '==', product.category),
      limit(limit + 1)  // +1 in case we need to filter out the current product
    );
    
    const snapshot = await getDocs(q);
    let suggestedProducts = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item => item.id !== productId);
    
    // If not enough products in the same category, add random products
    if (suggestedProducts.length < limit) {
      const remainingLimit = limit - suggestedProducts.length;
      const allProductsSnapshot = await getDocs(productsCollection);
      const allProducts = allProductsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filter out current product and already suggested products
      const otherProducts = allProducts.filter(
        item => item.id !== productId && !suggestedProducts.some(p => p.id === item.id)
      );
      
      // Randomly select remaining products
      const randomIndices = Array.from({ length: otherProducts.length }, (_, i) => i)
        .sort(() => 0.5 - Math.random())
        .slice(0, remainingLimit);
      
      randomIndices.forEach(index => {
        if (index < otherProducts.length) {
          suggestedProducts.push(otherProducts[index]);
        }
      });
    }
    
    return suggestedProducts.slice(0, limit);
  } catch (error) {
    console.error('Error getting suggested products:', error);
    throw error;
  }
};

export const getSuggestedPujas = async (pujaIdOrCategory, limitValue = 3) => {
  try {
    const isId = !isNaN(pujaIdOrCategory) || pujaIdOrCategory.length < 30;
    
    if (isId) {
      // Get the puja - this will use the improved getPujaById which checks both document ID and internal id field
      const puja = await getPujaById(pujaIdOrCategory);
      
      if (!puja) return [];
      
      // Query pujas in the same category
      const categoryQuery = query(
        pujasCollection,
        where('category', '==', puja.category),
        limit(limitValue + 1)  // +1 in case we need to filter out the current puja
      );
      
      const snapshot = await getDocs(categoryQuery);
      let suggestedPujas = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => {
          // Filter out the current puja - check both document ID and internal id field
          if (item.id === puja.id) return false;
          if (item.id === pujaIdOrCategory) return false;
          if (item.id === parseInt(pujaIdOrCategory)) return false;
          return true;
        });
      
      // If not enough pujas in the same category, add random pujas
      if (suggestedPujas.length < limitValue) {
        const remainingLimit = limitValue - suggestedPujas.length;
        const allPujasSnapshot = await getDocs(pujasCollection);
        const allPujas = allPujasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter out current puja and already suggested pujas
        const otherPujas = allPujas.filter(item => {
          // Skip if it's the current puja (by document ID)
          if (item.id === puja.id) return false;
          
          // Skip if it's the current puja (by internal id field)
          if (item.id === pujaIdOrCategory) return false;
          if (item.id === parseInt(pujaIdOrCategory)) return false;
          
          // Skip if it's already in suggested pujas
          if (suggestedPujas.some(p => p.id === item.id)) return false;
          
          return true;
        });
        
        // Randomly select remaining pujas
        const randomIndices = Array.from({ length: otherPujas.length }, (_, i) => i)
          .sort(() => 0.5 - Math.random())
          .slice(0, remainingLimit);
        
        randomIndices.forEach(index => {
          if (index < otherPujas.length) {
            suggestedPujas.push(otherPujas[index]);
          }
        });
      }
      
      return suggestedPujas.slice(0, limitValue);
    } else {
      // Query pujas in the specified category
      const categoryQuery = query(
        pujasCollection,
        where('category', '==', pujaIdOrCategory),
        limit(limitValue)
      );
      
      const snapshot = await getDocs(categoryQuery);
      let categoryPujas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // If not enough pujas in the category, add random pujas
      if (categoryPujas.length < limitValue) {
        const remainingLimit = limitValue - categoryPujas.length;
        const allPujasSnapshot = await getDocs(pujasCollection);
        const allPujas = allPujasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filter out already suggested pujas
        const otherPujas = allPujas.filter(
          item => !categoryPujas.some(p => p.id === item.id)
        );
        
        // Randomly select remaining pujas
        const randomIndices = Array.from({ length: otherPujas.length }, (_, i) => i)
          .sort(() => 0.5 - Math.random())
          .slice(0, remainingLimit);
        
        randomIndices.forEach(index => {
          if (index < otherPujas.length) {
            categoryPujas.push(otherPujas[index]);
          }
        });
      }
      
      return categoryPujas.slice(0, limitValue);
    }
  } catch (error) {
    console.error('Error getting suggested pujas:', error);
    throw error;
  }
};

// CRUD operations for pandits
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

export const getPanditById = async (id) => {
  try {
    const docRef = doc(db, 'pandits', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting pandit:', error);
    throw error;
  }
}; 