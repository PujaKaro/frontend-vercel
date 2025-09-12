import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faPlus,
  faMinus,
  faSearch,
  faUser,
  faWallet,
  faHistory,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faFilter,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

const CoinManagementTab = () => {
  const [users, setUsers] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddCoinsModal, setShowAddCoinsModal] = useState(false);
  const [showDeductCoinsModal, setShowDeductCoinsModal] = useState(false);
  const [coinAmount, setCoinAmount] = useState('');
  const [coinReason, setCoinReason] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'transactions'
  const [filterType, setFilterType] = useState('all'); // 'all', 'credit', 'debit'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchWallets(),
        fetchTransactions()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Try to fetch from both 'users' and 'bookings' collections to get user data
      const usersRef = collection(db, 'users');
      const bookingsRef = collection(db, 'bookings');
      
      const [usersSnapshot, bookingsSnapshot] = await Promise.all([
        getDocs(usersRef),
        getDocs(bookingsRef)
      ]);
      
      // Get users from users collection
      const usersFromUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        uid: doc.id,
        ...doc.data()
      }));
      
      // Get unique users from bookings collection
      const usersFromBookings = [];
      const seenUserIds = new Set();
      
      bookingsSnapshot.docs.forEach(doc => {
        const booking = doc.data();
        if (booking.userId && !seenUserIds.has(booking.userId)) {
          seenUserIds.add(booking.userId);
          usersFromBookings.push({
            id: booking.userId,
            uid: booking.userId,
            displayName: booking.userName || 'No Name',
            email: booking.userEmail || 'No Email'
          });
        }
      });
      
      // Combine and deduplicate users
      const allUsers = [...usersFromUsers];
      usersFromBookings.forEach(user => {
        if (!allUsers.find(u => u.uid === user.uid)) {
          allUsers.push(user);
        }
      });
      
      console.log('Fetched users:', allUsers);
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchWallets = async () => {
    try {
      const walletsRef = collection(db, 'coinWallets');
      const querySnapshot = await getDocs(walletsRef);
      const walletsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      }));
      setWallets(walletsData);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const transactionsRef = collection(db, 'coinTransactions');
      const q = query(transactionsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const transactionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const getUserWallet = (userId) => {
    return wallets.find(wallet => wallet.userId === userId);
  };

  const getUserInfo = (userId) => {
    return users.find(user => user.uid === userId);
  };

  const createSampleUser = async () => {
    try {
      const sampleUserId = `sample_user_${Date.now()}`;
      const sampleUser = {
        uid: sampleUserId,
        displayName: 'Sample User',
        email: `sample${Date.now()}@example.com`,
        name: 'Sample User',
        userName: 'Sample User'
      };

      // Add to users collection
      await setDoc(doc(db, 'users', sampleUserId), sampleUser);
      
      // Create wallet for sample user
      await setDoc(doc(db, 'coinWallets', sampleUserId), {
        userId: sampleUserId,
        balance: 100, // Give them 100 coins to start
        totalEarned: 100,
        totalSpent: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast.success('Sample user created with 100 coins!');
      await fetchData();
    } catch (error) {
      console.error('Error creating sample user:', error);
      toast.error('Failed to create sample user');
    }
  };

  const handleAddCoins = async () => {
    if (!selectedUser || !coinAmount || !coinReason) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseInt(coinAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    console.log('Adding coins:', { selectedUser, amount, coinReason });

    try {
      // Get or create wallet
      const walletRef = doc(db, 'coinWallets', selectedUser.uid);
      const walletSnap = await getDoc(walletRef);
      
      let walletData;
      if (walletSnap.exists()) {
        walletData = walletSnap.data();
      } else {
        walletData = {
          userId: selectedUser.uid,
          balance: 0,
          totalEarned: 0,
          totalSpent: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(walletRef, walletData);
      }

      const newBalance = walletData.balance + amount;
      const newTotalEarned = walletData.totalEarned + amount;

      // Update wallet
      await updateDoc(walletRef, {
        balance: newBalance,
        totalEarned: newTotalEarned,
        updatedAt: serverTimestamp()
      });

      // Add transaction
      await addDoc(collection(db, 'coinTransactions'), {
        userId: selectedUser.uid,
        type: 'credit',
        amount: amount,
        reason: coinReason,
        adminId: 'admin', // You can get this from auth context
        timestamp: serverTimestamp(),
        status: 'completed'
      });

      toast.success(`Added ${amount} coins to ${selectedUser.displayName || selectedUser.name || selectedUser.userName || selectedUser.email}`);
      
      // Reset form
      setCoinAmount('');
      setCoinReason('');
      setShowAddCoinsModal(false);
      setSelectedUser(null);
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error adding coins:', error);
      toast.error('Failed to add coins');
    }
  };

  const handleDeductCoins = async () => {
    if (!selectedUser || !coinAmount || !coinReason) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseInt(coinAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const wallet = getUserWallet(selectedUser.uid);
    if (!wallet || wallet.balance < amount) {
      toast.error('Insufficient coin balance');
      return;
    }

    try {
      const walletRef = doc(db, 'coinWallets', selectedUser.uid);
      const newBalance = wallet.balance - amount;
      const newTotalSpent = wallet.totalSpent + amount;

      // Update wallet
      await updateDoc(walletRef, {
        balance: newBalance,
        totalSpent: newTotalSpent,
        updatedAt: serverTimestamp()
      });

      // Add transaction
      await addDoc(collection(db, 'coinTransactions'), {
        userId: selectedUser.uid,
        type: 'debit',
        amount: amount,
        reason: coinReason,
        adminId: 'admin', // You can get this from auth context
        timestamp: serverTimestamp(),
        status: 'completed'
      });

      toast.success(`Deducted ${amount} coins from ${selectedUser.displayName || selectedUser.name || selectedUser.userName || selectedUser.email}`);
      
      // Reset form
      setCoinAmount('');
      setCoinReason('');
      setShowDeductCoinsModal(false);
      setSelectedUser(null);
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error deducting coins:', error);
      toast.error('Failed to deduct coins');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = 
      transaction.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <FontAwesomeIcon icon={faCoins} className="mr-3 text-yellow-500" />
          Coin Management
        </h2>
        <p className="text-gray-600">Manage user coin wallets and transactions</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Users & Wallets
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faHistory} className="mr-2" />
              Transaction History
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder={activeTab === 'users' ? 'Search users...' : 'Search transactions...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-gray-400"
            />
          </div>
        </div>

        {activeTab === 'transactions' && (
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Transactions</option>
            <option value="credit">Credits</option>
            <option value="debit">Debits</option>
          </select>
        )}
      </div>

      {/* Users & Wallets Tab */}
      {activeTab === 'users' && (
        <div>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-500 mb-4">
                No users found in the system. Users will appear here once they make bookings or are added to the users collection.
              </p>
              <div className="space-x-3">
                <button
                  onClick={fetchData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Refresh Data
                </button>
                <button
                  onClick={createSampleUser}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add Sample User
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Earned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const wallet = getUserWallet(user.uid);
                return (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.displayName || user.name || user.userName || 'No Name'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email || user.userEmail || 'No Email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faCoins} className="mr-1 text-yellow-500" />
                        {wallet?.balance || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{wallet?.totalEarned || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{wallet?.totalSpent || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAddCoinsModal(true);
                          }}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FontAwesomeIcon icon={faPlus} className="mr-1" />
                          Add Coins
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeductCoinsModal(true);
                          }}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FontAwesomeIcon icon={faMinus} className="mr-1" />
                          Deduct Coins
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const user = getUserInfo(transaction.userId);
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.displayName || user?.name || user?.userName || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">{user?.email || user?.userEmail || transaction.userId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'credit'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <FontAwesomeIcon 
                          icon={transaction.type === 'credit' ? faPlus : faMinus} 
                          className="mr-1" 
                        />
                        {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faCoins} className="mr-1 text-yellow-500" />
                        {transaction.amount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {transaction.timestamp.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.timestamp.toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Coins Modal */}
      {showAddCoinsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Coins to {selectedUser.displayName || selectedUser.name || selectedUser.userName || selectedUser.email}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter coin amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={coinReason}
                  onChange={(e) => setCoinReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reason for adding coins"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddCoinsModal(false);
                  setSelectedUser(null);
                  setCoinAmount('');
                  setCoinReason('');
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCoins}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Add Coins
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deduct Coins Modal */}
      {showDeductCoinsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Deduct Coins from {selectedUser.displayName || selectedUser.name || selectedUser.userName || selectedUser.email}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter coin amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={coinReason}
                  onChange={(e) => setCoinReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reason for deducting coins"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 mr-2" />
                  <div className="text-sm text-yellow-700">
                    Current balance: {getUserWallet(selectedUser.uid)?.balance || 0} coins
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeductCoinsModal(false);
                  setSelectedUser(null);
                  setCoinAmount('');
                  setCoinReason('');
                }}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeductCoins}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Deduct Coins
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinManagementTab;
