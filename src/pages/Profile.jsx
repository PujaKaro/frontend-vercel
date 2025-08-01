import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faLocationDot, faEdit, 
  faShoppingBag, faPray, faHistory, faAddressBook, 
  faSignOut, faCalendar, faClock, faRupeeSign,
  faBell, faHeart, faTicket, faGift, faCog,
  faStar, faQuestionCircle, faShare, faCheckCircle, faCreditCard,
  faEye, faCopy, faTimes, faLock, faCommentDots, faDownload, faFileInvoice
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import SEO from '../components/SEO';
import { getUserBookings, getUserOrders, getUserReferralCode, createReferralCode, getUserCoupons } from '../utils/firestoreUtils';
import toast from 'react-hot-toast';
import BookingReviewForm from '../components/BookingReviewForm';
import BookingInvoice from '../components/BookingInvoice';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);
  const [activatedServices, setActivatedServices] = useState([]);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState(null);
  const [referralStats, setReferralStats] = useState({
    totalUsed: 0,
    totalDiscountGiven: 0,
    totalRevenueGenerated: 0
  });
  const [referralCode, setReferralCode] = useState(null);
  const [userCoupons, setUserCoupons] = useState([]);
  const navigate = useNavigate();

  const getReferralCode = async () => {
    try {
      // First check completed bookings to determine if user is eligible for referral code
      const bookings = await getUserBookings(currentUser.uid);
      const hasCompletedBooking = bookings.some(booking => booking.status === 'completed');
      
      if (!hasCompletedBooking) {
        return;
      }
      
      // Check if user already has a referral code
      let userReferral = await getUserReferralCode(currentUser.uid);
      
      // If no referral code exists and user has completed bookings, create one
      if (!userReferral && hasCompletedBooking) {
        const referralCode = currentUser.displayName?.toLowerCase().replace(/[^a-z0-9]/g, '') || 
                            currentUser.uid.slice(0, 6);
        
        await createReferralCode({
          code: referralCode,
          userId: currentUser.uid,
          userName: currentUser.displayName || '',
          discountPercentage: 10,
          description: 'Friend referral',
          isActive: true
        });
        
        userReferral = await getUserReferralCode(currentUser.uid);
      }
      
      if (userReferral) {
        setReferralCode(userReferral);
        setReferralStats({
          totalUsed: userReferral.totalUsed || 0,
          totalDiscountGiven: userReferral.totalDiscountGiven || 0,
          totalRevenueGenerated: userReferral.totalRevenueGenerated || 0
        });
      }
    } catch (error) {
      console.error('Error handling referral code:', error);
    }
  };

  const getUserCouponCodes = async () => {
    try {
      if (currentUser) {
        const coupons = await getUserCoupons(currentUser.uid);
        setUserCoupons(coupons);
      }
    } catch (error) {
      console.error('Error fetching user coupons:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          setBookingsError(null);
          setOrdersError(null);

          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            calculateProfileProgress(data);
            
            // Load activated services from localStorage
            const savedServices = JSON.parse(localStorage.getItem('activatedServices') || '[]');
            setActivatedServices(savedServices);

            // Load saved cards from localStorage
            const savedCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
            setSavedCards(savedCards);

            try {
              // Fetch bookings from bookings collection
              const bookings = await getUserBookings(currentUser.uid);
              setUserBookings(bookings);
            } catch (bookingError) {
              console.error('Error fetching bookings:', bookingError);
              setBookingsError('Unable to load bookings. Please try again later.');
              setUserBookings([]);
            }

            try {
              // Fetch orders from orders collection
              const orders = await getUserOrders(currentUser.uid);
              setUserOrders(orders);
            } catch (orderError) {
              console.error('Error fetching orders:', orderError);
              setOrdersError('Unable to load orders. Please try again later.');
              setUserOrders([]);
            }

            // Get user's referral code
            await getReferralCode();
            
            // Get user's coupon codes
            await getUserCouponCodes();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const calculateProfileProgress = (data) => {
    let progress = 0;
    const fields = ['name', 'email', 'phone', 'photoURL', 'address'];
    fields.forEach(field => {
      if (data[field]) progress += 20;
    });
    setProfileProgress(progress);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prevData => ({
          ...prevData,
          photoURL: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update user data in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), userData);
      setEditMode(false);
      calculateProfileProgress(userData);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleRazorpayPayment = async (serviceName, amount) => {
    const options = {
      key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay test key
      amount: amount * 100, // amount in paise
      currency: 'INR',
      name: 'Puja Services',
      description: `Payment for ${serviceName}`,
      handler: function(response) {
        // Save the payment details and activate the service
        const newService = {
          name: serviceName,
          activatedOn: new Date().toISOString(),
          paymentId: response.razorpay_payment_id,
          amount: amount
        };
        
        const updatedServices = [...activatedServices, newService];
        setActivatedServices(updatedServices);
        localStorage.setItem('activatedServices', JSON.stringify(updatedServices));
        
        // Save card details if provided
        if (response.razorpay_payment_method === 'card') {
          const newCard = {
            last4: response.razorpay_payment_method_details.card.last4,
            brand: response.razorpay_payment_method_details.card.brand,
            expiry: response.razorpay_payment_method_details.card.expiry_month + '/' + 
                   response.razorpay_payment_method_details.card.expiry_year
          };
          
          const updatedCards = [...savedCards, newCard];
          setSavedCards(updatedCards);
          localStorage.setItem('savedCards', JSON.stringify(updatedCards));
        }
      },
      prefill: {
        name: userData?.name || '',
        email: userData?.email || '',
        contact: userData?.phone || ''
      },
      theme: {
        color: '#fb9548'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleCopyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode.code);
      toast.success('Referral code copied to clipboard!');
    }
  };

  const handleShareReferralCode = async () => {
    if (referralCode) {
      try {
        await navigator.share({
          title: 'PujaKaro Referral',
          text: `Use my referral code ${referralCode.code} to get ${referralCode.discountPercentage}% off on your first booking!`,
          url: window.location.origin
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleReviewSubmitted = (reviewId) => {
    // Update the booking in the list to show it has a review
    setUserBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === selectedBookingForReview.id
          ? { ...booking, hasReview: true, reviewId }
          : booking
      )
    );
    setShowReviewForm(false);
    setSelectedBookingForReview(null);
    
    // Close the booking modal as well
    setShowBookingModal(false);
    setSelectedBooking(null);
    
    toast.success("Thank you for your review! It will be reviewed by our team.");
  };

  const handleDownloadInvoice = (booking) => {
    setSelectedBookingForInvoice(booking);
    setShowInvoice(true);
  };

  const handleInvoiceActions = {
    onClose: () => setShowInvoice(false),
    onDownload: () => {
      // Create a new window for printing/downloading
      const printWindow = window.open('', '_blank');
      
      // Create clean print content without problematic icons
      const printContent = `
        <div class="invoice-container">
          <!-- Header -->
          <div class="header">
            <div class="header-content">
              <div class="company-info">
                <div>
                  <h1>Pujakaro</h1>
                  <p>Sacred Services & Spiritual Solutions</p>
                </div>
                <div class="mt-4">
                  <p>G-275, Molarband Extn.</p>
                  <p>Delhi - 110044</p>
                  <p>Phone: +91 7982545360</p>
                  <p>Email: info@pujakaro.in</p>
                </div>
              </div>
              <div class="invoice-info">
                <h2>INVOICE</h2>
                <div>
                  <p><strong>Invoice #:</strong> INV-${selectedBookingForInvoice.id.slice(-8).toUpperCase()}</p>
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                  <p><strong>Due Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                  <p><strong>Status:</strong> ${selectedBookingForInvoice.paymentStatus === 'received' ? 'Paid' : 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bill To Section -->
          <div class="bill-to">
            <div class="bill-to-grid">
              <div class="section">
                <h3>Bill To:</h3>
                <div>
                  <p class="customer-name">${selectedBookingForInvoice.userName}</p>
                  <p>Email: ${selectedBookingForInvoice.userEmail}</p>
                  <p>Phone: ${selectedBookingForInvoice.phone}</p>
                  <p>Address: ${selectedBookingForInvoice.address}, ${selectedBookingForInvoice.city}</p>
                  <p>${selectedBookingForInvoice.state} - ${selectedBookingForInvoice.pincode}</p>
                </div>
              </div>
              <div class="section">
                <h3>Service Details:</h3>
                <div>
                  <p><strong>Puja Name:</strong> ${selectedBookingForInvoice.pujaName}</p>
                  <p><strong>Puja ID:</strong> ${selectedBookingForInvoice.pujaId}</p>
                  <p><strong>Date:</strong> ${selectedBookingForInvoice.date instanceof Date ? selectedBookingForInvoice.date.toLocaleDateString() : selectedBookingForInvoice.date}</p>
                  <p><strong>Time:</strong> ${selectedBookingForInvoice.time}</p>
                  <p><strong>Booking ID:</strong> ${selectedBookingForInvoice.id}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div class="items-section">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <p class="service-name">${selectedBookingForInvoice.pujaName}</p>
                      <p class="service-desc">Puja service on ${selectedBookingForInvoice.date instanceof Date ? selectedBookingForInvoice.date.toLocaleDateString() : selectedBookingForInvoice.date} at ${selectedBookingForInvoice.time}</p>
                      ${selectedBookingForInvoice.specialInstructions ? `<p class="special-instructions"><strong>Special Instructions:</strong> ${selectedBookingForInvoice.specialInstructions}</p>` : ''}
                    </div>
                  </td>
                  <td class="amount">Rs. ${(selectedBookingForInvoice.price || 0).toLocaleString()}</td>
                </tr>
                ${selectedBookingForInvoice.discountApplied > 0 ? `
                  <tr class="discount-row">
                    <td>
                      <div>
                        <span class="discount-label">${selectedBookingForInvoice.discountType === 'coupon' ? 'Coupon Discount' : 'Discount'}</span>
                        ${selectedBookingForInvoice.referralCode ? `<span class="discount-code">(${selectedBookingForInvoice.referralCode})</span>` : ''}
                      </div>
                    </td>
                    <td class="discount-amount">-Rs. ${((selectedBookingForInvoice.price || 0) * selectedBookingForInvoice.discountApplied / 100).toLocaleString()}</td>
                  </tr>
                ` : ''}
              </tbody>
            </table>
          </div>

          <!-- Totals -->
          <div class="totals">
            <div class="totals-content">
              <div class="totals-table">
                <div class="row">
                  <span>Subtotal:</span>
                  <span>Rs. ${(selectedBookingForInvoice.price || 0).toLocaleString()}</span>
                </div>
                ${selectedBookingForInvoice.discountApplied > 0 ? `
                  <div class="row">
                    <span>Discount:</span>
                    <span class="discount-text">-Rs. ${((selectedBookingForInvoice.price || 0) * selectedBookingForInvoice.discountApplied / 100).toLocaleString()}</span>
                  </div>
                ` : ''}
                <div class="total-row">
                  <span>Total:</span>
                  <span class="total-amount">Rs. ${((selectedBookingForInvoice.price || 0) - ((selectedBookingForInvoice.price || 0) * (selectedBookingForInvoice.discountApplied || 0) / 100)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="payment-info">
            <h3>Payment Information</h3>
            <div class="payment-grid">
              <div>
                <p><strong>Payment Method:</strong> Online Payment / UPI</p>
              </div>
              <div>
                <p><strong>Payment Status:</strong> ${selectedBookingForInvoice.paymentStatus === 'received' ? 'Paid' : 'Pending'}</p>
              </div>
            </div>
          </div>

          <!-- Terms and Notes -->
          <div class="terms">
            <div class="terms-grid">
              <div>
                <h4>Terms & Conditions:</h4>
                <ul>
                  <li>Payment is due upon receipt of this invoice</li>
                  <li>Service will be provided as per scheduled date and time</li>
                  <li>Cancellation policy applies as per terms</li>
                  <li>For any queries, contact us at info@pujakaro.in</li>
                </ul>
              </div>
              <div>
                <h4>Notes:</h4>
                <p>Thank you for choosing Pujakaro for your spiritual needs.</p>
                <p>We appreciate your trust in our services.</p>
                ${selectedBookingForInvoice.additionalInfo ? `
                  <div class="additional-info">
                    <p class="label"><strong>Additional Information:</strong></p>
                    <p class="content">${selectedBookingForInvoice.additionalInfo}</p>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>© 2024 Pujakaro. All rights reserved. | Sacred Services & Spiritual Solutions</p>
          </div>
        </div>
      `;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${selectedBookingForInvoice.pujaName}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #f9fafb; 
              color: #111827; 
            }
            .invoice-container { 
              max-width: 800px; 
              margin: 0 auto; 
              background: white; 
              padding: 40px; 
              border-radius: 8px; 
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); 
            }
            .header { 
              border-bottom: 2px solid #f59e0b; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .header-content { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
            }
            .company-info h1 { 
              margin: 0 0 5px 0; 
              color: #f59e0b; 
              font-size: 32px; 
              font-weight: bold; 
            }
            .company-info p { 
              margin: 3px 0; 
              color: #6b7280; 
              font-size: 14px; 
            }
            .invoice-info { 
              text-align: right; 
            }
            .invoice-info h2 { 
              margin: 0 0 10px 0; 
              color: #111827; 
              font-size: 28px; 
            }
            .invoice-info p { 
              margin: 3px 0; 
              color: #6b7280; 
              font-size: 14px; 
            }
            .bill-to { 
              padding: 20px 0; 
              border-bottom: 1px solid #e5e7eb; 
            }
            .bill-to-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 30px; 
            }
            .section h3 { 
              margin: 0 0 15px 0; 
              color: #111827; 
              font-size: 18px; 
            }
            .section p { 
              margin: 5px 0; 
              color: #374151; 
              font-size: 14px; 
            }
            .customer-name {
              font-size: 16px;
              font-weight: 600;
              color: #111827;
            }
            .items-section {
              padding: 20px 0;
            }
            .items-table { 
              width: 100%; 
              border-collapse: collapse;
            }
            .items-table th { 
              text-align: left; 
              padding: 12px; 
              border-bottom: 1px solid #e5e7eb; 
              color: #111827; 
              font-weight: 600; 
              font-size: 14px;
            }
            .items-table td { 
              padding: 12px; 
              border-bottom: 1px solid #f3f4f6; 
              vertical-align: top;
            }
            .service-name {
              font-weight: 600;
              color: #111827;
              margin-bottom: 5px;
            }
            .service-desc {
              color: #6b7280;
              font-size: 13px;
              margin-bottom: 5px;
            }
            .special-instructions {
              color: #059669;
              font-size: 12px;
              margin-top: 5px;
            }
            .amount {
              font-weight: 600;
              color: #111827;
              text-align: right;
            }
            .discount-row {
              background-color: #fef3c7;
            }
            .discount-label {
              color: #d97706;
              font-weight: 500;
            }
            .discount-code {
              color: #92400e;
              font-size: 12px;
              margin-left: 5px;
            }
            .discount-amount {
              color: #dc2626;
              font-weight: 600;
              text-align: right;
            }
            .totals {
              padding: 20px 0;
              border-top: 1px solid #e5e7eb;
            }
            .totals-content {
              display: flex;
              justify-content: flex-end;
            }
            .totals-table {
              width: 300px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              color: #374151;
            }
            .discount-text {
              color: #dc2626;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-top: 2px solid #e5e7eb;
              font-weight: 600;
              font-size: 16px;
              color: #111827;
            }
            .total-amount {
              color: #f59e0b;
            }
            .payment-info {
              padding: 20px 0;
              border-top: 1px solid #e5e7eb;
            }
            .payment-info h3 {
              margin: 0 0 15px 0;
              color: #111827;
              font-size: 18px;
            }
            .payment-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .payment-grid p {
              margin: 5px 0;
              color: #374151;
              font-size: 14px;
            }
            .terms {
              padding: 20px 0;
              border-top: 1px solid #e5e7eb;
            }
            .terms-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
            }
            .terms h4 {
              margin: 0 0 10px 0;
              color: #111827;
              font-size: 16px;
            }
            .terms ul {
              margin: 0;
              padding-left: 20px;
              color: #374151;
              font-size: 13px;
            }
            .terms li {
              margin-bottom: 5px;
            }
            .terms p {
              margin: 5px 0;
              color: #374151;
              font-size: 13px;
            }
            .additional-info {
              margin-top: 10px;
              padding: 10px;
              background-color: #f3f4f6;
              border-radius: 4px;
            }
            .additional-info .label {
              font-weight: 600;
              color: #111827;
              margin-bottom: 5px;
            }
            .additional-info .content {
              color: #374151;
              font-size: 12px;
            }
            .footer {
              text-align: center;
              padding: 20px 0;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body { 
                background: white; 
                padding: 0; 
              }
              .invoice-container { 
                box-shadow: none; 
                border-radius: 0; 
                padding: 20px; 
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Auto print after a short delay
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
      setShowInvoice(false);
      toast.success('Invoice downloaded successfully!');
    },
    onPrint: () => {
      // Same as download for now
      handleInvoiceActions.onDownload();
    },
    onEmail: () => {
      // Email functionality can be added later
      toast.info('Email functionality coming soon!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No user data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${userData.name}'s Profile - PujaKaro`}
        description={`View and manage your PujaKaro profile, bookings, orders, and preferences.`}
        canonicalUrl={`https://pujakaro.com/profile`}
      />
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-white"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white/20 border-4 border-white flex items-center justify-center">
                    <span className="text-3xl text-white">
                      {userData.name?.[0] || 'U'}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => document.getElementById('profileImage').click()}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg"
                >
                  <FontAwesomeIcon icon={faEdit} className="text-orange-500" />
                </button>
                <input
                  type="file"
                  id="profileImage"
                  className="hidden"
                  onChange={handleProfileImageChange}
                  accept="image/*"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{userData.name}</h1>
                <p className="text-white/80">{userData.email}</p>
                <div className="mt-2">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2"
                      style={{ width: `${profileProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">Profile {profileProgress}% complete</p>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleLogout}
                className="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-white/90"
              >
                <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
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
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'overview'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Overview
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
                  My Bookings
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
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'wishlist'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faHeart} className="mr-2" />
                  Wishlist
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
                  onClick={() => setActiveTab('support')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'support'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                  Support
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
                <button
                  onClick={() => setActiveTab('coupons')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'coupons'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faTicket} className="mr-2" />
                  Coupons
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'settings'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faCog} className="mr-2" />
                  Settings
                </button>
                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'services'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                  Activated Services
                </button>
                 {/* Admin Dashboard button - only visible for admin users */}
                 {userData.role === 'admin' && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full text-left px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    <FontAwesomeIcon icon={faLock} className="mr-2" />
                    Admin Dashboard
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <FontAwesomeIcon icon={faCalendar} className="text-orange-500 text-xl" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-500">Upcoming Bookings</p>
                        <p className="text-2xl font-bold">{userBookings.filter(b => b.status === 'pending').length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <FontAwesomeIcon icon={faShoppingBag} className="text-green-600 text-xl" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold">{userOrders.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <FontAwesomeIcon icon={faStar} className="text-orange-500 text-xl" />
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-500">Loyalty Points</p>
                        <p className="text-2xl font-bold">{userData.points || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {userData.recentActivity?.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <FontAwesomeIcon icon={activity.icon} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-gray-500 text-sm">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100">
                      <FontAwesomeIcon icon={faCalendar} className="text-orange-500 text-xl mb-2" />
                      <p className="text-sm font-medium">Book a Puja</p>
                    </button>
                    <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100">
                      <FontAwesomeIcon icon={faShoppingBag} className="text-green-600 text-xl mb-2" />
                      <p className="text-sm font-medium">Shop Now</p>
                    </button>
                    <button className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100">
                      <FontAwesomeIcon icon={faGift} className="text-orange-500 text-xl mb-2" />
                      <p className="text-sm font-medium">Refer & Earn</p>
                    </button>
                    <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100">
                      <FontAwesomeIcon icon={faQuestionCircle} className="text-blue-600 text-xl mb-2" />
                      <p className="text-sm font-medium">Get Help</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
                {bookingsError && (
                  <div className="text-center py-8">
                    <p className="text-red-600">{bookingsError}</p>
                  </div>
                )}
                {userBookings?.length > 0 ? (
                  <div className="space-y-4">
                    {userBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">{booking.pujaName}</h3>
                            <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                            <p className="text-gray-600">Time: {booking.time}</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">₹{booking.finalPrice?.toLocaleString() || booking.price.toLocaleString()}</p>
                            <div className="mt-2 flex flex-col space-y-2">
                              <button 
                                onClick={() => handleViewBookingDetails(booking)}
                                className="text-orange-500 hover:text-orange-600 flex items-center justify-end"
                              >
                                <FontAwesomeIcon icon={faEye} className="mr-1" />
                                View Details
                              </button>
                              
                              {booking.status === 'completed' && !booking.hasReview && (
                                <button
                                  onClick={() => {
                                    setSelectedBookingForReview(booking);
                                    setShowReviewForm(true);
                                  }}
                                  className="text-green-600 hover:text-green-700 flex items-center justify-end"
                                >
                                  <FontAwesomeIcon icon={faCommentDots} className="mr-1" />
                                  Write Review
                                </button>
                              )}
                              
                              {booking.status === 'completed' && booking.hasReview && (
                                <span className="text-green-600 flex items-center justify-end text-sm">
                                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                  Review Submitted
                                </span>
                              )}
                              
                              {booking.status === 'completed' && (
                                <button
                                  onClick={() => handleDownloadInvoice(booking)}
                                  className="text-blue-600 hover:text-blue-700 flex items-center justify-end"
                                >
                                  <FontAwesomeIcon icon={faFileInvoice} className="mr-1" />
                                  Download Invoice
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        {booking.referralCode && (
                          <div className="mt-2 text-sm">
                            <span className="text-green-600">
                              Referral code {booking.referralCode} applied - Saved ₹{(booking.price - booking.finalPrice).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faCalendar} className="text-gray-400 text-4xl mb-4" />
                    <p className="text-gray-600">No bookings found</p>
                    <button 
                      onClick={() => navigate('/puja-booking')}
                      className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                    >
                      Book a Puja
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                {ordersError && (
                  <div className="text-center py-8">
                    <p className="text-red-600">{ordersError}</p>
                  </div>
                )}
                {userOrders?.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
                            <p className="text-gray-600">
                              Date: {new Date(order.createdAt.toDate()).toLocaleDateString()}
                            </p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                            <div className="mt-2">
                              {order.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="text-gray-600">
                                  {item.name} x {item.quantity}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                            <button className="mt-2 text-orange-500 hover:text-orange-600">
                              Track Order
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faShoppingBag} className="text-gray-400 text-4xl mb-4" />
                    <p className="text-gray-600">No orders found</p>
                    <button 
                      onClick={() => navigate('/shop')}
                      className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faHeart} className="text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-600">Your wishlist is empty</p>
                  <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                    Browse Products
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faBell} className="text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-600">No new notifications</p>
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Support Tickets</h2>
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-gray-400 text-4xl mb-4" />
                  <p className="text-gray-600">No support tickets</p>
                  <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                    Create Ticket
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'referrals' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Your Referral Code</h2>
                  {referralCode ? (
                    <div>
                      <div className="flex items-center justify-between bg-orange-50 p-4 rounded-lg mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Your unique referral code</p>
                          <p className="text-2xl font-bold text-orange-600">{referralCode.code}</p>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={handleCopyReferralCode}
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-full"
                          >
                            <FontAwesomeIcon icon={faCopy} />
                          </button>
                          <button
                            onClick={handleShareReferralCode}
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-full"
                          >
                            <FontAwesomeIcon icon={faShare} />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Total Uses</p>
                          <p className="text-2xl font-bold text-green-600">{referralStats.totalUsed}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Total Savings Generated</p>
                          <p className="text-2xl font-bold text-blue-600">₹{referralStats.totalDiscountGiven.toLocaleString()}</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Total Revenue Generated</p>
                          <p className="text-2xl font-bold text-purple-600">₹{referralStats.totalRevenueGenerated.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">You don't have a referral code yet.</p>
                      <p className="text-sm text-gray-500 mt-2">Complete your first booking to get your referral code!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Your Coupon Codes</h2>
                  {userCoupons.length > 0 ? (
                    <div className="space-y-4">
                      {userCoupons.map(coupon => (
                        <div 
                          key={coupon.id} 
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            coupon.assignedUsers ? 'bg-blue-50' : 'bg-green-50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center">
                              <p className="text-2xl font-bold text-orange-600">{coupon.code}</p>
                              {!coupon.assignedUsers && (
                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                  Global
                                </span>
                              )}
                              {coupon.assignedUsers && (
                                <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                  Personal
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{coupon.description}</p>
                            <p className="text-md font-semibold text-orange-700 mt-1">{coupon.discountPercentage}% discount</p>
                          </div>
                          <div className="space-x-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(coupon.code);
                                toast.success('Coupon code copied to clipboard!');
                              }}
                              className="p-2 text-orange-600 hover:bg-orange-100 rounded-full"
                            >
                              <FontAwesomeIcon icon={faCopy} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">You don't have any coupon codes yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          value={userData.name}
                          onChange={handleChange}
                          name="name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={userData.email}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={handleChange}
                          name="phone"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Notification Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-orange-500" />
                        <span className="ml-2">Email Notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-orange-500" />
                        <span className="ml-2">SMS Notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-orange-500" />
                        <span className="ml-2">Push Notifications</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Security</h3>
                    <button className="text-orange-500 hover:text-orange-600">
                      Change Password
                    </button>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSubmit}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6">
                {/* Activated Services Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Activated Services</h2>
                  {activatedServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activatedServices.map((service, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{service.name}</h3>
                              <p className="text-gray-600">
                                Activated on: {new Date(service.activatedOn).toLocaleDateString()}
                              </p>
                              <p className="text-gray-600">Amount: ₹{service.amount}</p>
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Payment ID: {service.paymentId}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-gray-400 text-4xl mb-4" />
                      <p className="text-gray-600">No activated services found</p>
                      <div className="mt-4 space-x-4">
                        <button 
                          onClick={() => handleRazorpayPayment('Flowers and Mala Service', 999)}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                        >
                          Activate Flowers & Mala
                        </button>
                        <button 
                          onClick={() => handleRazorpayPayment('Prashad Service', 1499)}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                        >
                          Activate Prashad Service
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Saved Cards Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Saved Cards</h2>
                  {savedCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedCards.map((card, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{card.brand} Card</h3>
                              <p className="text-gray-600">•••• •••• •••• {card.last4}</p>
                              <p className="text-gray-600">Expires: {card.expiry}</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FontAwesomeIcon icon={faCreditCard} className="text-gray-400 text-4xl mb-4" />
                      <p className="text-gray-600">No saved cards found</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Cards will be saved automatically after successful payments
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Booking Details Modal */}
            {showBookingModal && selectedBooking && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                      <button 
                        onClick={() => setShowBookingModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Puja Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="font-medium">{selectedBooking.pujaName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date & Time</p>
                            <p className="font-medium">
                              {new Date(selectedBooking.date).toLocaleDateString()}, {selectedBooking.time}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              selectedBooking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {selectedBooking.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Booking ID</p>
                            <p className="font-medium">{selectedBooking.id}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Price Details</h3>
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <span>Original Price</span>
                            <span>₹{selectedBooking.price.toLocaleString()}</span>
                          </div>
                          {selectedBooking.referralCode && (
                            <>
                              <div className="flex justify-between text-green-600 mb-2">
                                <span>Referral Discount</span>
                                <span>-₹{(selectedBooking.price - selectedBooking.finalPrice).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between font-bold pt-2 border-t">
                                <span>Final Price</span>
                                <span>₹{selectedBooking.finalPrice.toLocaleString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Booking Address</h3>
                        <div className="border rounded-lg p-4">
                          <p>{selectedBooking.address}</p>
                          <p>{selectedBooking.city}, {selectedBooking.state} {selectedBooking.pincode}</p>
                          <p>Phone: {selectedBooking.phone}</p>
                        </div>
                      </div>

                      {selectedBooking.specialInstructions && (
                        <div>
                          <h3 className="font-semibold mb-2">Special Instructions</h3>
                          <div className="border rounded-lg p-4">
                            <p>{selectedBooking.specialInstructions}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Add the review section */}
                      {selectedBooking.status === 'completed' && (
                        <div className="mt-6">
                          {selectedBooking.hasReview ? (
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl mb-2" />
                              <p className="text-green-700">You've already submitted a review for this booking. Thank you!</p>
                            </div>
                          ) : (
                            <div className="bg-orange-50 p-4 rounded-lg text-center">
                              <h3 className="font-semibold mb-2">Share Your Experience</h3>
                              <p className="text-gray-600 mb-4">Your feedback helps others choose the right puja services.</p>
                              <button
                                onClick={() => {
                                  setSelectedBookingForReview(selectedBooking);
                                  setShowReviewForm(true);
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
                              >
                                <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                                Leave a Review
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Review Form Modal */}
            {showReviewForm && selectedBookingForReview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold">Submit Review</h3>
                    <button
                      onClick={() => {
                        setShowReviewForm(false);
                        setSelectedBookingForReview(null);
                      }}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      &times;
                    </button>
                  </div>
                  <BookingReviewForm
                    booking={selectedBookingForReview}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              </div>
            )}
            
            {/* Invoice Modal */}
            {showInvoice && selectedBookingForInvoice && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <BookingInvoice
                    booking={selectedBookingForInvoice}
                    onClose={handleInvoiceActions.onClose}
                    onDownload={handleInvoiceActions.onDownload}
                    onPrint={handleInvoiceActions.onPrint}
                    onEmail={handleInvoiceActions.onEmail}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;