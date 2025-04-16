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
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Create context
const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const value = {
    currentUser,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
    promoteToAdmin,
    demoteFromAdmin
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