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
  faEnvelope
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

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
            data.reviewRequestedAt.toDate() : data.reviewRequestedAt
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

      // Show additional message if status is completed
      if (newStatus === 'completed') {
        toast.success(`Booking marked as completed. You can now request a review from the customer.`);
      } else {
        toast.success(`Booking ${newStatus}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
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
    setShowReviewForm(false);
    setSelectedBookingForReview(null);
  };

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => {
      const matchesSearch = 
        booking.pujaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userPhone?.toLowerCase().includes(searchTerm.toLowerCase());
      
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
                Date
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
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.pujaName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.userName}</div>
                  <div className="text-sm text-gray-500">{booking.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {booking.date instanceof Date ? booking.date.toLocaleDateString() : 
                     typeof booking.date === 'string' ? booking.date : 'Date not available'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDetailModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                          title="Confirm Booking"
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                          title="Cancel Booking"
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        className="text-green-600 hover:text-green-900"
                        title="Mark as Completed"
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowEmailModal(true);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                      title="Send Email"
                    >
                      <FontAwesomeIcon icon={faEnvelope} />
                    </button>
                    {booking.status === 'completed' && !booking.hasReview && !booking.reviewRequested && (
                      <button
                        onClick={() => handleRequestReview(booking)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        title="Request Review"
                      >
                        <FontAwesomeIcon icon={faCommentDots} />
                      </button>
                    )}
                    {booking.status === 'completed' && booking.reviewRequested && !booking.hasReview && (
                      <button
                        onClick={() => {
                          setSelectedBookingForReview(booking);
                          setShowReviewForm(true);
                        }}
                        className="text-green-600 hover:text-green-900 mr-2"
                        title="Submit Review"
                      >
                        <FontAwesomeIcon icon={faCommentDots} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Booking"
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

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Booking Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700">Puja Details</h4>
                <p className="text-gray-600">{selectedBooking.pujaName}</p>
                <p className="text-gray-600">{selectedBooking.pujaDescription}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Customer Details</h4>
                <p className="text-gray-600">Name: {selectedBooking.userName}</p>
                <p className="text-gray-600">Email: {selectedBooking.userEmail}</p>
                <p className="text-gray-600">Phone: {selectedBooking.userPhone}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Booking Details</h4>
                <p className="text-gray-600">Date: {
                  selectedBooking.date instanceof Date ? selectedBooking.date.toLocaleDateString() :
                  typeof selectedBooking.date === 'string' ? selectedBooking.date : 'Date not available'
                }</p>
                <p className="text-gray-600">Time: {selectedBooking.time}</p>
                <p className="text-gray-600">Status: {selectedBooking.status}</p>
                <p className="text-gray-600">Created: {
                  selectedBooking.createdAt instanceof Date ? selectedBooking.createdAt.toLocaleDateString() :
                  typeof selectedBooking.createdAt === 'string' ? selectedBooking.createdAt : 'Date not available'
                }</p>
              </div>
              {selectedBooking.notes && (
                <div>
                  <h4 className="font-medium text-gray-700">Notes</h4>
                  <p className="text-gray-600">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              {selectedBooking.status === 'completed' && !selectedBooking.hasReview && !selectedBooking.reviewRequested && (
                <button
                  onClick={() => handleRequestReview(selectedBooking)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Request Review
                </button>
              )}
              {selectedBooking.status === 'completed' && selectedBooking.reviewRequested && !selectedBooking.hasReview && (
                <button
                  onClick={() => {
                    setSelectedBookingForReview(selectedBooking);
                    setShowReviewForm(true);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Submit Review
                </button>
              )}
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Close
              </button>
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