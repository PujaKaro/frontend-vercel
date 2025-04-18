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
    Timestamp,
    addDoc,
    serverTimestamp,
    startAfter,
    increment
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
  
  // Migration functions
  export const migrateUserBookings = async () => {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (userData.bookings && userData.bookings.length > 0) {
          const bookingsRef = collection(db, 'bookings');
          
          for (const booking of userData.bookings) {
            await addDoc(bookingsRef, {
              ...booking,
              userId: userDoc.id,
              userName: userData.name,
              userEmail: userData.email,
              createdAt: booking.timestamp || serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          
          // Remove bookings array from user document
          await updateDoc(doc(db, 'users', userDoc.id), {
            bookings: []
          });
        }
      }
      return true;
    } catch (error) {
      console.error('Error migrating bookings:', error);
      throw error;
    }
  };
  
  export const migrateUserOrders = async () => {
    try {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        if (userData.orders && userData.orders.length > 0) {
          const ordersRef = collection(db, 'orders');
          
          for (const order of userData.orders) {
            await addDoc(ordersRef, {
              ...order,
              userId: userDoc.id,
              userName: userData.name,
              userEmail: userData.email,
              createdAt: order.timestamp || serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          
          // Remove orders array from user document
          await updateDoc(doc(db, 'users', userDoc.id), {
            orders: []
          });
        }
      }
      return true;
    } catch (error) {
      console.error('Error migrating orders:', error);
      throw error;
    }
  };
  
  // New booking functions
  export const createBooking = async (bookingData) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const newBooking = {
        ...bookingData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(bookingsRef, newBooking);
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };
  
  export const getUserBookings = async (userId) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      // First try with the complex query
      try {
        const q = query(
          bookingsRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (indexError) {
        // If composite index error occurs, fallback to simple query without ordering
        console.warn('Falling back to unordered query - please create the required index');
        const q = query(
          bookingsRef,
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort in memory as fallback
        return results.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateB - dateA;
        });
      }
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  };
  
  // New order functions
  export const createOrder = async (orderData) => {
    try {
      const ordersRef = collection(db, 'orders');
      const newOrder = {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(ordersRef, newOrder);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };
  
  export const getUserOrders = async (userId) => {
    try {
      const ordersRef = collection(db, 'orders');
      // First try with the complex query
      try {
        const q = query(
          ordersRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (indexError) {
        // If composite index error occurs, fallback to simple query without ordering
        console.warn('Falling back to unordered query - please create the required index');
        const q = query(
          ordersRef,
          where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort in memory as fallback
        return results.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateB - dateA;
        });
      }
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  };
  
  // Referral Management
  export const createReferralCode = async (data) => {
    try {
      const referralsRef = collection(db, 'referralCodes');
      const newReferral = {
        ...data,
        totalUsed: 0,
        totalDiscountGiven: 0,
        totalRevenueGenerated: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(referralsRef, newReferral);
      return docRef.id;
    } catch (error) {
      console.error('Error creating referral code:', error);
      throw error;
    }
  };

  export const validateReferralCode = async (code) => {
    try {
      const referralsRef = collection(db, 'referralCodes');
      const q = query(referralsRef, where('code', '==', code), where('isActive', '==', true));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return { valid: false };
      }

      const referral = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      return {
        valid: true,
        discountPercentage: referral.discountPercentage,
        referralId: referral.id
      };
    } catch (error) {
      console.error('Error validating referral code:', error);
      throw error;
    }
  };

  export const getReferralAnalytics = async (referralId) => {
    try {
      const referralDoc = await getDoc(doc(db, 'referralCodes', referralId));
      if (!referralDoc.exists()) {
        throw new Error('Referral code not found');
      }
      return referralDoc.data();
    } catch (error) {
      console.error('Error getting referral analytics:', error);
      throw error;
    }
  };

  export const updateReferralStats = async (referralCode, bookingAmount, discountAmount) => {
    try {
      const referralsRef = collection(db, 'referralCodes');
      const q = query(referralsRef, where('code', '==', referralCode));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const referralRef = doc(db, 'referralCodes', snapshot.docs[0].id);
        await updateDoc(referralRef, {
          totalUsed: increment(1),
          totalDiscountGiven: increment(discountAmount),
          totalRevenueGenerated: increment(bookingAmount),
          updatedAt: serverTimestamp()
        });
      }
      return true;
    } catch (error) {
      console.error('Error updating referral stats:', error);
      throw error;
    }
  };

  export const getUserReferralCode = async (userId) => {
    try {
      const referralsRef = collection(db, 'referralCodes');
      const q = query(referralsRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        return {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user referral code:', error);
      throw error;
    }
  };

  export const getAllReferralCodes = async (lastCode = null, pageSize = 20) => {
    try {
      let referralsQuery = query(
        collection(db, 'referralCodes'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastCode) {
        referralsQuery = query(referralsQuery, startAfter(lastCode));
      }

      const snapshot = await getDocs(referralsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting referral codes:', error);
      throw error;
    }
  };

  // Coupon code functions
  export const createCouponCode = async (data) => {
    try {
      const couponsRef = collection(db, 'coupons');
      const newCoupon = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        totalUsed: 0,
        totalDiscountGiven: 0,
        totalRevenueGenerated: 0
      };
      const docRef = await addDoc(couponsRef, newCoupon);
      return { id: docRef.id, ...newCoupon };
    } catch (error) {
      console.error('Error creating coupon code:', error);
      throw error;
    }
  };

  export const validateCouponCode = async (code) => {
    try {
      const couponsRef = collection(db, 'coupons');
      const q = query(couponsRef, where('code', '==', code), where('isActive', '==', true));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { valid: false };
      }
      
      const couponData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      
      // Check if coupon is assigned to specific users
      if (couponData.assignedUsers && couponData.assignedUsers.length > 0) {
        // This will be checked in the component against the current user
        return { 
          valid: true, 
          discountPercentage: couponData.discountPercentage,
          isCoupon: true,
          assignedUsers: couponData.assignedUsers,
          couponData
        };
      }
      
      return { 
        valid: true, 
        discountPercentage: couponData.discountPercentage,
        isCoupon: true,
        couponData
      };
    } catch (error) {
      console.error('Error validating coupon code:', error);
      throw error;
    }
  };

  export const updateCouponStats = async (couponCode, bookingAmount, discountAmount) => {
    try {
      const couponsRef = collection(db, 'coupons');
      const q = query(couponsRef, where('code', '==', couponCode));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const couponDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'coupons', couponDoc.id), {
          totalUsed: increment(1),
          totalDiscountGiven: increment(discountAmount),
          totalRevenueGenerated: increment(bookingAmount),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating coupon stats:', error);
      throw error;
    }
  };

  export const getUserCoupons = async (userId) => {
    try {
      const couponsRef = collection(db, 'coupons');
      
      // Get coupons specifically assigned to this user
      const userSpecificQuery = query(
        couponsRef,
        where('assignedUsers', 'array-contains', userId),
        where('isActive', '==', true)
      );
      const userSpecificSnapshot = await getDocs(userSpecificQuery);
      
      // Get coupons available to all users (where assignedUsers is null)
      const allUsersQuery = query(
        couponsRef,
        where('assignedUsers', '==', null),
        where('isActive', '==', true)
      );
      const allUsersSnapshot = await getDocs(allUsersQuery);
      
      // Combine both result sets
      const userCoupons = userSpecificSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const allUsersCoupons = allUsersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return [...userCoupons, ...allUsersCoupons];
    } catch (error) {
      console.error('Error getting user coupons:', error);
      throw error;
    }
  };

  export const getAllCoupons = async (lastCode = null, pageSize = 20) => {
    try {
      let couponsQuery;
      
      if (lastCode) {
        const lastDocSnapshot = await getDoc(doc(db, 'coupons', lastCode));
        couponsQuery = query(
          collection(db, 'coupons'),
          orderBy('createdAt', 'desc'),
          startAfter(lastDocSnapshot),
          limit(pageSize)
        );
      } else {
        couponsQuery = query(
          collection(db, 'coupons'),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      }
      
      const querySnapshot = await getDocs(couponsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting all coupons:', error);
      throw error;
    }
  };

  // Validation function for both referral and coupon codes
  export const validateCode = async (code) => {
    try {
      // First try referral code validation
      const referralResult = await validateReferralCode(code);
      if (referralResult.valid) {
        return { ...referralResult, isCoupon: false };
      }
      
      // If not a valid referral code, try coupon code validation
      const couponResult = await validateCouponCode(code);
      return couponResult;
    } catch (error) {
      console.error('Error validating code:', error);
      throw error;
    }
  };

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