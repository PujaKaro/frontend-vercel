import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faHistory,
  faPlus,
  faMinus,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { useCoinWallet } from '../contexts/CoinWalletContext';
import { useAuth } from '../contexts/AuthContext';

const UserCoinDashboard = () => {
  const { wallet, transactions, loading, getTransactions, refreshWallet } = useCoinWallet();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (currentUser) {
      getTransactions(currentUser.uid);
    }
  }, [currentUser, getTransactions]);

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'all') return true;
    return transaction.type === filterType;
  });

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'credit':
        return faArrowUp;
      case 'debit':
        return faArrowDown;
      default:
        return faCoins;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'credit':
        return 'text-green-600 bg-green-100';
      case 'debit':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <FontAwesomeIcon icon={faCoins} className="mr-3 text-yellow-500" />
              My Coin Wallet
            </h2>
            <p className="text-gray-600">Manage your coins and view transaction history</p>
          </div>
          <button
            onClick={refreshWallet}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 flex items-center"
          >
            <FontAwesomeIcon icon={faHistory} className="mr-2" />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faCoins} className="mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={faHistory} className="mr-2" />
              Transaction History
            </button>
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Current Balance</p>
                  <p className="text-3xl font-bold">{wallet?.balance || 0}</p>
                  <p className="text-yellow-100 text-sm">Coins</p>
                </div>
                <FontAwesomeIcon icon={faCoins} className="text-4xl text-yellow-200" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Earned</p>
                  <p className="text-2xl font-bold text-green-800">{wallet?.totalEarned || 0}</p>
                  <p className="text-green-600 text-sm">Coins</p>
                </div>
                <FontAwesomeIcon icon={faPlus} className="text-3xl text-green-400" />
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-red-800">{wallet?.totalSpent || 0}</p>
                  <p className="text-red-600 text-sm">Coins</p>
                </div>
                <FontAwesomeIcon icon={faMinus} className="text-3xl text-red-400" />
              </div>
            </div>
          </div>

          {/* How to Use Coins */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <FontAwesomeIcon icon={faCoins} className="mr-2" />
              How to Use Your Coins
            </h3>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-sm font-bold mr-3 mt-0.5">1</div>
                <div>
                  <p className="font-medium">Book a Puja Service</p>
                  <p className="text-sm text-blue-600">Go to any puja booking page and select "Use Coins" payment option</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-sm font-bold mr-3 mt-0.5">2</div>
                <div>
                  <p className="font-medium">Use Up to 80% of Service Price</p>
                  <p className="text-sm text-blue-600">You can use coins for up to 80% of the total service cost</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-sm font-bold mr-3 mt-0.5">3</div>
                <div>
                  <p className="font-medium">Pay Remaining with Cash/UPI</p>
                  <p className="text-sm text-blue-600">The remaining amount will be paid through cash or UPI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions Preview */}
          {transactions.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getTransactionColor(transaction.type)}`}>
                        <FontAwesomeIcon icon={getTransactionIcon(transaction.type)} className="text-sm" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.reason}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                      </p>
                      <p className="text-sm text-gray-500">coins</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('history')}
                className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium text-sm"
              >
                View All Transactions →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Transaction History Tab */}
      {activeTab === 'history' && (
        <div>
          {/* Filter */}
          <div className="mb-6">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
            </select>
          </div>

          {/* Transactions List */}
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faHistory} className="text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
              <p className="text-gray-500">You haven't made any coin transactions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${getTransactionColor(transaction.type)}`}>
                        <FontAwesomeIcon icon={getTransactionIcon(transaction.type)} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.reason}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</p>
                        {transaction.bookingId && (
                          <p className="text-xs text-blue-600">Booking ID: {transaction.bookingId}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                      </p>
                      <p className="text-sm text-gray-500">coins</p>
                      <div className="flex items-center mt-1">
                        <FontAwesomeIcon 
                          icon={faCheckCircle} 
                          className="text-green-500 text-sm mr-1" 
                        />
                        <span className="text-xs text-green-600 capitalize">{transaction.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCoinDashboard;
