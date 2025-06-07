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
export const productsCollection = collection(db, 'products');

// Get all products
export const getAllProducts = async () => {
  try {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    console.log(`Looking for product with ID: ${id}`);
    
    // First try to get the document directly using the ID
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log(`Found product document with ID ${id} directly`);
      return { id: docSnap.id, ...docSnap.data() };
    }
    
    // If not found directly, try to find by internal id field
    let querySnapshot = await getDocs(query(productsCollection, where("id", "==", id)));
    
    // If not found, try with numeric id (in case id was passed as string but stored as number)
    if (querySnapshot.empty) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        console.log(`Trying to find product with numeric id field: ${numericId}`);
        querySnapshot = await getDocs(query(productsCollection, where("id", "==", numericId)));
      }
    }
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      console.log(`Found product via id field. Document ID: ${doc.id}, Internal id: ${doc.data().id}`);
      return { id: doc.id, ...doc.data() };
    }
    
    console.log(`No product found with id=${id} (neither as document ID nor as internal field)`);
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Add a product
export const addProduct = async (productData) => {
  try {
    console.log('[addProduct] Adding new product:', productData);
    
    // If the product has a numeric ID, check if it already exists
    if (productData.id && /^\d+$/.test(productData.id)) {
      console.log(`[addProduct] Numeric ID detected: ${productData.id}. Checking if product exists.`);
      
      // Query for documents with a matching numeric ID field
      const q = query(productsCollection, where("id", "==", parseInt(productData.id)));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        console.log(`[addProduct] Product with numeric ID ${productData.id} already exists.`);
        throw new Error(`Product with ID ${productData.id} already exists.`);
      }
    }
    
    // Clean data for add
    const cleanData = { ...productData };
    
    // Remove any undefined values
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined) {
        delete cleanData[key];
      }
    });
    
    console.log('[addProduct] Adding product with cleaned data:', cleanData);
    const docRef = await addDoc(productsCollection, cleanData);
    
    console.log(`[addProduct] Successfully added product with ID: ${docRef.id}`);
    return {
      id: docRef.id,
      ...cleanData
    };
  } catch (error) {
    console.error('[addProduct] Error adding product:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (id, productData) => {
  try {
    console.log(`[updateProduct] Starting with ID: ${id} (type: ${typeof id})`);
    console.log('[updateProduct] Product data:', productData);
    
    if (!id) {
      console.error('[updateProduct] Invalid document ID for update:', id);
      throw new Error('Invalid document ID for update. ID cannot be empty.');
    }
    
    // First, try to find the document with a numeric ID field
    if (/^\d+$/.test(id)) {
      console.log(`[updateProduct] Numeric ID detected: ${id}. Searching for matching document.`);
      
      // Query for documents with a matching numeric ID field
      const q = query(productsCollection, where("id", "==", parseInt(id)));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found a document with this numeric ID
        const docRef = querySnapshot.docs[0];
        const realDocId = docRef.id;
        console.log(`[updateProduct] Found document with numeric ID ${id}, using Firestore document ID: ${realDocId}`);
        
        // Update with the real document ID
        const realDocRef = doc(db, 'products', realDocId);
        
        // Clean data for update
        const cleanData = { ...productData };
        
        // Remove any undefined values
        Object.keys(cleanData).forEach(key => {
          if (cleanData[key] === undefined) {
            delete cleanData[key];
          }
        });
        
        console.log(`[updateProduct] Updating document with data:`, cleanData);
        await updateDoc(realDocRef, cleanData);
        
        console.log(`[updateProduct] Successfully updated product with ID: ${realDocId}`);
        return {
          id: realDocId,
          ...productData
        };
      } else {
        console.log(`[updateProduct] No document found with numeric ID: ${id}. Creating new document.`);
        // No document found, create a new one
        const newProduct = {
          ...productData,
          id: parseInt(id) // Store the numeric ID in the document
        };
        
        console.log(`[updateProduct] Creating new product:`, newProduct);
        const docRef = await addDoc(productsCollection, newProduct);
        
        console.log(`[updateProduct] Successfully created new product with ID: ${docRef.id}`);
        return {
          id: docRef.id,
          ...newProduct
        };
      }
    }
    
    // If it's not a numeric ID, proceed with regular update
    console.log(`[updateProduct] Updating document with ID: ${id}`);
    const docRef = doc(db, 'products', id);
    
    // Clean data for update
    const cleanData = { ...productData };
    
    // Remove any undefined values
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined) {
        delete cleanData[key];
      }
    });
    
    console.log(`[updateProduct] Updating document with data:`, cleanData);
    await updateDoc(docRef, cleanData);
    
    console.log(`[updateProduct] Successfully updated product with ID: ${id}`);
    return {
      id,
      ...productData
    };
  } catch (error) {
    console.error('[updateProduct] Error updating product:', error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    console.log(`[deleteProduct] Starting with ID: ${id} (type: ${typeof id})`);
    
    if (!id) {
      console.error('[deleteProduct] Invalid document ID for deletion:', id);
      throw new Error('Invalid document ID for deletion. ID cannot be empty.');
    }
    
    // First, try to find the document with a numeric ID field
    if (/^\d+$/.test(id)) {
      console.log(`[deleteProduct] Numeric ID detected: ${id}. Searching for matching document.`);
      
      // Query for documents with a matching numeric ID field
      const q = query(productsCollection, where("id", "==", parseInt(id)));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Found a document with this numeric ID
        const docRef = querySnapshot.docs[0];
        const realDocId = docRef.id;
        console.log(`[deleteProduct] Found document with numeric ID ${id}, using Firestore document ID: ${realDocId}`);
        
        // Delete with the real document ID
        const realDocRef = doc(db, 'products', realDocId);
        await deleteDoc(realDocRef);
        
        console.log(`[deleteProduct] Successfully deleted product with ID: ${realDocId}`);
        return true;
      } else {
        console.log(`[deleteProduct] No document found with numeric ID: ${id}.`);
        throw new Error(`No product found with ID: ${id}`);
      }
    }
    
    // If it's not a numeric ID, proceed with regular delete
    console.log(`[deleteProduct] Deleting document with ID: ${id}`);
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    
    console.log(`[deleteProduct] Successfully deleted product with ID: ${id}`);
    return true;
  } catch (error) {
    console.error('[deleteProduct] Error deleting product:', error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 6) => {
  try {
    const q = query(
      productsCollection,
      where('featured', '==', true),
      limit
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting featured products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      productsCollection,
      where('category', '==', category)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

// Search products
export const searchProducts = async (searchTerm) => {
  try {
    // Get all products (Firestore doesn't support direct text search)
    const snapshot = await getDocs(productsCollection);
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter client-side
    const searchLower = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}; 