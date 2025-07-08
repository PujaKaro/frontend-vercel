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

// Function to clean up existing products with empty id fields
export const cleanupExistingProducts = async () => {
  try {
    console.log('Cleaning up existing products with empty id fields...');
    const snapshot = await getDocs(productsCollection);
    let updatedCount = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      // If the document has an empty id field, set it to the product name
      if (data.id === '' || data.id === null || data.id === undefined) {
        console.log(`Cleaning up product: ${doc.id} - ${data.name}`);
        
        // Create a clean name-based ID from the product name
        let cleanId = '';
        if (data.name) {
          // Convert name to a URL-friendly ID
          cleanId = data.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .trim('-'); // Remove leading/trailing hyphens
        }
        
        // If no name or empty after cleaning, use a fallback
        if (!cleanId) {
          cleanId = `product-${doc.id}`;
        }
        
        // Update the document with the new ID
        const updatedData = {
          ...data,
          id: cleanId
        };
        
        await updateDoc(doc.ref, updatedData);
        updatedCount++;
        console.log(`Updated product "${data.name}" with ID: ${cleanId}`);
      }
    }
    
    console.log(`Cleaned up ${updatedCount} products`);
    return { success: true, updatedCount };
  } catch (error) {
    console.error('Error cleaning up products:', error);
    return { success: false, error: error.message };
  }
};

