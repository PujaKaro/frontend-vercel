import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp
  } from 'firebase/firestore';
  import { db } from '../config/firebase';
  
  // Create a new document
  export async function createDocument(collectionName, documentId, data) {
    try {
      await setDoc(doc(db, collectionName, documentId), data);
      return true;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }
  
  // Get a single document
  export async function getDocument(collectionName, documentId) {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }
  
  // Get all documents in a collection
  export async function getAllDocuments(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  }
  
  // Update a document
  export async function updateDocument(collectionName, documentId, data) {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, data);
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }
  
  // Delete a document
  export async function deleteDocument(collectionName, documentId) {
    try {
      await deleteDoc(doc(db, collectionName, documentId));
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
  
  // Query documents
  export async function queryDocuments(collectionName, field, operator, value) {
    try {
      const q = query(
        collection(db, collectionName),
        where(field, operator, value)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error querying documents:', error);
      throw error;
    }
  }
  
  // Create a sample user document
  export async function createSampleUser() {
    try {
      const userId = 'user1'; // You can use any unique ID
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, Country',
        createdAt: Timestamp.now(),
        orders: [],
        bookings: [],
        addresses: []
      };
  
      await setDoc(doc(db, 'users', userId), userData);
      console.log('Sample user created successfully!');
      return true;
    } catch (error) {
      console.error('Error creating sample user:', error);
      throw error;
    }
  }
  
  // Example usage:
  /*
  // Create a user
  await createDocument('users', 'user123', {
    name: 'John Doe',
    email: 'john@example.com'
  });
  
  // Get a user
  const user = await getDocument('users', 'user123');
  
  // Get all products
  const products = await getAllDocuments('products');
  
  // Update a product
  await updateDocument('products', 'product123', {
    price: 99.99
  });
  
  // Delete a product
  await deleteDocument('products', 'product123');
  
  // Query products by category
  const electronics = await queryDocuments('products', 'category', '==', 'electronics');
  */