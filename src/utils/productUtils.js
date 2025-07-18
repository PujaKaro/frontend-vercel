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

// Product ID Handling System:
// 1. Custom IDs: Users can set custom IDs in the admin dashboard (stored in the 'id' field)
// 2. Firestore Document IDs: Auto-generated by Firestore (used for routing)
// 3. Routing: Always uses Firestore document ID for consistent URLs
// 4. Lookup: First tries Firestore document ID, then falls back to custom ID field

// Get product by ID
export const getProductById = async (id) => {
  try {
    console.log(`Looking for product with ID: ${id}`);
    
    // First try to get the document directly using the ID (Firestore document ID)
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

// Add a product
export const addProduct = async (productData) => {
  try {
    console.log('[addProduct] Adding new product:', productData);
    
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
    
    console.log(`[addProduct] Successfully added product with Firestore ID: ${docRef.id}`);
    return {
      id: docRef.id, // Return Firestore document ID for routing
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
    
    // Clean data for update
    const cleanData = { ...productData };
    
    // Remove any undefined values
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key] === undefined) {
        delete cleanData[key];
      }
    });
    
    // Always use the provided Firestore document ID for updates
    console.log(`[updateProduct] Updating document with Firestore ID: ${id}`);
    const docRef = doc(db, 'products', id);
    
    console.log(`[updateProduct] Updating document with data:`, cleanData);
    await updateDoc(docRef, cleanData);
    
    console.log(`[updateProduct] Successfully updated product with ID: ${id}`);
    return {
      id,
      ...cleanData
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
    
    // Always use the provided Firestore document ID for deletion
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
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        firestoreId: doc.id,
        id: data.id || doc.id,
        ...data
      };
    });
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
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        firestoreId: doc.id,
        id: data.id || doc.id,
        ...data
      };
    });
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

// Utility function to get the routing ID for a product
export const getProductRoutingId = (product) => {
  // If the product has a custom ID field, use the Firestore document ID for routing
  // This ensures consistent routing regardless of custom IDs
  return product.id; // This will be the Firestore document ID
}; 

// Test function to verify product ID system
export const testProductIdSystem = async () => {
  try {
    console.log('Testing product ID system...');
    
    // Get all products
    const products = await getAllProducts();
    console.log(`Found ${products.length} products`);
    
    // Test each product
    for (const product of products) {
      console.log(`Testing product: ${product.name}`);
      console.log(`- Firestore Document ID: ${product.id}`);
      console.log(`- Custom ID field: ${product.customId || 'Not set'}`);
      
      // Test lookup by Firestore document ID
      const foundByDocId = await getProductById(product.id);
      if (foundByDocId) {
        console.log(`✓ Found by Firestore document ID`);
      } else {
        console.log(`✗ Not found by Firestore document ID`);
      }
    }
    
    console.log('Product ID system test completed');
    return { success: true, productCount: products.length };
  } catch (error) {
    console.error('Error testing product ID system:', error);
    return { success: false, error: error.message };
  }
}; 