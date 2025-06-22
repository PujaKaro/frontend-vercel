import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faBan, 
  faTrash, 
  faStar, 
  faSearch, 
  faFilter, 
  faSort
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
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';
import { sendTestimonialStatusNotification } from '../utils/notificationUtils';

const AdminTestimonialsTab = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      
      // Start with a base query to the testimonials collection
      let testimonialsQuery = collection(db, 'testimonials');
      
      // Get all testimonials - we'll filter on the client side for flexibility
      const snapshot = await getDocs(testimonialsQuery);
      
      const testimonialData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      
      setTestimonials(testimonialData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      // Get the testimonial to find the user ID
      const testimonial = testimonials.find(t => t.id === id);
      if (!testimonial) {
        toast.error('Testimonial not found');
        return;
      }
      
      const testimonialRef = doc(db, 'testimonials', id);
      await updateDoc(testimonialRef, { 
        status: 'approved',
        updatedAt: new Date()
      });
      
      // Update local state
      setTestimonials(prevTestimonials => 
        prevTestimonials.map(testimonial => 
          testimonial.id === id 
            ? { ...testimonial, status: 'approved', updatedAt: new Date() } 
            : testimonial
        )
      );
      
      // Send notification to the user if userId exists
      if (testimonial.userId) {
        try {
          await sendTestimonialStatusNotification(testimonial.userId, id, 'approved');
        } catch (err) {
          console.error('Error sending testimonial notification:', err);
        }
      }
      
      toast.success('Testimonial approved successfully');
    } catch (error) {
      console.error('Error approving testimonial:', error);
      toast.error('Failed to approve testimonial');
    }
  };

  const handleReject = async (id) => {
    try {
      // Get the testimonial to find the user ID
      const testimonial = testimonials.find(t => t.id === id);
      if (!testimonial) {
        toast.error('Testimonial not found');
        return;
      }
      
      const testimonialRef = doc(db, 'testimonials', id);
      await updateDoc(testimonialRef, { 
        status: 'rejected',
        updatedAt: new Date()
      });
      
      // Update local state
      setTestimonials(prevTestimonials => 
        prevTestimonials.map(testimonial => 
          testimonial.id === id 
            ? { ...testimonial, status: 'rejected', updatedAt: new Date() } 
            : testimonial
        )
      );
      
      // Send notification to the user if userId exists
      if (testimonial.userId) {
        try {
          await sendTestimonialStatusNotification(testimonial.userId, id, 'rejected');
        } catch (err) {
          console.error('Error sending testimonial notification:', err);
        }
      }
      
      toast.success('Testimonial rejected');
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
      toast.error('Failed to reject testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'testimonials', id));
        
        // Update local state
        setTestimonials(prevTestimonials => 
          prevTestimonials.filter(testimonial => testimonial.id !== id)
        );
        
        toast.success('Testimonial deleted successfully');
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const handleViewDetails = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setShowDetailModal(true);
  };

  // Filter and sort testimonials
  const filteredTestimonials = testimonials
    .filter(testimonial => {
      // Apply search filter
      const searchMatch = 
        testimonial.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.pujaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.message?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      const statusMatch = statusFilter ? testimonial.status === statusFilter : true;
      
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOption) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Format date helper
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render stars helper
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={i}
          icon={faStar} 
          className={i <= rating ? "text-yellow-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Testimonial Management</h2>
        <button
          onClick={fetchTestimonials}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, puja, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSort} className="text-gray-400" />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-500">Loading testimonials...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puja Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTestimonials.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No testimonials found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTestimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {testimonial.userImage ? (
                            <img
                              src={testimonial.userImage}
                              alt={testimonial.userName}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-500 font-semibold">
                                {testimonial.userName?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {testimonial.userName || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {testimonial.userEmail || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{testimonial.pujaName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex text-sm">
                          {renderStars(testimonial.rating)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          testimonial.status === 'approved' ? 'bg-green-100 text-green-800' :
                          testimonial.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {testimonial.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(testimonial.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(testimonial)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleApprove(testimonial.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                          disabled={testimonial.status === 'approved'}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          onClick={() => handleReject(testimonial.id)}
                          className="text-orange-600 hover:text-orange-900 mr-3"
                          disabled={testimonial.status === 'rejected'}
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
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
        </>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Testimonial Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-4">
                {selectedTestimonial.userImage ? (
                  <img
                    src={selectedTestimonial.userImage}
                    alt={selectedTestimonial.userName}
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <span className="text-blue-500 font-semibold">
                      {selectedTestimonial.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">{selectedTestimonial.userName || 'Anonymous'}</h4>
                  <p className="text-sm text-gray-500">{selectedTestimonial.userEmail || 'No email'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">{selectedTestimonial.pujaName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedTestimonial.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex">{renderStars(selectedTestimonial.rating)}</div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedTestimonial.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedTestimonial.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedTestimonial.status || 'Unknown'}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Testimonial</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">{selectedTestimonial.message}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              {selectedTestimonial.status !== 'approved' && (
                <button
                  onClick={() => {
                    handleApprove(selectedTestimonial.id);
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Approve
                </button>
              )}
              {selectedTestimonial.status !== 'rejected' && (
                <button
                  onClick={() => {
                    handleReject(selectedTestimonial.id);
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Reject
                </button>
              )}
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this testimonial?')) {
                    handleDelete(selectedTestimonial.id);
                    setShowDetailModal(false);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonialsTab; 