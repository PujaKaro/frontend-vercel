import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCalendar,
  faShoppingBag,
  faBlog,
  faChartLine,
  faEdit,
  faTrash,
  faBan,
  faCheck,
  faPlus,
  faGift
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import SEO from '../components/SEO';
import { createReferralCode, getAllReferralCodes, updateDocument } from '../utils/firestoreUtils';
import { toast } from 'react-hot-toast';


const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalOrders: 0,
    totalBlogs: 0,
    recentUsers: [],
    recentBookings: [],
    recentOrders: [],
    recentBlogs: [],
    referrals: [],
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageOrderValue: 0,
    newUsers: 0,
    userGrowth: 0,
    popularServices: [],
    totalReferralRevenue: 0,
    totalDiscountsGiven: 0
  });
  const [newReferralCode, setNewReferralCode] = useState({
    code: '',
    discountPercentage: '',
    description: '',
    isActive: true
  });
  const [isCreatingCode, setIsCreatingCode] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [users, bookings, orders, blogs, referrals] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'bookings')),
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'blogs')),
        getAllReferralCodes()
      ]);

      const recentUsersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(15)
      );

      const recentBookingsQuery = query(
        collection(db, 'bookings'),
        orderBy('createdAt', 'desc'),
        limit(15)
      );

      const recentOrdersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(15)
      );

      const recentBlogsQuery = query(
        collection(db, 'blogs'),
        orderBy('createdAt', 'desc'),
        limit(15)
      );

      const [recentUsers, recentBookings, recentOrders, recentBlogs] = await Promise.all([
        getDocs(recentUsersQuery),
        getDocs(recentBookingsQuery),
        getDocs(recentOrdersQuery),
        getDocs(recentBlogsQuery)
      ]);

      // Calculate total revenue from bookings and orders
      const bookingDocs = bookings.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const orderDocs = orders.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalBookingRevenue = bookingDocs.reduce((sum, booking) => 
        sum + (booking.finalPrice || booking.price || 0), 0);
      const totalOrderRevenue = orderDocs.reduce((sum, order) => 
        sum + (order.total || 0), 0);
      const totalRevenue = totalBookingRevenue + totalOrderRevenue;

      // Calculate this month's revenue
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyBookingRevenue = bookingDocs
        .filter(booking => {
          const bookingDate = booking.createdAt?.toDate?.() || new Date(booking.createdAt);
          return bookingDate >= startOfMonth;
        })
        .reduce((sum, booking) => sum + (booking.finalPrice || booking.price || 0), 0);
      
      const monthlyOrderRevenue = orderDocs
        .filter(order => {
          const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
          return orderDate >= startOfMonth;
        })
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      const monthlyRevenue = monthlyBookingRevenue + monthlyOrderRevenue;

      // Calculate average order value
      const totalTransactions = bookingDocs.length + orderDocs.length;
      const averageOrderValue = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

      // Calculate user growth
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonthUsers = users.docs.filter(doc => {
        const createdAt = doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt);
        return createdAt >= startOfMonth;
      }).length;
      
      const lastMonthUsers = users.docs.filter(doc => {
        const createdAt = doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt);
        return createdAt >= lastMonthStart && createdAt < startOfMonth;
      }).length;

      const userGrowth = lastMonthUsers > 0 
        ? Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100) 
        : thisMonthUsers > 0 ? 100 : 0;

      // Calculate referral stats
      const referralStats = referrals.reduce((acc, ref) => ({
        totalRevenue: acc.totalRevenue + (ref.totalRevenueGenerated || 0),
        totalDiscounts: acc.totalDiscounts + (ref.totalDiscountGiven || 0)
      }), { totalRevenue: 0, totalDiscounts: 0 });

      // Calculate popular services
      const serviceStats = bookingDocs.reduce((acc, booking) => {
        const service = acc[booking.pujaName] || { 
          name: booking.pujaName,
          bookings: 0,
          revenue: 0
        };
        service.bookings++;
        service.revenue += booking.finalPrice || booking.price || 0;
        acc[booking.pujaName] = service;
        return acc;
      }, {});

      const popularServices = Object.values(serviceStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(service => ({
          ...service,
          percentage: Math.round((service.revenue / totalBookingRevenue) * 100)
        }));

      setStats({
        totalUsers: users.size,
        totalBookings: bookings.size,
        totalOrders: orders.size,
        totalBlogs: blogs.size,
        recentUsers: recentUsers.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        recentBookings: recentBookings.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        recentOrders: recentOrders.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        recentBlogs: recentBlogs.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        referrals,
        totalRevenue,
        monthlyRevenue,
        averageOrderValue,
        newUsers: thisMonthUsers,
        userGrowth,
        popularServices,
        totalReferralRevenue: referralStats.totalRevenue,
        totalDiscountsGiven: referralStats.totalDiscounts
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const userRef = doc(db, 'users', userId);
      switch (action) {
        case 'ban':
          await updateDoc(userRef, { status: 'banned' });
          break;
        case 'unban':
          await updateDoc(userRef, { status: 'active' });
          break;
        case 'delete':
          await deleteDoc(userRef);
          break;
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Error performing user action:', error);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      switch (action) {
        case 'approve':
          await updateDoc(bookingRef, { status: 'approved' });
          break;
        case 'reject':
          await updateDoc(bookingRef, { status: 'rejected' });
          break;
        case 'delete':
          await deleteDoc(bookingRef);
          break;
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Error performing booking action:', error);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      switch (action) {
        case 'process':
          await updateDoc(orderRef, { 
            status: 'processing',
            updatedAt: new Date()
          });
          break;
        case 'deliver':
          await updateDoc(orderRef, { 
            status: 'delivered',
            updatedAt: new Date(),
            deliveredAt: new Date()
          });
          break;
        case 'delete':
          await deleteDoc(orderRef);
          break;
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Error performing order action:', error);
    }
  };

  const handleBlogAction = async (blogId, action) => {
    try {
      const blogRef = doc(db, 'blogs', blogId);
      switch (action) {
        case 'publish':
          await updateDoc(blogRef, { 
            status: 'published',
            publishedAt: new Date(),
            updatedAt: new Date()
          });
          break;
        case 'unpublish':
          await updateDoc(blogRef, { 
            status: 'draft',
            updatedAt: new Date()
          });
          break;
        case 'delete':
          await deleteDoc(blogRef);
          break;
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Error performing blog action:', error);
    }
  };

  const handleCreateReferralCode = async (e) => {
    e.preventDefault();
    setIsCreatingCode(true);

    try {
      await createReferralCode({
        ...newReferralCode,
        discountPercentage: parseFloat(newReferralCode.discountPercentage)
      });

      setNewReferralCode({
        code: '',
        discountPercentage: '',
        description: '',
        isActive: true
      });

      toast.success('Referral code created successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating referral code:', error);
      toast.error('Failed to create referral code');
    } finally {
      setIsCreatingCode(false);
    }
  };

  const handleToggleReferralStatus = async (referralId, currentStatus) => {
    try {
      await updateDocument('referralCodes', referralId, {
        isActive: !currentStatus,
        updatedAt: new Date()
      });
      fetchDashboardData();
      toast.success('Referral code status updated');
    } catch (error) {
      console.error('Error updating referral status:', error);
      toast.error('Failed to update referral code status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Admin Dashboard - PujaKaro"
        description="Administrative dashboard for managing PujaKaro platform"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2">Manage your platform and users</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'users'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Users
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'bookings'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                  Bookings
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'orders'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'blogs'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faBlog} className="mr-2" />
                  Blogs
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'analytics'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('referrals')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'referrals'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faGift} className="mr-2" />
                  Referrals
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <FontAwesomeIcon icon={faUsers} className="text-orange-500 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <FontAwesomeIcon icon={faCalendar} className="text-green-500 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500">Bookings</p>
                    <p className="text-2xl font-bold">{stats.totalBookings}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-blue-500 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500">Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <FontAwesomeIcon icon={faBlog} className="text-purple-500 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500">Blogs</p>
                    <p className="text-2xl font-bold">{stats.totalBlogs}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">User Management</h2>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {user.photoURL ? (
                                  <img
                                    src={user.photoURL}
                                    alt={user.name}
                                    className="h-10 w-10 rounded-full"
                                  />
                                ) : (
                                  <span className="text-xl">{user.name?.[0]}</span>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleUserAction(user.id, 'edit')}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() =>
                                handleUserAction(
                                  user.id,
                                  user.status === 'active' ? 'ban' : 'unban'
                                )
                              }
                              className="text-orange-600 hover:text-orange-900 mr-3"
                            >
                              <FontAwesomeIcon
                                icon={user.status === 'active' ? faBan : faCheck}
                              />
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Booking Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Puja Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.recentBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.pujaName}
                              </div>
                              <div className="text-sm text-gray-500">
                                Date: {new Date(booking.createdAt.toDate()).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                Price: ₹{booking.finalPrice || booking.price}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm text-gray-900">{booking.userName}</div>
                              <div className="text-sm text-gray-500">{booking.phone}</div>
                              <div className="text-sm text-gray-500">{booking.address}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleBookingAction(booking.id, 'edit')}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleBookingAction(booking.id, 'approve')}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button
                              onClick={() => handleBookingAction(booking.id, 'reject')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FontAwesomeIcon icon={faBan} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Order Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Order #{order.id.slice(-6)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Date: {new Date(order.createdAt.toDate()).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                Total: ₹{order.total}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{order.customerName}</div>
                            <div className="text-sm text-gray-500">{order.shippingAddress}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === 'processing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleOrderAction(order.id, 'process')}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleOrderAction(order.id, 'deliver')}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button
                              onClick={() => handleOrderAction(order.id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'blogs' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Blog Management</h2>
                  <button 
                    onClick={() => navigate('/blog/create')}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create Blog
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Blog Post
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.recentBlogs.map((blog) => (
                        <tr key={blog.id}>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {blog.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(blog.createdAt.toDate()).toLocaleDateString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{blog.author}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                blog.status === 'published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {blog.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => navigate(`/blog/edit/${blog.id}`)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleBlogAction(blog.id, 'publish')}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                            <button
                              onClick={() => handleBlogAction(blog.id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{stats.totalRevenue || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-500">This Month</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{stats.monthlyRevenue || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-500">Average Order Value</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{stats.averageOrderValue || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Popular Services</h2>
                  <div className="space-y-4">
                    {stats.popularServices?.map((service, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">{service.bookings} bookings</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{service.revenue}</p>
                          <p className="text-sm text-gray-500">{service.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">User Growth</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">New Users (This Month)</p>
                        <p className="text-2xl font-bold">{stats.newUsers || 0}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Growth</p>
                        <p className={`text-lg font-bold ${
                          (stats.userGrowth || 0) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {stats.userGrowth > 0 ? '+' : ''}{stats.userGrowth || 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="space-y-6">
                {/* Referral Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-sm text-gray-500">Total Referral Revenue</h3>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{stats.totalReferralRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-sm text-gray-500">Total Discounts Given</h3>
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{stats.totalDiscountsGiven.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-sm text-gray-500">Active Referral Codes</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.referrals.filter(r => r.isActive).length}
                    </p>
                  </div>
                </div>

                {/* Create New Referral Code */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Create Referral Code</h2>
                  <form onSubmit={handleCreateReferralCode} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Code</label>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          value={newReferralCode.code}
                          onChange={(e) => setNewReferralCode(prev => ({ ...prev, code: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                        <input
                          type="number"
                          required
                          min="0"
                          max="100"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                          value={newReferralCode.discountPercentage}
                          onChange={(e) => setNewReferralCode(prev => ({ ...prev, discountPercentage: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        value={newReferralCode.description}
                        onChange={(e) => setNewReferralCode(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        checked={newReferralCode.isActive}
                        onChange={(e) => setNewReferralCode(prev => ({ ...prev, isActive: e.target.checked }))}
                      />
                      <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={isCreatingCode}
                        className={`w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 
                          ${isCreatingCode ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isCreatingCode ? 'Creating...' : 'Create Referral Code'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Referral Codes List */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Referral Codes</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Code
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Discount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Usage
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {stats.referrals.map((referral) => (
                          <tr key={referral.id}>
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-900">{referral.code}</div>
                                <div className="text-sm text-gray-500">{referral.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-green-600 font-medium">
                                {referral.discountPercentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-gray-900">{referral.totalUsed || 0}</div>
                                <div className="text-sm text-gray-500">
                                  ₹{(referral.totalDiscountGiven || 0).toLocaleString()} saved
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-gray-900">
                                ₹{(referral.totalRevenueGenerated || 0).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${referral.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                              >
                                {referral.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleToggleReferralStatus(referral.id, referral.isActive)}
                                className={`text-sm font-medium ${
                                  referral.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                                }`}
                              >
                                {referral.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;