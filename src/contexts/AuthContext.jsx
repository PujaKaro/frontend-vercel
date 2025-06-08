import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
  reload,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  limit 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

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
      
      // Update user profile with display name
      if (userData.name) {
        await updateProfile(user, {
          displayName: userData.name
        });
      }
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: userData.name,
        email: user.email,
        phone: userData.phone,
        address: userData.address,
        photoURL: null,
        role: 'user',
        status: 'pending', // Set to pending until email is verified
        emailVerified: false,
        phoneVerified: false, // Add phone verification status
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
        
        // Update Firestore if email was just verified
        if (!userData.emailVerified && user.emailVerified) {
          await updateDoc(doc(db, 'users', user.uid), {
            emailVerified: true,
            status: 'active'
          });
        }
        
        setCurrentUser({ ...user, ...userData, emailVerified: user.emailVerified });
        return { ...user, ...userData, emailVerified: user.emailVerified };
      } else {
        setCurrentUser({ ...user, emailVerified: user.emailVerified });
        return { ...user, emailVerified: user.emailVerified };
      }
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }
  
  // Function to check if an email exists in Firebase Auth
  async function checkEmailExists(email) {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      // Don't throw error, just return false
      return false;
    }
  }
  
  // Function to send password reset email
  async function resetPassword(email) {
    try {
      // Make sure email is trimmed to remove any accidental spaces
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (error) {
      // Check for specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address. Please check your email or sign up for a new account.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('The email address is not valid. Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many requests. Please try again later.');
      } else {
        throw error;
      }
    }
  }
  
  // Function to resend email verification
  async function resendEmailVerification() {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      // Reload user to get latest emailVerified status
      await reload(currentUser);
      
      if (currentUser.emailVerified) {
        throw new Error('Email is already verified');
      }
      
      await sendEmailVerification(currentUser);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Function to check email verification status
  async function checkEmailVerification() {
    try {
      if (!currentUser) return false;
      
      // Reload user to get latest emailVerified status
      await reload(currentUser);
      
      if (currentUser.emailVerified) {
        // Update Firestore if needed
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && !userDoc.data().emailVerified) {
          await updateDoc(doc(db, 'users', currentUser.uid), {
            emailVerified: true,
            status: 'active'
          });
        }
        
        // Update current user state
        setCurrentUser(prevUser => ({
          ...prevUser,
          emailVerified: true,
          status: 'active'
        }));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking email verification:', error);
      return false;
    }
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
          role: 'user',
          status: 'active',
          emailVerified: true,
          phoneVerified: true, // Since Google authentication is considered trusted, set phoneVerified to true
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
        // For email/password users, get the user data regardless of verification
        // We need to set the user in state to show the verification pages
        const isGoogleUser = user.providerData.some(provider => provider.providerId === 'google.com');
        
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser({ ...user, ...userData, emailVerified: user.emailVerified });
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
    // Add new authentication functions
    checkEmailExists,
    resetPassword,
    resendEmailVerification,
    checkEmailVerification,
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
