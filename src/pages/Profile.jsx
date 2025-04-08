import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLocationDot, faEdit, faShoppingBag, faPray, faHistory, faAddressBook, faSignOut, faCalendar, faClock, faRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import CreateSampleUser from '../components/CreateSampleUser';

const Profile = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: null
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
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
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save updated user data to localStorage
    localStorage.setItem('userName', userData.fullName);
    localStorage.setItem('userEmail', userData.email);
    
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/signin');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRemoveAddress = (id) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map(address => ({
        ...address,
        isDefault: address.id === id
      }))
    );
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            {userData.photoURL ? (
              <img
                src={userData.photoURL}
                alt="Profile"
                className="h-20 w-20 rounded-full"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 text-2xl">
                  {userData.name?.[0] || 'U'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'bookings'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Orders
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'bookings' ? (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Bookings</h2>
              {userData.bookings?.length > 0 ? (
                <div className="space-y-4">
                  {userData.bookings.map((booking, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{booking.pujaName}</h3>
                          <p className="text-gray-600">Date: {new Date(booking.date).toLocaleDateString()}</p>
                          <p className="text-gray-600">Time: {booking.time}</p>
                          <p className="text-gray-600">Status: {booking.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{booking.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No bookings found</p>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Orders</h2>
              {userData.orders?.length > 0 ? (
                <div className="space-y-4">
                  {userData.orders.map((order, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">Order #{index + 1}</h3>
                          <p className="text-gray-600">
                            Date: {new Date(order.timestamp.toDate()).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">Status: {order.status}</p>
                          <div className="mt-2">
                            {order.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="text-gray-600">
                                {item.name} x {item.quantity}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{order.total}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No orders found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;