// CRUD operations for products
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        firestoreId: doc.id, // Store the actual Firestore document ID
        id: data.id || doc.id, // Use custom ID if available, otherwise use Firestore ID
        ...data
      };
    });
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
        id: doc.id, // Using the Firestore document ID for routing
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
    // If the product has a custom ID, check if it already exists
    if (productData.id && productData.id.trim() !== '') {
      console.log(`[addProduct] Custom ID detected: ${productData.id}. Checking if product exists.`);
      
      // Query for documents with a matching custom ID field
      const q = query(productsCollection, where("id", "==", productData.id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log(`[addProduct] Product with custom ID ${productData.id} already exists.`);
        throw new Error(`Product with ID ${productData.id} already exists.`);
      }
    }
    
    const docRef = await addDoc(productsCollection, productData);
    return {
      id: docRef.id, // Return Firestore document ID for routing
      ...productData
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    // If the product has a custom ID, check if it already exists
    if (productData.id && productData.id.trim() !== '') {
      console.log(`[updateProduct] Custom ID detected: ${productData.id}. Checking if product exists.`);
      
      // Query for documents with a matching custom ID field
      const q = query(productsCollection, where("id", "==", productData.id));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found a document with this custom ID
        const docRef = querySnapshot.docs[0];
        const realDocId = docRef.id;
        console.log(`[updateProduct] Found document with custom ID ${productData.id}, using Firestore document ID: ${realDocId}`);
        
        // Update with the real document ID
        const realDocRef = doc(db, 'products', realDocId);
        await updateDoc(realDocRef, productData);
        
        return {
          id: realDocId,
          ...productData
        };
      } else {
        console.log(`[updateProduct] No document found with custom ID: ${productData.id}. Creating new document.`);
        // No document found, create a new one
        const newProduct = {
          ...productData,
          id: productData.id // Store the custom ID in the document
        };
        
        const docRef = await addDoc(productsCollection, newProduct);
        
        return {
          id: docRef.id,
          ...newProduct
        };
      }
    }
    
    // If it's not a custom ID, proceed with regular update using Firestore document ID
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
    console.log('Updating puja with ID:', id);
    
    // First, try to find the document by its Firestore ID
    const docRef = doc(db, 'pujas', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Remove id field from data to avoid errors
      const { id: docId, ...dataToUpdate } = pujaData;
      
      // Update the document
      await updateDoc(docRef, dataToUpdate);
      console.log('Document updated successfully');
      return { id, ...dataToUpdate };
    } else {
      // If not found by Firestore ID, try to find by internal ID
      console.log(`Document with ID ${id} not found, searching by internal ID...`);
      
      // Get all pujas to examine their structure (only in case of error)
      const allPujasSnapshot = await getDocs(pujasCollection);
      console.log(`Total pujas in collection: ${allPujasSnapshot.docs.length}`);
      
      // Try as both string and number since we don't know how it's stored
      const numericId = !isNaN(id) ? Number(id) : null;
      const stringId = String(id);
      
      // Log potential matches to debug
      const potentialMatches = [];
      allPujasSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (
          (data.id !== undefined && (data.id === numericId || data.id === stringId)) ||
          (data.internalId !== undefined && (data.internalId === numericId || data.internalId === stringId))
        ) {
          potentialMatches.push({
            docId: doc.id,
            data: { id: data.id, internalId: data.internalId, name: data.name }
          });
        }
      });
      
      // Log potential matches for debugging
      if (potentialMatches.length > 0) {
        console.log('Found potential matches:', potentialMatches);
      } else {
        console.log('No potential matches found for ID', id);
        
        // Log a sample of documents to see their structure
        console.log('Sample document structure:', 
          allPujasSnapshot.docs.slice(0, 3).map(doc => ({
            id: doc.id,
            data: {
              id: doc.data().id,
              internalId: doc.data().internalId,
              name: doc.data().name
            }
          }))
        );
      }
      
      // First, try a direct query for internal ID as number
      let querySnapshot = null;
      if (numericId !== null) {
        const q = query(pujasCollection, where("id", "==", numericId));
        querySnapshot = await getDocs(q);
        console.log(`Query for numeric id=${numericId} returned ${querySnapshot.docs.length} results`);
      }
      
      // If that didn't work, try as string
      if (!querySnapshot || querySnapshot.empty) {
        const q = query(pujasCollection, where("id", "==", stringId));
        querySnapshot = await getDocs(q);
        console.log(`Query for string id="${stringId}" returned ${querySnapshot.docs.length} results`);
      }
      
      // Try by internalId field as well
      if (!querySnapshot || querySnapshot.empty) {
        if (numericId !== null) {
          const q = query(pujasCollection, where("internalId", "==", numericId));
          querySnapshot = await getDocs(q);
          console.log(`Query for numeric internalId=${numericId} returned ${querySnapshot.docs.length} results`);
        }
        
        if (!querySnapshot || querySnapshot.empty) {
          const q = query(pujasCollection, where("internalId", "==", stringId));
          querySnapshot = await getDocs(q);
          console.log(`Query for string internalId="${stringId}" returned ${querySnapshot.docs.length} results`);
        }
      }
      
      // If still not found but we have potential matches from our scan, use the first one
      if ((!querySnapshot || querySnapshot.empty) && potentialMatches.length > 0) {
        console.log('Using potential match found during scan');
        const firestoreId = potentialMatches[0].docId;
        
        // Remove id field from data to avoid errors
        const { id: docId, ...dataToUpdate } = pujaData;
        
        // Update the document
        const actualDocRef = doc(db, 'pujas', firestoreId);
        await updateDoc(actualDocRef, dataToUpdate);
        
        console.log('Document updated successfully using scan match');
        return { id: firestoreId, ...dataToUpdate };
      }
      
      // If we found results through queries
      if (querySnapshot && !querySnapshot.empty) {
        // Found the document by internal ID
        const firestoreDoc = querySnapshot.docs[0];
        const firestoreId = firestoreDoc.id;
        
        // Remove id field from data to avoid errors
        const { id: docId, ...dataToUpdate } = pujaData;
        
        // Update the document
        const actualDocRef = doc(db, 'pujas', firestoreId);
        await updateDoc(actualDocRef, dataToUpdate);
        
        console.log('Document updated successfully using internal ID match');
        return { id: firestoreId, ...dataToUpdate };
      } else {
        throw new Error(`Cannot update puja: Document with ID ${id} not found`);
      }
    }
  } catch (error) {
    console.error('Error updating puja:', error);
    throw error;
  }
};

