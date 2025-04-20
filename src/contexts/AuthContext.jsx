import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Add notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  async function signup(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: userData.name,
        email: user.email,
        phone: userData.phone,
        address: userData.address,
        photoURL: null,
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        orders: [],
        bookings: [],
        addresses: []
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setCurrentUser({ ...user, ...userData });
      } else {
        setCurrentUser(user);
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        // Create new user profile
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
          orders: [],
          bookings: [],
          addresses: []
        });
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function updateUserProfile(userId, data) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      });
      
      // Update current user state if it's the same user
      if (currentUser && currentUser.uid === userId) {
        setCurrentUser(prevUser => ({
          ...prevUser,
          ...data
        }));
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  async function promoteToAdmin(userId) {
    if (!currentUser?.role === 'admin') {
      throw new Error('Unauthorized');
    }
    
    try {
      await updateUserProfile(userId, { role: 'admin' });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async function demoteFromAdmin(userId) {
    if (!currentUser?.role === 'admin') {
      throw new Error('Unauthorized');
    }
    
    try {
      await updateUserProfile(userId, { role: 'user' });
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Function to mark a notification as read
  async function markNotificationAsRead(notificationId) {
    try {
      if (!currentUser) return;
      
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Function to mark all notifications as read
  async function markAllNotificationsAsRead() {
    try {
      if (!currentUser) return;
      
      const unreadNotifications = notifications.filter(n => !n.read);
      
      // Update all unread notifications in Firestore
      const updatePromises = unreadNotifications.map(notification => 
        updateDoc(doc(db, 'notifications', notification.id), { read: true })
      );
      
      await Promise.all(updatePromises);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ ...user, ...userDoc.data() });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Listen for notifications when user is authenticated
  useEffect(() => {
    let unsubscribeNotifications = null;
    
    if (currentUser) {
      // Function to set up the fallback query without ordering
      const setupFallbackQuery = () => {
        const simpleQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', currentUser.uid),
          limit(50)
        );
        
        return onSnapshot(simpleQuery, (snapshot) => {
          const notificationData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Sort notifications by createdAt in memory instead of in the query
          notificationData.sort((a, b) => {
            // Handle missing createdAt field
            if (!a.createdAt) return 1;  // Put items without timestamp at the end
            if (!b.createdAt) return -1;
            
            // Try to convert timestamps to Date objects
            let dateA, dateB;
            
            try {
              dateA = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
            } catch (e) {
              dateA = new Date(0);
            }
            
            try {
              dateB = b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
            } catch (e) {
              dateB = new Date(0);
            }
            
            return dateB - dateA; // descending order (newest first)
          });
          
          setNotifications(notificationData);
          setUnreadCount(notificationData.filter(n => !n.read).length);
        }, (error) => {
          // Reset to empty if all else fails
          setNotifications([]);
          setUnreadCount(0);
        });
      };
      
      // Try with the complex query first
      try {
        const notificationsQuery = query(
          collection(db, 'notifications'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(50)
        );
        
        unsubscribeNotifications = onSnapshot(notificationsQuery, 
          (snapshot) => {
            const notificationData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            setNotifications(notificationData);
            setUnreadCount(notificationData.filter(n => !n.read).length);
          }, 
          (error) => {
            // If we encounter an index error, use the fallback
            if (unsubscribeNotifications) {
              unsubscribeNotifications();
            }
            
            unsubscribeNotifications = setupFallbackQuery();
          }
        );
      } catch (setupError) {
        unsubscribeNotifications = setupFallbackQuery();
      }
    } else {
      // Reset notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
    
    return () => {
      if (unsubscribeNotifications) {
        unsubscribeNotifications();
      }
    };
  }, [currentUser]);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
    promoteToAdmin,
    demoteFromAdmin,
    // Add notification related values
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;