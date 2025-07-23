import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faBan,
  faTrash,
  faSearch,
  faFilter,
  faSort,
  faEye,
  faEdit,
  faCommentDots,
  faEnvelope,
  faCog,
  faMapMarkerAlt,
  faPhone,
  faEnvelope as faEnvelopeIcon,
  faCalendar,
  faClock,
  faIndianRupeeSign,
  faTag,
  faStar,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { sendBookingNotification, sendReviewRequestNotification } from '../utils/notificationUtils';
import BookingReviewForm from './BookingReviewForm';

const BookingManagementTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const bookingsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Convert Firestore timestamps to Date objects, with proper checks
        const formattedData = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate() : data.createdAt,
          date: data.date && typeof data.date.toDate === 'function' ? data.date.toDate() : data.date,
          reviewRequestedAt: data.reviewRequestedAt && typeof data.reviewRequestedAt.toDate === 'function' ? 
            data.reviewRequestedAt.toDate() : data.reviewRequestedAt,
          updatedAt: data.updatedAt && typeof data.updatedAt.toDate === 'function' ? 
            data.updatedAt.toDate() : data.updatedAt,
          reviewedAt: data.reviewedAt && typeof data.reviewedAt.toDate === 'function' ? 
            data.reviewedAt.toDate() : data.reviewedAt
        };
        
        return formattedData;
      });
      
      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);
      
      if (!bookingDoc.exists()) {
        toast.error('Booking not found');
        return;
      }

      const bookingData = bookingDoc.data();
      const oldStatus = bookingData.status;

      // Update booking status
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Send notification to user if userId exists
      if (bookingData.userId) {
        await sendBookingNotification(
          bookingData.userId,
          bookingId,
          newStatus,
          bookingData.pujaName || 'your puja'
        );
      }

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: newStatus, updatedAt: new Date() }
            : booking
        )
      );

      // Update selected booking if it's the current one
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(prev => ({ ...prev, status: newStatus, updatedAt: new Date() }));
      }

      // Show additional message if status is completed
      if (newStatus === 'completed') {
        toast.success(`Booking marked as completed. You can now request a review from the customer.`);
      } else {
        toast.success(`Booking ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
      
      // Close modal if the deleted booking was selected
      if (selectedBooking && selectedBooking.id === bookingId) {
        setShowManageModal(false);
        setSelectedBooking(null);
      }
      
      toast.success('Booking deleted successfully');
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const handleRequestReview = async (booking) => {
    try {
      // Update the booking to mark review as requested
      await updateDoc(doc(db, 'bookings', booking.id), {
        reviewRequested: true,
        reviewRequestedAt: serverTimestamp()
      });

      // Send notification to user
      if (booking.userId) {
        await sendReviewRequestNotification(
          booking.userId,
          booking.id,
          booking.pujaName || 'your puja'
        );
      }

      // Update local state
      setBookings(prevBookings =>
        prevBookings.map(b =>
          b.id === booking.id
            ? { ...b, reviewRequested: true, reviewRequestedAt: new Date() }
            : b
        )
      );

      // Update selected booking if it's the current one
      if (selectedBooking && selectedBooking.id === booking.id) {
        setSelectedBooking(prev => ({ ...prev, reviewRequested: true, reviewRequestedAt: new Date() }));
      }

      toast.success('Review request sent to customer');
    } catch (error) {
      console.error('Error requesting review:', error);
      toast.error('Failed to send review request');
    }
  };

  const handleReviewSubmitted = (reviewId) => {
    // Update the booking in the list to show it has a review
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === selectedBookingForReview.id
          ? { ...booking, hasReview: true, reviewId }
          : booking
      )
    );
    
    // Update selected booking if it's the current one
    if (selectedBooking && selectedBooking.id === selectedBookingForReview.id) {
      setSelectedBooking(prev => ({ ...prev, hasReview: true, reviewId }));
    }
    
    setShowReviewForm(false);
    setSelectedBookingForReview(null);
  };

  const openManageModal = (booking) => {
    setSelectedBooking(booking);
    setShowManageModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'cancelled':
        return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />;
      case 'confirmed':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500" />;
      case 'pending':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.pujaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          // Handle different date formats
          const dateA = a.date instanceof Date ? a.date.getTime() : 
                        typeof a.date === 'string' ? new Date(a.date).getTime() : 0;
          const dateB = b.date instanceof Date ? b.date.getTime() : 
                        typeof b.date === 'string' ? new Date(b.date).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'created':
          // Handle different date formats
          const createdA = a.createdAt instanceof Date ? a.createdAt.getTime() : 
                          typeof a.createdAt === 'string' ? new Date(a.createdAt).getTime() : 0;
          const createdB = b.createdAt instanceof Date ? b.createdAt.getTime() : 
                          typeof b.createdAt === 'string' ? new Date(b.createdAt).getTime() : 0;
          comparison = createdA - createdB;
          break;
        case 'name':
          comparison = (a.pujaName || '').localeCompare(b.pujaName || '');
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button
          onClick={fetchBookings}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bookings..."
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

        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="created">Sort by Created</option>
            <option value="name">Sort by Name</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FontAwesomeIcon icon={faSort} className="mr-2" />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puja Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.pujaName}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {booking.pujaId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.userName}</div>
                  <div className="text-sm text-gray-500">{booking.userEmail}</div>
                  <div className="text-sm text-gray-500">{booking.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {booking.date instanceof Date ? booking.date.toLocaleDateString() : 
                     typeof booking.date === 'string' ? booking.date : 'Date not available'}
                  </div>
                  <div className="text-sm text-gray-500">{booking.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)} {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />
                    {booking.finalPrice?.toLocaleString() || booking.price?.toLocaleString()}
                  </div>
                  {booking.discountApplied > 0 && (
                    <div className="text-xs text-green-600">
                      {booking.discountType === 'coupon' ? 'Coupon' : 'Discount'}: {booking.discountApplied}%
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openManageModal(booking)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    Manage Booking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comprehensive Booking Management Modal */}
      {showManageModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Manage Booking</h3>
                  <p className="text-sm text-gray-500 mt-1">Booking ID: {selectedBooking.id}</p>
                </div>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Current Status</h4>
                    <div className="flex items-center mt-2">
                      {getStatusIcon(selectedBooking.status)}
                      <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {selectedBooking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                          disabled={updatingStatus}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FontAwesomeIcon icon={faCheck} className="mr-2" />
                          {updatingStatus ? 'Confirming...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                          disabled={updatingStatus}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FontAwesomeIcon icon={faBan} className="mr-2" />
                          {updatingStatus ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </>
                    )}
                    {selectedBooking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                        disabled={updatingStatus}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faCheck} className="mr-2" />
                        {updatingStatus ? 'Completing...' : 'Mark as Completed'}
                      </button>
                    )}
                    {selectedBooking.status === 'completed' && !selectedBooking.hasReview && !selectedBooking.reviewRequested && (
                      <button
                        onClick={() => handleRequestReview(selectedBooking)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                        Request Review
                      </button>
                    )}
                    {selectedBooking.status === 'completed' && selectedBooking.reviewRequested && !selectedBooking.hasReview && (
                      <button
                        onClick={() => {
                          setSelectedBookingForReview(selectedBooking);
                          setShowReviewForm(true);
                          setShowManageModal(false);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                        Submit Review
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Puja Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faEdit} className="mr-2 text-blue-500" />
                    Puja Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Puja Name</label>
                      <p className="text-sm text-gray-900">{selectedBooking.pujaName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Puja ID</label>
                      <p className="text-sm text-gray-900">{selectedBooking.pujaId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Date & Time</label>
                      <p className="text-sm text-gray-900">
                        {selectedBooking.date instanceof Date ? selectedBooking.date.toLocaleDateString() :
                         typeof selectedBooking.date === 'string' ? selectedBooking.date : 'Date not available'} at {selectedBooking.time}
                      </p>
                    </div>
                    {selectedBooking.specialInstructions && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Special Instructions</label>
                        <p className="text-sm text-gray-900">{selectedBooking.specialInstructions}</p>
                      </div>
                    )}
                    {selectedBooking.additionalInfo && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Additional Information</label>
                        <p className="text-sm text-gray-900">{selectedBooking.additionalInfo}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faEnvelopeIcon} className="mr-2 text-green-500" />
                    Customer Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm text-gray-900">{selectedBooking.userName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faEnvelopeIcon} className="mr-2 text-gray-400" />
                        {selectedBooking.userEmail}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                        {selectedBooking.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">User ID</label>
                      <p className="text-sm text-gray-900 font-mono">{selectedBooking.userId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
                  Address Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-sm text-gray-900">{selectedBooking.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <p className="text-sm text-gray-900">{selectedBooking.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <p className="text-sm text-gray-900">{selectedBooking.state}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <p className="text-sm text-gray-900">{selectedBooking.pincode}</p>
                  </div>
                  {selectedBooking.location && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Coordinates</label>
                      <p className="text-sm text-gray-900">
                        Lat: {selectedBooking.location.latitude}, Long: {selectedBooking.location.longitude}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-2 text-green-500" />
                  Financial Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Original Price</label>
                    <p className="text-lg font-semibold text-gray-900">
                      <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />
                      {selectedBooking.price?.toLocaleString()}
                    </p>
                  </div>
                  {selectedBooking.discountApplied > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {selectedBooking.discountType === 'coupon' ? 'Coupon Discount' : 'Discount'}
                      </label>
                      <p className="text-lg font-semibold text-green-600">
                        -{selectedBooking.discountApplied}%
                      </p>
                      {selectedBooking.referralCode && (
                        <p className="text-sm text-gray-500">Code: {selectedBooking.referralCode}</p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Final Price</label>
                    <p className="text-lg font-semibold text-blue-600">
                      <FontAwesomeIcon icon={faIndianRupeeSign} className="mr-1" />
                      {selectedBooking.finalPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-purple-500" />
                  Timestamps
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created At</label>
                    <p className="text-sm text-gray-900">
                      {selectedBooking.createdAt instanceof Date ? selectedBooking.createdAt.toLocaleString() :
                       typeof selectedBooking.createdAt === 'string' ? selectedBooking.createdAt : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Updated</label>
                    <p className="text-sm text-gray-900">
                      {selectedBooking.updatedAt instanceof Date ? selectedBooking.updatedAt.toLocaleString() :
                       typeof selectedBooking.updatedAt === 'string' ? selectedBooking.updatedAt : 'Not available'}
                    </p>
                  </div>
                  {selectedBooking.reviewRequestedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Review Requested At</label>
                      <p className="text-sm text-gray-900">
                        {selectedBooking.reviewRequestedAt instanceof Date ? selectedBooking.reviewRequestedAt.toLocaleString() :
                         typeof selectedBooking.reviewRequestedAt === 'string' ? selectedBooking.reviewRequestedAt : 'Not available'}
                      </p>
                    </div>
                  )}
                  {selectedBooking.reviewedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Reviewed At</label>
                      <p className="text-sm text-gray-900">
                        {selectedBooking.reviewedAt instanceof Date ? selectedBooking.reviewedAt.toLocaleString() :
                         typeof selectedBooking.reviewedAt === 'string' ? selectedBooking.reviewedAt : 'Not available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Status */}
              {selectedBooking.status === 'completed' && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FontAwesomeIcon icon={faStar} className="mr-2 text-yellow-500" />
                    Review Status
                  </h4>
                  <div className="flex items-center space-x-4">
                    {selectedBooking.hasReview ? (
                      <div className="flex items-center text-green-600">
                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                        <span>Review submitted</span>
                        {selectedBooking.reviewId && (
                          <span className="ml-2 text-sm text-gray-500">ID: {selectedBooking.reviewId}</span>
                        )}
                      </div>
                    ) : selectedBooking.reviewRequested ? (
                      <div className="flex items-center text-yellow-600">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                        <span>Review requested - waiting for customer response</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        <span>No review requested yet</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedBooking(selectedBooking);
                      setShowEmailModal(true);
                      setShowManageModal(false);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Send Email
                  </button>
                  <button
                    onClick={() => handleDelete(selectedBooking.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete Booking
                  </button>
                </div>
                <button
                  onClick={() => setShowManageModal(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Close
                </button>
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
    </div>
  );
};

export default BookingManagementTab; 