export const deletePuja = async (id) => {
  try {
    console.log('Deleting puja with ID:', id);
    
    // Make sure id is a valid string for Firestore
    // Firebase document IDs cannot be numbers or objects
    const docId = String(id);
    
    // First, try to delete by Firestore document ID
    try {
      const docRef = doc(db, 'pujas', docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Delete the document
        await deleteDoc(docRef);
        console.log('Document deleted successfully');
        return { id: docId };
      } else {
        // If not found by Firestore ID, try to find by internal ID
        console.log(`Document with ID ${docId} not found, searching by internal ID...`);
        
        // Get all pujas to examine their structure
        const allPujasSnapshot = await getDocs(pujasCollection);
        console.log(`Total pujas in collection: ${allPujasSnapshot.docs.length}`);
        
        // Try as both string and number since we don't know how it's stored
        const numericId = !isNaN(id) ? Number(id) : null;
        const stringId = String(id);
        
        // Log potential matches to debug
        const potentialMatches = [];
        allPujasSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (
            (data.id !== undefined && (data.id === numericId || data.id === stringId)) ||
            (data.internalId !== undefined && (data.internalId === numericId || data.internalId === stringId))
          ) {
            potentialMatches.push({
              docId: doc.id,
              data: { id: data.id, internalId: data.internalId, name: data.name }
            });
          }
        });
        
        // Log potential matches for debugging
        if (potentialMatches.length > 0) {
          console.log('Found potential matches:', potentialMatches);
        } else {
          console.log('No potential matches found for ID', docId);
          
          // Log a sample of documents to see their structure
          console.log('Sample document structure:', 
            allPujasSnapshot.docs.slice(0, 3).map(doc => ({
              id: doc.id,
              data: {
                id: doc.data().id,
                internalId: doc.data().internalId,
                name: doc.data().name
              }
            }))
          );
        }
        
        // First, try a direct query for internal ID as number
        let querySnapshot = null;
        if (numericId !== null) {
          const q = query(pujasCollection, where("id", "==", numericId));
          querySnapshot = await getDocs(q);
          console.log(`Query for numeric id=${numericId} returned ${querySnapshot.docs.length} results`);
        }
        
        // If that didn't work, try as string
        if (!querySnapshot || querySnapshot.empty) {
          const q = query(pujasCollection, where("id", "==", stringId));
          querySnapshot = await getDocs(q);
          console.log(`Query for string id="${stringId}" returned ${querySnapshot.docs.length} results`);
        }
        
        // Try by internalId field as well
        if (!querySnapshot || querySnapshot.empty) {
          if (numericId !== null) {
            const q = query(pujasCollection, where("internalId", "==", numericId));
            querySnapshot = await getDocs(q);
            console.log(`Query for numeric internalId=${numericId} returned ${querySnapshot.docs.length} results`);
          }
          
          if (!querySnapshot || querySnapshot.empty) {
            const q = query(pujasCollection, where("internalId", "==", stringId));
            querySnapshot = await getDocs(q);
            console.log(`Query for string internalId="${stringId}" returned ${querySnapshot.docs.length} results`);
          }
        }
        
        // If still not found but we have potential matches from our scan, use the first one
        if ((!querySnapshot || querySnapshot.empty) && potentialMatches.length > 0) {
          console.log('Using potential match found during scan');
          const firestoreId = potentialMatches[0].docId;
          
          // Delete the document
          const actualDocRef = doc(db, 'pujas', firestoreId);
          await deleteDoc(actualDocRef);
          
          console.log('Document deleted successfully using scan match');
          return { id: firestoreId };
        }
        
        // If we found results through queries
        if (querySnapshot && !querySnapshot.empty) {
          // Found the document by internal ID
          const firestoreDoc = querySnapshot.docs[0];
          const firestoreId = firestoreDoc.id;
          
          // Delete the document
          const actualDocRef = doc(db, 'pujas', firestoreId);
          await deleteDoc(actualDocRef);
          
          console.log('Document deleted successfully using internal ID match');
          return { id: firestoreId };
        } else {
          console.log(`No document found with ID ${docId}, nothing to delete`);
          return { id: docId, deleted: false };
        }
      }
    } catch (error) {
      console.error('Error in document operation:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting puja:', error);
    throw error;
  }
};

// Functions for getting suggested products and pujas
export const getSuggestedProducts = async (productId, limitValue = 3) => {
  try {
    // Get the product
    const product = await getProductById(productId);
    
    if (!product) return [];
    
    // Query products in the same category
    const q = query(
      productsCollection,
      where('category', '==', product.category),
      limit(limitValue + 1)  // +1 in case we need to filter out the current product
    );
    
    const snapshot = await getDocs(q);
    let suggestedProducts = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item => item.id !== productId);
    
    // If not enough products in the same category, add random products
    if (suggestedProducts.length < limitValue) {
      const remainingLimit = limitValue - suggestedProducts.length;
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
    
    return suggestedProducts.slice(0, limitValue);
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