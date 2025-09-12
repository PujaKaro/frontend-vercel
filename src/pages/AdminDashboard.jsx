import { useState, useEffect, useCallback } from 'react';
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
  faGift,
  faBell,
  faStar,
  faPray,
  faDatabase,
  faCommentDots,
  faHome,
  faUser,
  faMoneyBillWave
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
  limit,
  getDoc
} from 'firebase/firestore';
import SEO from '../components/SEO';
import { createReferralCode, getAllReferralCodes, updateDocument, createCouponCode, getAllCoupons, sendCouponNotification, sendBookingNotification, sendOrderNotification } from '../utils/firestoreUtils';
import { toast } from 'react-hot-toast';
import AdminCodesTabs from '../components/AdminCodesTabs';
import AdminNotificationsTab from '../components/AdminNotificationsTab';
import AdminTestimonialsTab from '../components/AdminTestimonialsTab';
import BookingManagementTab from '../components/BookingManagementTab';
import AdminHomeContentTab from '../components/AdminHomeContentTab';
import AdminLeadsTab from '../components/AdminLeadsTab';
import AdminUTRPaymentsTab from '../components/AdminUTRPaymentsTab';
import { 
  migrateDataToFirestore, 
  getAllPujas, 
  addPuja, 
  updatePuja, 
  deletePuja,
  cleanupExistingProducts
} from '../utils/dataUtils';
import { 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../utils/productUtils';
import { getAllProducts } from '../utils/dataUtils';
import {
  getAllPandits,
  addPandit,
  updatePandit,
  deletePandit
} from '../utils/panditUtils';
import {
  getPanditServices,
  addPanditService,
  updatePanditService,
  deletePanditService
} from '../utils/panditServiceUtils';
import AdminProductModal from '../components/AdminProductModal';
import AdminPujaModal from '../components/AdminPujaModal';
import AdminPanditModal from '../components/AdminPanditModal';
import AdminUserDetailModal from '../components/AdminUserDetailModal';


const AdminDashboard = () => {
  const { promoteToAdmin, demoteFromAdmin, currentUser } = useAuth();
  const [adminFilter, setAdminFilter] = useState('all'); // 'all', 'admin', 'user'
  const [adminSearch, setAdminSearch] = useState('');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [activeCodesTab, setActiveCodesTab] = useState('referrals');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalOrders: 0,
    totalBlogs: 0,
    totalLeads: 0,
    recentUsers: [],
    recentBookings: [],
    recentOrders: [],
    recentBlogs: [],
    referrals: [],
    coupons: [],
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageOrderValue: 0,
    newUsers: 0,
    userGrowth: 0,
    popularServices: [],
    totalReferralRevenue: 0,
    totalDiscountsGiven: 0,
    totalCouponRevenue: 0,
    totalCouponDiscounts: 0,
    totalCouponsIssued: 0,
    totalCouponsRedeemed: 0
  });
  const [newReferralCode, setNewReferralCode] = useState({
    code: '',
    discountPercentage: '',
    description: '',
    isActive: true
  });
  const [newCouponCode, setNewCouponCode] = useState({
    code: '',
    discountPercentage: '',
    description: '',
    isActive: true,
    usageLimit: 'limited', // Default to limited usage
    selectAllUsers: true,
    assignedUsers: []
  });
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pujas, setPujas] = useState([]);
  const [products, setProducts] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [editingPuja, setEditingPuja] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingPandit, setEditingPandit] = useState(null);
  const [showPujaModal, setShowPujaModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPanditModal, setShowPanditModal] = useState(false);
  const [pujaForm, setPujaForm] = useState({
    id: '',
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    duration: '',
    category: '',
    image: '',
    requirements: [],
    availableTimeSlots: [],
    rating: 4.5,
    reviews: 0,
    occasions: [],
    pandits: []
  });
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    category: '',
    image: '',
    stock: 0,
    featured: false,
    rating: 4.5,
    reviews: 0,
    discount: 0,
    features: [],
    requirements: [],
    occasions: [],
    pandits: [],
    availableTimeSlots: [],
    duration: '',
    spiritualSignificance: '',
    keyMantras: [],
    ritualSteps: [],
    placementGuide: '',
    careInstructions: '',
    weight: '',
    dimensions: '',
    material: '',
    brand: '',
    sku: '',
    mpn: '',
    inStock: true,
    isWishlisted: false,
    additionalImages: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    canonicalUrl: '',
    breadcrumbSchema: '',
    productSchema: ''
  });
  const [panditForm, setPanditForm] = useState({
    id: '',
    name: '',
    description: '',
    image: '',
    location: '',
    experience: 0,
    specializations: [],
    languages: [],
    availability: true,
    rating: 4.5,
    reviews: 0,
    contactNumber: '',
    email: ''
  });
  const [isMigratingData, setIsMigratingData] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [viewingUser, setViewingUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });
  // State for user filters
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSortOption, setUserSortOption] = useState('newest');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isAllUsersSelected, setIsAllUsersSelected] = useState(false);
  // Pagination for users
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  // Get current page of users
  const getCurrentPageUsers = () => {
    const filteredUsers = getFilteredUsers();
    const indexOfLastUser = userCurrentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  };
  
  // Calculate total pages
  const getTotalUserPages = () => {
    return Math.ceil(getFilteredUsers().length / usersPerPage);
  };
  
  // Handle page change
  const handleUserPageChange = (pageNumber) => {
    setUserCurrentPage(pageNumber);
  };

  // Helper function to safely handle different date formats
  const formatFirestoreDate = (dateField) => {
    if (!dateField) return null;
    
    // If it's a Firestore timestamp with toDate method
    if (dateField && typeof dateField.toDate === 'function') {
      return dateField.toDate();
    }
    
    // If it's already a Date object or timestamp number or string
    try {
      return new Date(dateField);
    } catch (e) {
      console.log('Error parsing date:', e);
      return null;
    }
  };

  // Fetch all users (no pagination) specifically for user management
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      
      const usersSnapshot = await getDocs(collection(db, 'users'));
      
      // Extract user data with proper date handling
      const userData = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Log a sample user for debugging
        if (doc.id === usersSnapshot.docs[0]?.id) {
          console.log('Sample user data:', data);
        }
        
        // Create a timestamp for users without createdAt
        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        
        // Ensure we have a status field and default to 'active'
        const userStatus = data.status || 'active';
        
        return {
          id: doc.id,
          name: data.name || data.displayName || 'User',
          email: data.email || 'No email',
          phone: data.phone || '',
          role: data.role || 'user',
          status: userStatus,
          // Ensure createdAt exists with a fallback
          createdAt: data.createdAt || oneYearAgo,
          lastLogin: data.lastLogin || null,
          orderCount: data.orderCount || 0,
          photoURL: data.photoURL || ''
        };
      });
      
      console.log(`Fetched ${userData.length} users for management`);
      setAllUsers(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all users:', error);
      setLoading(false);
    }
  };
  
  // Update the activeTab effect to fetch appropriate data
  useEffect(() => {
    // If switching to users tab, fetch all users
    if (activeTab === 'users') {
      fetchAllUsers();
    }
    
    // If switching to pujas tab, fetch pujas
    if (activeTab === 'pujas') {
      fetchPujas();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchDashboardData();
    fetchAllUsers();
    fetchPujas();
    fetchProducts();
    fetchPandits();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch pujas if on pujas tab
      if (activeTab === 'pujas') {
        await fetchPujas();
      }
      
      const [users, bookings, orders, blogs, referrals, coupons] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'bookings')),
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'blogs')),
        getAllReferralCodes(),
        getAllCoupons()
      ]);

      // Fetch leads count
      const leadsSnapshot = await getDocs(collection(db, 'NEW_LEADS'));

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

      // Extract user data for coupon assignment / fetchdashboardData
      const userData = users.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || doc.data().displayName || 'User',
        email: doc.data().email || 'No email',
        role: doc.data().role || 'user' // <-- Add this line
      }));
      setAllUsers(userData);
      
      // Calculate referral stats
      const referralStats = referrals.reduce((acc, ref) => ({
        totalRevenue: acc.totalRevenue + (ref.totalRevenueGenerated || 0),
        totalDiscounts: acc.totalDiscounts + (ref.totalDiscountGiven || 0)
      }), { totalRevenue: 0, totalDiscounts: 0 });
      
      // Calculate coupon stats
      const couponStats = coupons.reduce((acc, coupon) => ({
        totalRevenue: acc.totalRevenue + (coupon.totalRevenueGenerated || 0),
        totalDiscounts: acc.totalDiscounts + (coupon.totalDiscountGiven || 0),
        totalRedeemed: acc.totalRedeemed + (coupon.totalUsed || 0)
      }), { totalRevenue: 0, totalDiscounts: 0, totalRedeemed: 0 });

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
        totalLeads: leadsSnapshot.size,
        recentUsers: recentUsers.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        recentBookings: recentBookings.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        recentOrders: recentOrders.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        recentBlogs: recentBlogs.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        referrals,
        coupons,
        totalRevenue,
        monthlyRevenue,
        averageOrderValue,
        newUsers: thisMonthUsers,
        userGrowth,
        popularServices,
        totalReferralRevenue: referralStats.totalRevenue,
        totalDiscountsGiven: referralStats.totalDiscounts,
        totalCouponRevenue: couponStats.totalRevenue,
        totalCouponDiscounts: couponStats.totalDiscounts,
        totalCouponsIssued: coupons.length,
        totalCouponsRedeemed: couponStats.totalRedeemed
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
      
      // For view action, get the user details and open modal
      if (action === 'view') {
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          
          // Log the raw user data for debugging
          console.log('Raw user data from Firestore:', userData);
          
          // Create a viewingUser object with properly handled dates and default values
          const viewingUserData = { 
            id: userId,
            ...userData,
            name: userData.name || userData.displayName || 'User',
            email: userData.email || 'No email',
            phone: userData.phone || '',
            role: userData.role || 'user',
            status: userData.status || 'active' // Set default status if missing
          };
          
          console.log('Processed viewingUser data:', viewingUserData);
          
          setViewingUser(viewingUserData);
          setUserForm({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            role: userData.role || 'user',
            status: userData.status || 'active', // Set default status if missing
            address: userData.address || '',
            city: userData.city || '',
            state: userData.state || '',
            pincode: userData.pincode || '',
            notes: userData.notes || ''
          });
          setShowUserModal(true);
        } else {
          toast.error('User not found');
        }
        return;
      }
      
      // For ban action
      if (action === 'ban') {
        await updateDoc(userRef, { status: 'banned' });
        toast.success('User banned successfully');
      }
      
      // For unban action
      if (action === 'unban') {
        await updateDoc(userRef, { status: 'active' });
        toast.success('User activated successfully');
      }
      
      // For delete action
      if (action === 'delete') {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          await deleteDoc(userRef);
          toast.success('User deleted successfully');
        }
      }
      
      // Refresh user data
      fetchDashboardData();
    } catch (error) {
      console.error('Error performing user action:', error);
      toast.error('Error performing action: ' + error.message);
    }
  };
  
  const handleSaveUser = async (e) => {
    e.preventDefault();
    
    try {
      if (!viewingUser) return;
      
      // Update the user document
      const userRef = doc(db, 'users', viewingUser.id);
      await updateDoc(userRef, userForm);
      
      toast.success('User updated successfully');
      setShowUserModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user: ' + error.message);
    }
  };
  
  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnapshot = await getDoc(bookingRef);
      
      if (!bookingSnapshot.exists()) {
        toast.error('Booking not found');
        return;
      }
      
      const bookingData = bookingSnapshot.data();
      const userId = bookingData.userId;
      
      switch (action) {
        case 'approve':
          await updateDoc(bookingRef, { status: 'approved' });
          // Send notification to user
          if (userId) {
            await sendBookingNotification(
              userId, 
              bookingId, 
              'approved', 
              bookingData.pujaName || 'your booking'
            );
          }
          break;
        case 'reject':
          await updateDoc(bookingRef, { status: 'rejected' });
          // Send notification to user
          if (userId) {
            await sendBookingNotification(
              userId, 
              bookingId, 
              'rejected', 
              bookingData.pujaName || 'your booking'
            );
          }
          break;
        case 'delete':
          await deleteDoc(bookingRef);
          break;
      }
      fetchDashboardData();
      toast.success(`Booking ${action === 'delete' ? 'deleted' : action + 'd'} successfully`);
    } catch (error) {
      console.error('Error performing booking action:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleOrderAction = async (orderId, action) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderSnapshot = await getDoc(orderRef);
      
      if (!orderSnapshot.exists()) {
        toast.error('Order not found');
        return;
      }
      
      const orderData = orderSnapshot.data();
      const userId = orderData.userId;
      
      switch (action) {
        case 'process':
          await updateDoc(orderRef, { 
            status: 'processing',
            updatedAt: new Date()
          });
          // Send notification to user
          if (userId) {
            await sendOrderNotification(userId, orderId, 'processing');
          }
          break;
        case 'deliver':
          await updateDoc(orderRef, { 
            status: 'delivered',
            updatedAt: new Date(),
            deliveredAt: new Date()
          });
          // Send notification to user
          if (userId) {
            await sendOrderNotification(userId, orderId, 'delivered');
          }
          break;
        case 'delete':
          await deleteDoc(orderRef);
          break;
      }
      fetchDashboardData();
      toast.success(`Order ${action === 'delete' ? 'deleted' : action === 'process' ? 'processing' : action + 'd'} successfully`);
    } catch (error) {
      console.error('Error performing order action:', error);
      toast.error('An error occurred. Please try again.');
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

  const handleCreateCouponCode = async (e) => {
    e.preventDefault();
    setIsCreatingCoupon(true);
    
    try {
      const couponData = {
        code: newCouponCode.code,
        discountPercentage: parseInt(newCouponCode.discountPercentage),
        description: newCouponCode.description,
        usageLimit: newCouponCode.usageLimit, // Include usage limit
        isActive: true
      };
      
      // If not selecting all users, add the selected users to the coupon data
      if (!newCouponCode.selectAllUsers) {
        couponData.assignedUsers = selectedUsers;
      } else {
        // Set the assignedUsers field to null explicitly when "Valid for all users" is selected
        couponData.assignedUsers = null;
      }
      
      await createCouponCode(couponData);
      
      // Send notifications to users about the new coupon
      if (!newCouponCode.selectAllUsers && selectedUsers.length > 0) {
        // Send notifications to specific users
        for (const userId of selectedUsers) {
          await sendCouponNotification(
            userId, 
            couponData.code, 
            couponData.discountPercentage
          );
        }
      }
      
      // Reset form and fetch updated data
      setNewCouponCode({
        code: '',
        discountPercentage: '',
        description: '',
        isActive: true,
        usageLimit: 'limited', // Reset to default
        selectAllUsers: true,
        assignedUsers: []
      });
      setSelectedUsers([]);
      
      await fetchDashboardData();
      toast.success('Coupon code created successfully!');
    } catch (error) {
      console.error('Error creating coupon code:', error);
      toast.error('Error creating coupon code. Please try again.');
    } finally {
      setIsCreatingCoupon(false);
    }
  };

  const handleToggleCouponStatus = async (couponId, currentStatus) => {
    try {
      await updateDocument('coupons', couponId, { isActive: !currentStatus });
      await fetchDashboardData();
      toast.success(`Coupon code ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      toast.error('Error updating coupon code. Please try again.');
    }
  };
  
  const handleCouponInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setNewCouponCode(prev => ({ ...prev, [name]: checked }));
    } else {
      setNewCouponCode(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleUserSelection = (e) => {
    // Get all selected option values
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    
    // Update state with the new selections
    setSelectedUsers(selectedOptions);
    
    // Also update the newCouponCode state to keep everything in sync
    setNewCouponCode(prev => ({
      ...prev,
      assignedUsers: selectedOptions
    }));
  };

  const fetchPujas = async () => {
    try {
      console.log('Fetching pujas data from Firestore...');
      setLoading(true);
      const pujasData = await getAllPujas();
      console.log('Pujas data retrieved:', pujasData);
      setPujas(pujasData);
      
      // Extract unique categories for the filter dropdown
      const categories = [...new Set(pujasData.map(puja => puja.category).filter(Boolean))];
      setUniqueCategories(categories);
      
      console.log(`Successfully retrieved ${pujasData.length} pujas`);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pujas:', error);
      setLoading(false);
    }
  };

  const handleMigrateData = async () => {
    try {
      setIsMigratingData(true);
      const result = await migrateDataToFirestore();
      
      if (result.success) {
        toast.success(result.message);
        // Refresh pujas data after migration
        if (activeTab === 'pujas') {
          await fetchPujas();
        }
      } else {
        toast.error(result.message);
      }
      
      setIsMigratingData(false);
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error(`Migration failed: ${error.message}`);
      setIsMigratingData(false);
    }
  };

  const handleCleanupProducts = async () => {
    try {
      setLoading(true);
      const result = await cleanupExistingProducts();
      if (result.success) {
        toast.success(`Cleaned up ${result.updatedCount} products successfully`);
        // Refresh products list
        await fetchProducts();
      } else {
        toast.error(`Failed to cleanup products: ${result.error}`);
      }
    } catch (error) {
      console.error('Error cleaning up products:', error);
      toast.error('Failed to cleanup products');
    } finally {
      setLoading(false);
    }
  };



  const handleOpenPujaModal = (puja = null) => {
    if (puja) {
      console.log('Opening modal to edit puja:', puja);
      
      // Ensure ID is a string but keep the original ID value
      setEditingPuja({
        ...puja,
        id: String(puja.id) // Convert ID to string without changing its format
      });
      
      setPujaForm({
        id: String(puja.id),
        name: puja.name || '',
        description: puja.description || '',
        longDescription: puja.longDescription || '',
        price: puja.price || 0,
        duration: puja.duration || '',
        category: puja.category || '',
        image: puja.image || '',
        requirements: puja.requirements || [],
        availableTimeSlots: puja.availableTimeSlots || [],
        rating: puja.rating || 4.5,
        reviews: puja.reviews || 0,
        occasions: puja.occasions || [],
        pandits: puja.pandits || [],
        pujaTimeline: puja.pujaTimeline || [],
        expandableSections: puja.expandableSections || [],
        serviceTiers: puja.serviceTiers || {}
      });
    } else {
      // Find the highest ID value and add 1 for new puja
      console.log('Creating new puja, calculating next ID...');
      console.log('Current pujas data:', pujas);
      
      let nextId = 1;
      
      // Refresh pujas data to ensure we have the latest
      fetchPujas().then(() => {
        if (pujas && pujas.length > 0) {
          console.log(`Found ${pujas.length} pujas to analyze for ID generation`);
          
          // Extract all ID values and convert to numbers where possible
          const idValues = [];
          
          pujas.forEach((puja, index) => {
            // Get values from both id and internalId fields
            const id = puja.id;
            const internalId = puja.internalId;
            
            console.log(`Puja ${index}: id=${id}, internalId=${internalId}`);
            
            // Convert to numbers if possible
            if (id && !isNaN(Number(id))) {
              idValues.push(Number(id));
            }
            
            if (internalId && !isNaN(Number(internalId))) {
              idValues.push(Number(internalId));
            }
          });
          
          // Find the maximum ID value
          if (idValues.length > 0) {
            nextId = Math.max(...idValues) + 1;
          }
          
          console.log('Collected ID values:', idValues);
          console.log(`Calculated next ID: ${nextId}`);
        } else {
          console.log('No existing pujas found, using default ID: 1');
        }
        
        // Set form with the calculated ID
        setEditingPuja(null);
        setPujaForm({
          id: String(nextId),
          name: '',
          description: '',
          longDescription: '',
          price: 0,
          duration: '',
          category: '',
          image: '',
          requirements: [],
          availableTimeSlots: [],
          rating: 4.5,
          reviews: 0,
          occasions: [],
          pandits: [],
          pujaTimeline: [],
          expandableSections: [],
          serviceTiers: {}
        });
      });
    }
    
    setShowPujaModal(true);
  };

  const handleClosePujaModal = () => {
    setShowPujaModal(false);
    setEditingPuja(null);
  };

  const handlePujaFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'requirements' || name === 'availableTimeSlots' ) {
      // Handle arrays by splitting the comma-separated string
      setPujaForm({
        ...pujaForm,
        [name]: value.split(',').map(item => item.trim()).filter(item => item !== '')
      });
    } else if (name === 'price' || name === 'rating' || name === 'reviews') {
      // Handle numeric fields
      setPujaForm({
        ...pujaForm,
        [name]: parseFloat(value) || 0
      });
    } else {
      // Handle other fields
      setPujaForm({
        ...pujaForm,
        [name]: value
      });
    }
  };

  const handleSavePuja = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Use the form data directly
      const pujaData = {
        ...pujaForm
      };
      
      if (editingPuja) {
        console.log('Updating existing puja with ID:', editingPuja.id);
        
        await updatePuja(editingPuja.id, pujaData);
        toast.success('Puja updated successfully');
      } else {
        console.log('Adding new puja with internal ID field:', pujaForm.id);
        
        // Add new puja with all fields including id
        const newPuja = await addPuja(pujaData);
        console.log('New puja created with Firestore document ID:', newPuja.id);
        toast.success('Puja added successfully');
      }
      
      // Close modal and refresh pujas
      handleClosePujaModal();
      await fetchPujas();
      setLoading(false);
    } catch (error) {
      console.error('Error saving puja:', error);
      toast.error(`Failed to save puja: ${error.message}`);
      setLoading(false);
    }
  };

  const handleDeletePuja = async (pujaId) => {
    if (window.confirm('Are you sure you want to delete this puja? This action cannot be undone.')) {
      try {
        setLoading(true);
        console.log(`Deleting puja with ID: ${pujaId}`);
        
        await deletePuja(pujaId);
        toast.success('Puja deleted successfully');
        await fetchPujas();
        setLoading(false);
      } catch (error) {
        console.error('Error deleting puja:', error);
        toast.error(`Failed to delete puja: ${error.message}`);
        setLoading(false);
      }
    }
  };

  const renderPujasTab = () => {
    // Filter pujas based on the current filter settings
    const filteredPujas = pujas.filter(puja => {
      const nameMatch = puja.name?.toLowerCase().includes(filterName.toLowerCase()) || filterName === '';
      const categoryMatch = puja.category === filterCategory || filterCategory === '';
      
      // Price range filtering
      const priceMatch = (
        (minPrice === '' || puja.price >= parseInt(minPrice)) &&
        (maxPrice === '' || puja.price <= parseInt(maxPrice))
      );
      
      return nameMatch && categoryMatch && priceMatch;
    });

    // Determine if filters are active
    const isFiltering = filterName !== '' || filterCategory !== '' || minPrice !== '' || maxPrice !== '';

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Manage Pujas</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => handleOpenPujaModal()}
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add New Puja
            </button>
          </div>
        </div>

        {/* Filter section */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Search by Name
            </label>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Search pujas..."
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price Range (₹)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
              />
              <span className="flex items-center">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterName('');
                setFilterCategory('');
                setMinPrice('');
                setMaxPrice('');
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results count display */}
        {!loading && (
          <div className="mb-2 text-sm text-gray-500">
            {isFiltering ? (
              <>
                Showing <span className="font-semibold">{filteredPujas.length}</span> of <span className="font-semibold">{pujas.length}</span> pujas
                {filterCategory && <span> in category <span className="font-semibold">{filterCategory}</span></span>}
                {filterName && <span> matching "<span className="font-semibold">{filterName}</span>"</span>}
                {(minPrice || maxPrice) && (
                  <span>
                    {' '}with price {minPrice && <span>from <span className="font-semibold">₹{minPrice}</span></span>}
                    {minPrice && maxPrice && ' '}
                    {maxPrice && <span>up to <span className="font-semibold">₹{maxPrice}</span></span>}
                  </span>
                )}
              </>
            ) : (
              <>
                Showing all <span className="font-semibold">{pujas.length}</span> pujas
              </>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading pujas...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPujas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      {pujas.length === 0 ? 
                        "No pujas found. Click \"Add New Puja\" to create one." : 
                        "No pujas match the current filters."}
                    </td>
                  </tr>
                ) : (
                  filteredPujas.map((puja, index) => (
                    <tr key={`puja-${puja.id}-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={puja.image || '/images/placeholder.jpg'} alt={puja.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{puja.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{puja.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{puja.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{puja.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          {puja.rating}
                          <FontAwesomeIcon icon={faStar} className="ml-1 text-yellow-400" />
                          <span className="ml-1 text-gray-500">({puja.reviews})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleOpenPujaModal(puja)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDeletePuja(puja.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Puja Modal */}
        <AdminPujaModal
          showPujaModal={showPujaModal}
          editingPuja={editingPuja}
          pujaForm={pujaForm}
          setPujaForm={setPujaForm}
          handlePujaFormChange={handlePujaFormChange}
          handleSavePuja={handleSavePuja}
          handleClosePujaModal={handleClosePujaModal}
          loading={loading}
        />
      </div>
    );
  };

  // User detail modal
  const renderUserDetailModal = () => {
    if (!showUserModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {viewingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <button
              onClick={() => setShowUserModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <div className="p-6 overflow-y-auto">
            <form onSubmit={handleSaveUser}>
              {/* User Details Section */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-4">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userForm.name}
                      onChange={handleUserFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Email*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userForm.email}
                      onChange={handleUserFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={userForm.phone}
                      onChange={handleUserFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={userForm.role}
                      onChange={handleUserFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="vendor">Vendor</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={userForm.status}
                    onChange={handleUserFormChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>

              {/* Address Section */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-700 border-b pb-2 mb-4">Address Information</h4>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={userForm.address}
                    onChange={handleUserFormChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="3"
                  ></textarea>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={userForm.city}
                      onChange={handleUserFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={userForm.state}
                      onChange={handleUserFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={userForm.pincode}
                      onChange={handleUserFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={userForm.notes}
                  onChange={handleUserFormChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="Additional notes about this user..."
                ></textarea>
              </div>

              {/* Activity Summary (view only) */}
              {viewingUser && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">User Activity</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Joined</p>
                      <p className="font-medium">
                        {(() => {
                          try {
                            if (!viewingUser.createdAt) return 'Unknown';
                            
                            if (typeof viewingUser.createdAt === 'object' && 
                                typeof viewingUser.createdAt.toDate === 'function') {
                              return viewingUser.createdAt.toDate().toLocaleDateString();
                            }
                            
                            if (viewingUser.createdAt instanceof Date) {
                              return viewingUser.createdAt.toLocaleDateString();
                            }
                            
                            // Last resort - try to parse as date string
                            return new Date(viewingUser.createdAt).toLocaleDateString();
                          } catch (err) {
                            console.error('Error formatting createdAt date:', err, viewingUser.createdAt);
                            return 'Unknown';
                          }
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Login</p>
                      <p className="font-medium">
                        {(() => {
                          try {
                            if (!viewingUser.lastLogin) return 'Never';
                            
                            if (typeof viewingUser.lastLogin === 'object' && 
                                typeof viewingUser.lastLogin.toDate === 'function') {
                              return viewingUser.lastLogin.toDate().toLocaleDateString();
                            }
                            
                            if (viewingUser.lastLogin instanceof Date) {
                              return viewingUser.lastLogin.toLocaleDateString();
                            }
                            
                            // Last resort - try to parse as date string
                            return new Date(viewingUser.lastLogin).toLocaleDateString();
                          } catch (err) {
                            console.error('Error formatting lastLogin date:', err, viewingUser.lastLogin);
                            return 'Never';
                          }
                        })()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Orders</p>
                      <p className="font-medium">{viewingUser.orderCount || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6 sticky bottom-0 bg-white py-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Function to filter and sort users
  const getFilteredUsers = () => {
    if (!allUsers) return [];
    
    let filteredUsers = [...allUsers];
    
    // Apply search filter
    if (userSearchTerm.trim()) {
      const searchLower = userSearchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        (user.email && user.email.toLowerCase().includes(searchLower)) ||
        (user.phone && user.phone.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter - with debug logging
    if (userStatusFilter) {
      console.log(`Filtering by status: ${userStatusFilter}`);
      console.log('Before status filter:', filteredUsers.length, 'users');
      console.log('Sample statuses:', filteredUsers.slice(0, 5).map(u => u.status));
      
      filteredUsers = filteredUsers.filter(user => {
        const matches = user.status === userStatusFilter;
        return matches;
      });
      
      console.log('After status filter:', filteredUsers.length, 'users');
    }
    
    // Apply role filter
    if (userRoleFilter) {
      filteredUsers = filteredUsers.filter(user => user.role === userRoleFilter);
    }
    
    // Apply sorting
    filteredUsers.sort((a, b) => {
      switch (userSortOption) {
        case 'oldest':
          return new Date(a.createdAt?.toDate?.() || a.createdAt || 0) - new Date(b.createdAt?.toDate?.() || b.createdAt || 0);
        case 'name_asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name_desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'newest':
        default:
          return new Date(b.createdAt?.toDate?.() || b.createdAt || 0) - new Date(a.createdAt?.toDate?.() || a.createdAt || 0);
      }
    });
    
    return filteredUsers;
  };
  
  // Handle select all users
  const handleSelectAllUsers = (e) => {
    const isChecked = e.target.checked;
    setIsAllUsersSelected(isChecked);
    
    if (isChecked) {
      // Get all IDs from the current filtered view
      const allFilteredIds = getFilteredUsers().map(user => user.id);
      console.log('Selecting all filtered users:', allFilteredIds.length);
      setSelectedUserIds(allFilteredIds);
    } else {
      console.log('Deselecting all users');
      setSelectedUserIds([]);
    }
  };
  
  // Handle individual user selection
  const handleUserCheckboxSelection = (userId) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        // Deselect user
        const newSelection = prev.filter(id => id !== userId);
        // Also update the "select all" checkbox
        setIsAllUsersSelected(false);
        return newSelection;
      } else {
        // Select user
        const newSelection = [...prev, userId];
        // If all visible users are now selected, check the "select all" box
        const allFilteredIds = getFilteredUsers().map(user => user.id);
        const allSelected = allFilteredIds.every(id => newSelection.includes(id));
        setIsAllUsersSelected(allSelected);
        return newSelection;
      }
    });
  };
  
  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedUserIds.length === 0) {
      toast.error('No users selected');
      return;
    }
    
    console.log(`Executing bulk action '${action}' on ${selectedUserIds.length} users`);
    console.log('Selected user IDs:', selectedUserIds);
    
    try {
      if (action === 'ban') {
        if (window.confirm(`Are you sure you want to ban ${selectedUserIds.length} users?`)) {
          setLoading(true);
          for (const userId of selectedUserIds) {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { 
              status: 'banned',
              updatedAt: new Date()
            });
            console.log(`User ${userId} banned successfully`);
          }
          toast.success(`${selectedUserIds.length} users banned successfully`);
          setLoading(false);
        }
      } else if (action === 'activate') {
        if (window.confirm(`Are you sure you want to activate ${selectedUserIds.length} users?`)) {
          setLoading(true);
          for (const userId of selectedUserIds) {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { 
              status: 'active',
              updatedAt: new Date()
            });
            console.log(`User ${userId} activated successfully`);
          }
          toast.success(`${selectedUserIds.length} users activated successfully`);
          setLoading(false);
        }
      } else if (action === 'email') {
        // Just show an info message for email action - would be implemented with your email service
        toast.info(`Preparing to email ${selectedUserIds.length} users...`);
        
        // Here you would implement the actual email sending functionality
        // For demonstration, we'll just log the selected users
        const selectedUsers = allUsers.filter(user => selectedUserIds.includes(user.id));
        console.log('Would email these users:', selectedUsers.map(u => u.email));
        
        toast.success('Email preparation complete!');
      }
      
      // Refresh dashboard data and clear selection
      await fetchAllUsers();
      setSelectedUserIds([]);
      setIsAllUsersSelected(false);
      setUserCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      toast.error(`Failed to ${action} users: ${error.message}`);
      setLoading(false);
    }
  };
  
  // Clear all user filters
  const clearUserFilters = () => {
    setUserSearchTerm('');
    setUserStatusFilter('');
    setUserRoleFilter('');
    setUserSortOption('newest');
    setSelectedUserIds([]);
    setIsAllUsersSelected(false);
    setUserCurrentPage(1);
  };
  
  // Add effect to reset to page 1 when filters change
  useEffect(() => {
    setUserCurrentPage(1);
  }, [userSearchTerm, userStatusFilter, userRoleFilter, userSortOption]);

  // Helper function to safely format dates 
  const safeFormatDate = (dateValue) => {
    if (!dateValue) return null;
    
    try {
      // For Firestore Timestamp objects
      if (typeof dateValue.toDate === 'function') {
        return dateValue.toDate().toLocaleDateString();
      }
      
      // For Date objects
      if (dateValue instanceof Date) {
        return dateValue.toLocaleDateString();
      }
      
      // For strings/numbers
      return new Date(dateValue).toLocaleDateString();
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getAllProducts();
      console.log('Fetched products:', productsData);
      setProducts(productsData);
      
      // Extract unique categories for filters
      const categories = [...new Set(productsData.map(product => product.category))];
      setUniqueCategories(categories);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      setLoading(false);
    }
  };

  // Fetch all pandits
  const fetchPandits = async () => {
    try {
      setLoading(true);
      const panditsData = await getAllPandits();
      setPandits(panditsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pandits:', error);
      toast.error('Failed to fetch pandits');
      setLoading(false);
    }
  };

  // Handle product modal open
  const handleOpenProductModal = (product = null) => {
    console.log('Opening product modal with product:', product);
    
    if (product) {
      // Editing existing product
      console.log('Editing product with Firestore ID:', product.firestoreId);
      
      // Ensure we have a valid Firestore ID for editing
      if (!product.firestoreId) {
        console.error('Product has no valid Firestore ID for editing');
        toast.error('Cannot edit this product: No valid Firestore ID found. Please add it as a new product.');
        return;
      }
      
      setEditingProduct(product);
      setProductForm({
        id: product.id || '', // Custom ID field
        name: product.name || '',
        description: product.description || '',
        longDescription: product.longDescription || '',
        price: product.price || 0,
        category: product.category || '',
        image: product.image || '',
        stock: product.stock || 0,
        featured: product.featured || false,
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        discount: product.discount || 0,
        sku: product.sku || '',
        mpn: product.mpn || '',
        weight: product.weight || '',
        dimensions: product.dimensions || '',
        material: product.material || '',
        brand: product.brand || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        isWishlisted: product.isWishlisted || false,
        // Array fields - ensure they are arrays
        additionalImages: Array.isArray(product.additionalImages) ? product.additionalImages : [],
        features: Array.isArray(product.features) ? product.features : [],
        requirements: Array.isArray(product.requirements) ? product.requirements : [],
        availableTimeSlots: Array.isArray(product.availableTimeSlots) ? product.availableTimeSlots : [],
        occasions: Array.isArray(product.occasions) ? product.occasions : [],
        pandits: Array.isArray(product.pandits) ? product.pandits : [],
        keyMantras: Array.isArray(product.keyMantras) ? product.keyMantras : [],
        ritualSteps: Array.isArray(product.ritualSteps) ? product.ritualSteps : [],
        // Text fields
        spiritualSignificance: product.spiritualSignificance || '',
        placementGuide: product.placementGuide || '',
        careInstructions: product.careInstructions || '',
        duration: product.duration || '',
        // SEO fields
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        seoKeywords: product.seoKeywords || '',
        canonicalUrl: product.canonicalUrl || '',
        breadcrumbSchema: product.breadcrumbSchema || '',
        productSchema: product.productSchema || ''
      });
    } else {
      // Adding new product
      console.log('Adding new product');
      setEditingProduct(null);
      setProductForm({
        id: '',
        name: '',
        description: '',
        longDescription: '',
        price: 0,
        category: '',
        image: '',
        stock: 0,
        featured: false,
        rating: 4.5,
        reviews: 0,
        discount: 0,
        sku: '',
        mpn: '',
        weight: '',
        dimensions: '',
        material: '',
        brand: '',
        inStock: true,
        isWishlisted: false,
        additionalImages: [],
        features: [],
        requirements: [],
        availableTimeSlots: [],
        occasions: [],
        pandits: [],
        keyMantras: [],
        ritualSteps: [],
        spiritualSignificance: '',
        placementGuide: '',
        careInstructions: '',
        duration: '',
        seoTitle: '',
        seoDescription: '',
        seoKeywords: '',
        canonicalUrl: '',
        breadcrumbSchema: '',
        productSchema: ''
      });
    }
    setShowProductModal(true);
  };

  // Handle product modal close
  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  // Handle product form change
  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  // Handle save product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('Saving product with data:', productForm);
      console.log('Editing product:', editingProduct);
      
      if (editingProduct) {
        console.log('Updating existing product with Firestore ID:', editingProduct.firestoreId);
        
        // Check if we have a valid Firestore ID for updating
        if (!editingProduct.firestoreId) {
          console.error('No valid Firestore ID found for editing product');
          toast.error('Cannot update product: No valid Firestore ID found. Please try adding it as a new product.');
          setLoading(false);
          return;
        }
        
        // Update existing product using Firestore document ID
        await updateProduct(editingProduct.firestoreId, productForm);
        toast.success('Product updated successfully');
      } else {
        console.log('Adding new product');
        // Add new product
        await addProduct(productForm);
        toast.success('Product added successfully');
      }
      
      // Refresh products list
      await fetchProducts();
      handleCloseProductModal();
      setLoading(false);
    } catch (error) {
      console.error('Error saving product:', error);
      // Show more detailed error message
      if (error.message.includes('No document to update')) {
        toast.error('Product not found. Please try adding it as a new product.');
      } else {
        toast.error(`Failed to save product: ${error.message}`);
      }
      setLoading(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await deleteProduct(productId);
        toast.success('Product deleted successfully');
        await fetchProducts();
        setLoading(false);
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
        setLoading(false);
      }
    }
  };

  // Products tab UI
  const renderProductsTab = () => {
    // Filter products based on filters
    const filteredProducts = products
      .filter(product => 
        product.name.toLowerCase().includes(filterName.toLowerCase()) &&
        (filterCategory === '' || product.category === filterCategory) &&
        (minPrice === '' || product.price >= parseFloat(minPrice)) &&
        (maxPrice === '' || product.price <= parseFloat(maxPrice))
      );
      
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Product Management</h2>
          <div className="flex gap-2">
            {/* Cleanup button commented out - functionality moved to automatic cleanup
            <button
              onClick={handleCleanupProducts}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faDatabase} className="mr-2" />
              {loading ? 'Cleaning...' : 'Cleanup Products'}
            </button>
            */}
            <button
              onClick={() => handleOpenProductModal()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add New Product
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Search by name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price (₹)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Min price..."
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price (₹)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Max price..."
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>
        
        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr key={product.firestoreId || `product-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.image || 'https://via.placeholder.com/150'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{product.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenProductModal(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.firestoreId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Product Modal
  const renderProductModal = () => {
    return (
      <AdminProductModal
        showProductModal={showProductModal}
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        handleProductFormChange={handleProductFormChange}
        handleSaveProduct={handleSaveProduct}
        handleCloseProductModal={handleCloseProductModal}
        loading={loading}
        uniqueCategories={uniqueCategories}
      />
    );
  };

  // Handle pandit modal open
  const handleOpenPanditModal = (pandit = null) => {
    if (pandit) {
      // Editing existing pandit
      setEditingPandit(pandit);
      setPanditForm({
        id: pandit.id || '',
        name: pandit.name || '',
        description: pandit.description || '',
        image: pandit.image || '',
        location: pandit.location || '',
        experience: pandit.experience || 0,
        specializations: pandit.specializations || [],
        languages: pandit.languages || [],
        availability: pandit.availability !== false,
        rating: pandit.rating || 4.5,
        reviews: pandit.reviews || 0,
        contactNumber: pandit.contactNumber || '',
        email: pandit.email || ''
      });
    } else {
      // Adding new pandit
      setEditingPandit(null);
      setPanditForm({
        id: '',
        name: '',
        description: '',
        image: '',
        location: '',
        experience: 0,
        specializations: [],
        languages: [],
        availability: true,
        rating: 4.5,
        reviews: 0,
        contactNumber: '',
        email: ''
      });
    }
    setShowPanditModal(true);
  };

  // Handle pandit modal close
  const handleClosePanditModal = () => {
    setShowPanditModal(false);
    setEditingPandit(null);
  };

  // Handle pandit form change
  const handlePanditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'specializations' || name === 'languages') {
      // Handle array inputs (comma-separated values)
      setPanditForm(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim())
      }));
    } else {
      setPanditForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : 
                type === 'number' ? parseFloat(value) : value
      }));
    }
  };

  // Handle save pandit
  const handleSavePandit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingPandit) {
        // Update existing pandit
        await updatePandit(editingPandit.id, panditForm);
        toast.success('Pandit updated successfully');
      } else {
        // Add new pandit
        await addPandit(panditForm);
        toast.success('Pandit added successfully');
      }
      
      // Refresh pandits list
      await fetchPandits();
      handleClosePanditModal();
      setLoading(false);
    } catch (error) {
      console.error('Error saving pandit:', error);
      toast.error('Failed to save pandit');
      setLoading(false);
    }
  };

  // Handle delete pandit
  const handleDeletePandit = async (panditId) => {
    if (window.confirm('Are you sure you want to delete this pandit?')) {
      try {
        setLoading(true);
        await deletePandit(panditId);
        toast.success('Pandit deleted successfully');
        await fetchPandits();
        setLoading(false);
      } catch (error) {
        console.error('Error deleting pandit:', error);
        toast.error('Failed to delete pandit');
        setLoading(false);
      }
    }
  };

  // Pandits tab UI
  const renderPanditsTab = () => {
    // Filter pandits based on filters
    const filteredPandits = pandits
      .filter(pandit => 
        pandit.name?.toLowerCase().includes(filterName.toLowerCase()) ||
        pandit.location?.toLowerCase().includes(filterName.toLowerCase())
      );
      
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Pandit Management</h2>
          <button
            onClick={() => handleOpenPanditModal()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add New Pandit
          </button>
        </div>
        
        {/* Filters */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search by Name or Location
          </label>
          <input
            type="text"
            className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2"
            placeholder="Search pandits..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>
        
        {/* Pandits Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pandit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specializations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPandits.length > 0 ? (
                filteredPandits.map((pandit) => (
                  <tr key={pandit.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={pandit.image || 'https://via.placeholder.com/150'}
                            alt={pandit.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {pandit.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {pandit.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pandit.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pandit.experience} years</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {pandit.specializations?.map((spec, index) => (
                          <span key={index} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pandit.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {pandit.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenPanditModal(pandit)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeletePandit(pandit.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No pandits found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Pandit Modal
  const renderPanditModal = () => {
    return (
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center ${
        showPanditModal ? 'block' : 'hidden'
      }`}>
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {editingPandit ? 'Edit Pandit' : 'Add New Pandit'}
          </h2>
          <form onSubmit={handleSavePandit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={panditForm.name}
                  onChange={handlePanditFormChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={panditForm.location}
                  onChange={handlePanditFormChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={panditForm.experience}
                  onChange={handlePanditFormChange}
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={panditForm.image}
                  onChange={handlePanditFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={panditForm.contactNumber}
                  onChange={handlePanditFormChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={panditForm.email}
                  onChange={handlePanditFormChange}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specializations (comma-separated)
                </label>
                <input
                  type="text"
                  name="specializations"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={panditForm.specializations.join(', ')}
                  onChange={handlePanditFormChange}
                  placeholder="e.g. Vedic, Vastu, Marriage, Homam"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={panditForm.languages.join(', ')}
                  onChange={handlePanditFormChange}
                  placeholder="e.g. Hindi, English, Sanskrit, Tamil"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="availability"
                  id="availability"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={panditForm.availability}
                  onChange={handlePanditFormChange}
                />
                <label htmlFor="availability" className="ml-2 block text-sm text-gray-900">
                  Available for Bookings
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={panditForm.description}
                onChange={handlePanditFormChange}
                required
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleClosePanditModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Pandit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
      <div className="container mx-auto px-4 py-6">
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
                  onClick={() => setActiveTab('utrPayments')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'utrPayments'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                  UTR Payments
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
                  onClick={() => setActiveTab('testimonials')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'testimonials'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                  Testimonials
                </button>
                <button
                  onClick={() => {
                    setActiveTab('pujas');
                    // Immediately try to load pujas data when tab is clicked
                    fetchPujas();
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'pujas'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faPray} className="mr-2" />
                  Pujas
                </button>
                <button
                  onClick={() => {
                    setActiveTab('products');
                    // Immediately try to load products data when tab is clicked
                    fetchProducts();
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'products'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                  Products
                </button>
                <button
                  onClick={() => {
                    setActiveTab('pandits');
                    // Immediately try to load pandits data when tab is clicked
                    fetchPandits();
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'pandits'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faPray} className="mr-2" />
                  Pandits
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
                  onClick={() => setActiveTab('codes')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'codes'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faGift} className="mr-2" />
                  Codes
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'notifications'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('homeContent')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'homeContent'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2" />
                  Home Content
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'leads'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Leads
                </button>
                <button
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    activeTab === 'horoscope' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    navigate('/admin/horoscope', { state: { fromAdmin: true } });
                  }}
                >
                  <FontAwesomeIcon icon={faStar} className="mr-2" />
                  <span>Horoscope</span>
                </button>
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'admins'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  Manage Admins
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
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
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <FontAwesomeIcon icon={faUser} className="text-teal-500 text-xl" />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500">Leads</p>
                    <p className="text-2xl font-bold">{stats.totalLeads}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">User Management</h2>
                  <div className="flex space-x-2">
                    <button 
                      className="bg-green-600 text-white px-3 py-2 rounded-md flex items-center text-sm"
                      onClick={() => window.confirm('Export user data to CSV?') && console.log('Export users')}
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Export Users
                    </button>
                    <button className="bg-orange-500 text-white px-3 py-2 rounded-md flex items-center text-sm">
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Add User
                    </button>
                  </div>
                </div>

                {/* Advanced Filter Section */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Search Users
                      </label>
                      <input
                        type="text"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        placeholder="Search by name, email, or phone..."
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="w-40">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Status
                      </label>
                      <select 
                        value={userStatusFilter}
                        onChange={(e) => setUserStatusFilter(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="banned">Banned</option>
                        <option value="unverified">Unverified</option>
                      </select>
                    </div>
                    <div className="w-40">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Role
                      </label>
                      <select 
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="vendor">Vendor</option>
                      </select>
                    </div>
                    <div className="w-40">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Sort By
                      </label>
                      <select 
                        value={userSortOption}
                        onChange={(e) => setUserSortOption(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name_asc">Name (A-Z)</option>
                        <option value="name_desc">Name (Z-A)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="selectAll" 
                        className="mr-2" 
                        checked={isAllUsersSelected}
                        onChange={handleSelectAllUsers}
                      />
                      <label htmlFor="selectAll" className="text-sm text-gray-700">Select All</label>
                      
                      {selectedUserIds.length > 0 && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                          {selectedUserIds.length} selected
                        </span>
                      )}
                      
                      <div className="ml-4 flex space-x-2">
                        <button 
                          className={`bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200 ${selectedUserIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => handleBulkAction('ban')}
                          disabled={selectedUserIds.length === 0}
                        >
                          Ban Selected
                        </button>
                        <button 
                          className={`bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 ${selectedUserIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => handleBulkAction('activate')}
                          disabled={selectedUserIds.length === 0}
                        >
                          Activate Selected
                        </button>
                        <button 
                          className={`bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 ${selectedUserIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => handleBulkAction('email')}
                          disabled={selectedUserIds.length === 0}
                        >
                          Email Selected
                        </button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {(userSearchTerm || userStatusFilter || userRoleFilter || userSortOption !== 'newest') && (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                          Filters applied
                        </span>
                      )}
                      <button 
                        className="text-sm text-gray-600 hover:text-gray-800"
                        onClick={clearUserFilters}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="w-10 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input type="checkbox" />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
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
                      {getCurrentPageUsers().map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input 
                              type="checkbox" 
                              checked={selectedUserIds.includes(user.id)}
                              onChange={() => handleUserCheckboxSelection(user.id)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {user.photoURL ? (
                                  <img
                                    src={user.photoURL}
                                    alt={user.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xl">{user.name?.[0]}</span>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">{user.role || 'User'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div>Last login: {
                              (() => {
                                try {
                                  if (!user.lastLogin) return 'Never';
                                  
                                  if (typeof user.lastLogin === 'object' && 
                                      typeof user.lastLogin.toDate === 'function') {
                                    return user.lastLogin.toDate().toLocaleDateString();
                                  }
                                  
                                  if (user.lastLogin instanceof Date) {
                                    return user.lastLogin.toLocaleDateString();
                                  }
                                  
                                  return new Date(user.lastLogin).toLocaleDateString();
                                } catch (err) {
                                  console.error('Error formatting lastLogin date:', err, user.lastLogin);
                                  return 'Never';
                                }
                              })()
                            }</div>
                            <div>Joined: {
                              (() => {
                                try {
                                  if (!user.createdAt) return 'Unknown';
                                  
                                  if (typeof user.createdAt === 'object' && 
                                      typeof user.createdAt.toDate === 'function') {
                                    return user.createdAt.toDate().toLocaleDateString();
                                  }
                                  
                                  if (user.createdAt instanceof Date) {
                                    return user.createdAt.toLocaleDateString();
                                  }
                                  
                                  return new Date(user.createdAt).toLocaleDateString();
                                } catch (err) {
                                  console.error('Error formatting createdAt date:', err, user.createdAt);
                                  return 'Unknown';
                                }
                              })()
                            }</div>
                            <div>Orders: {user.orderCount || 0}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : user.status === 'banned'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {user.status || 'active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUserAction(user.id, 'view')}
                                className="text-blue-600 hover:text-blue-900"
                                title="View Details"
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
                                className={`${
                                  user.status === 'active' 
                                    ? 'text-orange-600 hover:text-orange-900' 
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                                title={user.status === 'active' ? 'Ban User' : 'Activate User'}
                              >
                                <FontAwesomeIcon
                                  icon={user.status === 'active' ? faBan : faCheck}
                                />
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'delete')}
                                className="text-red-600 hover:text-red-900"
                                title="Delete User"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6 bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button 
                      onClick={() => handleUserPageChange(Math.max(1, userCurrentPage - 1))}
                      disabled={userCurrentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => handleUserPageChange(Math.min(getTotalUserPages(), userCurrentPage + 1))}
                      disabled={userCurrentPage === getTotalUserPages()}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(userCurrentPage - 1) * usersPerPage + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(userCurrentPage * usersPerPage, getFilteredUsers().length)}
                        </span> of{' '}
                        <span className="font-medium">{getFilteredUsers().length}</span> users
                        {getFilteredUsers().length !== allUsers.length && (
                          <span className="text-gray-500"> (filtered from {allUsers.length} total)</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Previous button */}
                        <button
                          onClick={() => handleUserPageChange(Math.max(1, userCurrentPage - 1))}
                          disabled={userCurrentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          &laquo;
                        </button>
                        
                        {/* Page numbers */}
                        {[...Array(getTotalUserPages())].map((_, index) => {
                          const pageNumber = index + 1;
                          // Only show first 2 pages, last 2 pages, current page, and pages adjacent to current
                          const shouldShowPage = 
                            pageNumber <= 2 || 
                            pageNumber >= getTotalUserPages() - 1 || 
                            Math.abs(pageNumber - userCurrentPage) <= 1;
                          
                          // Show ellipsis after page 2 if there's a gap
                          const showLeftEllipsis = pageNumber === 3 && userCurrentPage > 4;
                          
                          // Show ellipsis before the last two pages if there's a gap
                          const showRightEllipsis = pageNumber === getTotalUserPages() - 2 && userCurrentPage < getTotalUserPages() - 3;
                          
                          if (shouldShowPage) {
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handleUserPageChange(pageNumber)}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                                  pageNumber === userCurrentPage
                                    ? 'bg-orange-50 text-orange-500 hover:bg-orange-100'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          } else if (showLeftEllipsis || showRightEllipsis) {
                            return (
                              <span
                                key={`ellipsis-${pageNumber}`}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                              >
                                ...
                              </span>
                            );
                          }
                          
                          return null;
                        })}
                        
                        {/* Next button */}
                        <button
                          onClick={() => handleUserPageChange(Math.min(getTotalUserPages(), userCurrentPage + 1))}
                          disabled={userCurrentPage === getTotalUserPages()}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          &raquo;
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <BookingManagementTab />
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
                            <div className="text-sm text-gray-900">
                              {typeof order.customerName === 'string' 
                                ? order.customerName 
                                : order.userName || 'Customer'
                              }
                            </div>
                            <div className="text-sm text-gray-500">
                              {typeof order.shippingAddress === 'string' 
                                ? order.shippingAddress 
                                : order.shippingAddress?.address 
                                  ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}`
                                  : 'Address not provided'
                              }
                            </div>
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

            {activeTab === 'utrPayments' && (
              <AdminUTRPaymentsTab />
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

            {activeTab === 'pujas' && renderPujasTab()}

          {activeTab === 'products' && renderProductsTab()}

          {activeTab === 'pandits' && renderPanditsTab()}
          
          {activeTab === 'testimonials' && (
            <AdminTestimonialsTab />
          )}
          
          {activeTab === 'homeContent' && (
            <AdminHomeContentTab />
          )}

          {activeTab === 'leads' && (
            <AdminLeadsTab />
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
            {activeTab === 'admins' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Manage Admins</h2>
            
<div className="mb-4 flex flex-col md:flex-row md:items-center gap-2">
  <div className="flex gap-2">
    <button
      className={`px-3 py-1 rounded ${adminFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      onClick={() => setAdminFilter('all')}
    >
      All
    </button>
    <button
      className={`px-3 py-1 rounded ${adminFilter === 'admin' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      onClick={() => setAdminFilter('admin')}
    >
      Admins
    </button>
    <button
      className={`px-3 py-1 rounded ${adminFilter === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
      onClick={() => setAdminFilter('user')}
    >
      Non-admins
    </button>
  </div>
    <input
    type="text"
    value={adminSearch}
    onChange={e => setAdminSearch(e.target.value)}
    placeholder="Search by name or email"
    className="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
    style={{ maxWidth: 300 }}
  />
</div>

                <table className="min-w-full divide-y divide-gray-200 mb-6">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {allUsers
                    .filter(user => {
                      if (adminFilter === 'admin') return user.role === 'admin';
                      if (adminFilter === 'user') return user.role !== 'admin';
                      return true;
                    })
                    .filter(user => {
                      if (!adminSearch.trim()) return true;
                      const search = adminSearch.trim().toLowerCase();
                      return (
                        user.name?.toLowerCase().includes(search) ||
                        user.email?.toLowerCase().includes(search)
                      );
                    })
                    .map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.role === 'admin' ? 'Admin' : 'User'}</td>
                        <td className="px-6 py-4">
                          {user.role === 'admin' ? (
                            <button
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              onClick={async () => {
                                try {
                                  await demoteFromAdmin(user.id);
                                  toast.success('Admin rights removed');
                                  fetchDashboardData();
                                } catch (err) {
                                  toast.error('Failed to remove admin');
                                }
                              }}
                              disabled={user.id === currentUser?.uid}
                              title={user.id === currentUser?.uid ? "You can't remove yourself" : ""}
                            >
                              Remove Admin
                            </button>
                          ) : (
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              onClick={async () => {
                                try {
                                  await promoteToAdmin(user.id);
                                  toast.success('User promoted to admin');
                                  fetchDashboardData();
                                } catch (err) {
                                  toast.error('Failed to promote user');
                                }
                              }}
                            >
                              Make Admin
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'codes' && (
                            <AdminCodesTabs
                activeCodesTab={activeCodesTab}
                setActiveCodesTab={setActiveCodesTab}
                stats={stats}
                handleCreateReferralCode={handleCreateReferralCode}
                handleToggleReferralStatus={handleToggleReferralStatus}
                newReferralCode={newReferralCode}
                setNewReferralCode={setNewReferralCode}
                isCreatingCode={isCreatingCode}
                handleCreateCouponCode={handleCreateCouponCode}
                newCouponCode={newCouponCode}
                handleCouponInputChange={handleCouponInputChange}
                selectedUsers={selectedUsers}
                setNewCouponCode={setNewCouponCode}
                handleUserSelection={handleUserSelection}
                allUsers={allUsers}
                isCreatingCoupon={isCreatingCoupon}
                handleToggleCouponStatus={handleToggleCouponStatus}
              />
            )}

            {activeTab === 'notifications' && (
              <AdminNotificationsTab />
            )}
          </div>
        </div>
      </div>
      
      {/* Render the user detail modal */}
      {renderUserDetailModal()}
      {renderProductModal()}
      {renderPanditModal()}
    </div>
  );
};

export default AdminDashboard;