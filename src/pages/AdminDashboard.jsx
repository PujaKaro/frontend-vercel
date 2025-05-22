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
  faDatabase
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
import { 
  migrateDataToFirestore, 
  getAllPujas, 
  addPuja, 
  updatePuja, 
  deletePuja 
} from '../utils/dataUtils';


const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [activeCodesTab, setActiveCodesTab] = useState('referrals');
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
    selectAllUsers: true,
    assignedUsers: []
  });
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [pujas, setPujas] = useState([]);
  const [editingPuja, setEditingPuja] = useState(null);
  const [showPujaModal, setShowPujaModal] = useState(false);
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
    availableTimeSlots: []
  });
  const [isMigratingData, setIsMigratingData] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchDashboardData();
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

      // Extract user data for coupon assignment
      const userData = users.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || doc.data().displayName || 'User',
        email: doc.data().email || 'No email'
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
        availableTimeSlots: puja.availableTimeSlots || []
      });
    } else {
      setEditingPuja(null);
      setPujaForm({
        id: '',
        name: '',
        description: '',
        longDescription: '',
        price: 0,
        duration: '',
        category: '',
        image: '',
        requirements: [],
        availableTimeSlots: []
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
    
    if (name === 'requirements' || name === 'availableTimeSlots') {
      // Handle arrays by splitting the comma-separated string
      setPujaForm({
        ...pujaForm,
        [name]: value.split(',').map(item => item.trim())
      });
    } else if (name === 'price') {
      // Handle price as a number
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
      
      // Make sure required fields are filled
      if (!pujaForm.name || !pujaForm.description || !pujaForm.price) {
        toast.error('Please fill all required fields');
        setLoading(false);
        return;
      }
      
      // Prepare puja data - include all fields
      const pujaData = {
        ...pujaForm,
        rating: editingPuja?.rating || 4.5,
        reviews: editingPuja?.reviews || 0,
        occasions: editingPuja?.occasions || [],
        pandits: editingPuja?.pandits || []
      };
      
      if (editingPuja) {
        console.log('Updating existing puja with ID:', editingPuja.id);
        
        // Update existing puja
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
        
        // Ensure ID is a string but keep the original ID value
        const stringId = String(pujaId);
        console.log(`Deleting puja with ID: ${stringId}`);
        
        await deletePuja(stringId);
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

        {/* Puja Edit/Add Modal */}
        {showPujaModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="border-b px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingPuja ? 'Edit Puja' : 'Add New Puja'}
                </h3>
                <button
                  onClick={handleClosePujaModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <form onSubmit={handleSavePuja}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      ID (Internal Reference)
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={pujaForm.id}
                      onChange={handlePujaFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="e.g. 1, 2, 101"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This is saved as a field in the document, not as the document ID.
                    </p>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={pujaForm.name}
                      onChange={handlePujaFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Description*
                    </label>
                    <textarea
                      name="description"
                      value={pujaForm.description}
                      onChange={handlePujaFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Long Description
                    </label>
                    <textarea
                      name="longDescription"
                      value={pujaForm.longDescription}
                      onChange={handlePujaFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="6"
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Price (₹)*
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={pujaForm.price}
                        onChange={handlePujaFormChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        min="0"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={pujaForm.duration}
                        onChange={handlePujaFormChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="e.g. 2 hours"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={pujaForm.category}
                        onChange={handlePujaFormChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="image"
                        value={pujaForm.image}
                        onChange={handlePujaFormChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Requirements (comma-separated)
                    </label>
                    <textarea
                      name="requirements"
                      value={pujaForm.requirements.join(', ')}
                      onChange={handlePujaFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="3"
                      placeholder="e.g. Fresh flowers, Incense sticks, Ghee"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Available Time Slots (comma-separated)
                    </label>
                    <textarea
                      name="availableTimeSlots"
                      value={pujaForm.availableTimeSlots.join(', ')}
                      onChange={handlePujaFormChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows="3"
                      placeholder="e.g. Morning (6 AM - 8 AM), Evening (4 PM - 6 PM)"
                    ></textarea>
                  </div>
                  <div className="flex justify-end mt-6 sticky bottom-0 bg-white py-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClosePujaModal}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
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

            {activeTab === 'pujas' && renderPujasTab()}

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
    </div>
  );
};

export default AdminDashboard;