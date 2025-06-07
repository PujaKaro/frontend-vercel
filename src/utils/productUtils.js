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

// Add a new product
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

// Update a product
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

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
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