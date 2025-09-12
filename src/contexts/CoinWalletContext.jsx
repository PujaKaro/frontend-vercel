import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

const CoinWalletContext = createContext();

export const useCoinWallet = () => {
  const context = useContext(CoinWalletContext);
  if (!context) {
    throw new Error('useCoinWallet must be used within a CoinWalletProvider');
  }
  return context;
};

export const CoinWalletProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize wallet for new users
  const initializeWallet = async (userId) => {
    try {
      const walletRef = doc(db, 'coinWallets', userId);
      const walletSnap = await getDoc(walletRef);
      
      if (!walletSnap.exists()) {
        const newWallet = {
          userId,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(walletRef, newWallet);
        return newWallet;
      }
      return walletSnap.data();
    } catch (error) {
      console.error('Error initializing wallet:', error);
      throw error;
    }
  };

  // Get wallet balance
  const getWalletBalance = async (userId) => {
    try {
      const walletRef = doc(db, 'coinWallets', userId);
      const walletSnap = await getDoc(walletRef);
      
      if (walletSnap.exists()) {
        return walletSnap.data();
      } else {
        return await initializeWallet(userId);
      }
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  };

  // Add coins to wallet
  const addCoins = async (userId, amount, reason, adminId = null) => {
    try {
      const walletRef = doc(db, 'coinWallets', userId);
      const walletSnap = await getDoc(walletRef);
      
      let walletData;
      if (walletSnap.exists()) {
        walletData = walletSnap.data();
      } else {
        walletData = await initializeWallet(userId);
      }

      const newBalance = walletData.balance + amount;
      const newTotalEarned = walletData.totalEarned + amount;

      await updateDoc(walletRef, {
        balance: newBalance,
        totalEarned: newTotalEarned,
        updatedAt: serverTimestamp()
      });

      // Add transaction record
      await addTransaction(userId, 'credit', amount, reason, adminId);

      // Update local state
      setWallet(prev => ({
        ...prev,
        balance: newBalance,
        totalEarned: newTotalEarned,
        updatedAt: new Date()
      }));

      return newBalance;
    } catch (error) {
      console.error('Error adding coins:', error);
      throw error;
    }
  };

  // Deduct coins from wallet
  const deductCoins = async (userId, amount, reason, bookingId = null) => {
    try {
      const walletRef = doc(db, 'coinWallets', userId);
      const walletSnap = await getDoc(walletRef);
      
      if (!walletSnap.exists()) {
        throw new Error('Wallet not found');
      }

      const walletData = walletSnap.data();
      
      if (walletData.balance < amount) {
        throw new Error('Insufficient coin balance');
      }

      const newBalance = walletData.balance - amount;
      const newTotalSpent = walletData.totalSpent + amount;

      await updateDoc(walletRef, {
        balance: newBalance,
        totalSpent: newTotalSpent,
        updatedAt: serverTimestamp()
      });

      // Add transaction record
      await addTransaction(userId, 'debit', amount, reason, null, bookingId);

      // Update local state
      setWallet(prev => ({
        ...prev,
        balance: newBalance,
        totalSpent: newTotalSpent,
        updatedAt: new Date()
      }));

      return newBalance;
    } catch (error) {
      console.error('Error deducting coins:', error);
      throw error;
    }
  };

  // Add transaction record
  const addTransaction = async (userId, type, amount, reason, adminId = null, bookingId = null) => {
    try {
      const transactionData = {
        userId,
        type, // 'credit' or 'debit'
        amount,
        reason,
        adminId,
        bookingId,
        timestamp: serverTimestamp(),
        status: 'completed'
      };

      await addDoc(collection(db, 'coinTransactions'), transactionData);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  // Get transaction history
  const getTransactions = async (userId, limit = 50) => {
    try {
      const transactionsRef = collection(db, 'coinTransactions');
      const q = query(
        transactionsRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const transactionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));

      setTransactions(transactionsData.slice(0, limit));
      return transactionsData;
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  };

  // Load wallet data when user changes
  useEffect(() => {
    const loadWalletData = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          const walletData = await getWalletBalance(currentUser.uid);
          setWallet(walletData);
          await getTransactions(currentUser.uid);
        } catch (error) {
          console.error('Error loading wallet data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setWallet(null);
        setTransactions([]);
        setLoading(false);
      }
    };

    loadWalletData();
  }, [currentUser]);

  // Real-time listener for wallet updates
  useEffect(() => {
    if (!currentUser) return;

    const walletRef = doc(db, 'coinWallets', currentUser.uid);
    
    const unsubscribe = onSnapshot(walletRef, (doc) => {
      if (doc.exists()) {
        const walletData = doc.data();
        const newWallet = {
          ...walletData,
          createdAt: walletData.createdAt?.toDate() || new Date(),
          updatedAt: walletData.updatedAt?.toDate() || new Date()
        };
        
        // Check if balance increased (coins were added by admin)
        if (wallet && newWallet.balance > wallet.balance) {
          const coinsAdded = newWallet.balance - wallet.balance;
          console.log(`🎉 ${coinsAdded} coins added to your wallet!`);
          // You can add a toast notification here if you want
        }
        
        setWallet(newWallet);
      } else {
        // Wallet doesn't exist, initialize it
        initializeWallet(currentUser.uid).then(walletData => {
          setWallet(walletData);
        });
      }
    }, (error) => {
      console.error('Error listening to wallet updates:', error);
    });

    return () => unsubscribe();
  }, [currentUser, wallet]);

  // Real-time listener for transaction updates
  useEffect(() => {
    if (!currentUser) return;

    const transactionsRef = collection(db, 'coinTransactions');
    const q = query(
      transactionsRef,
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setTransactions(transactionsData);
    }, (error) => {
      console.error('Error listening to transaction updates:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Refresh wallet data manually
  const refreshWallet = async () => {
    if (currentUser) {
      try {
        setLoading(true);
        const walletData = await getWalletBalance(currentUser.uid);
        setWallet(walletData);
        await getTransactions(currentUser.uid);
      } catch (error) {
        console.error('Error refreshing wallet data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const value = {
    wallet,
    transactions,
    loading,
    addCoins,
    deductCoins,
    getWalletBalance,
    getTransactions,
    initializeWallet,
    refreshWallet
  };

  return (
    <CoinWalletContext.Provider value={value}>
      {children}
    </CoinWalletContext.Provider>
  );
};

export default CoinWalletContext;
