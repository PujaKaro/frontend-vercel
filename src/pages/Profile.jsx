import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faPhone, faLocationDot, faEdit, 
  faShoppingBag, faPray, faHistory, faAddressBook, 
  faSignOut, faCalendar, faClock, faRupeeSign,
  faBell, faHeart, faTicket, faGift, faCog,
  faStar, faQuestionCircle, faShare
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import SEO from '../components/SEO';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileProgress, setProfileProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            calculateProfileProgress(data);
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
                  onClick={() => setActiveTab('referral')}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    activeTab === 'referral'
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faGift} className="mr-2" />
                  Refer & Earn
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
                        <p className="text-2xl font-bold">{userData.bookings?.length || 0}</p>
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
                        <p className="text-2xl font-bold">{userData.orders?.length || 0}</p>
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
                {userData.bookings?.length > 0 ? (
                  <div className="space-y-4">
                    {userData.bookings.map((booking, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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
                            <p className="font-medium text-gray-900">₹{booking.price}</p>
                            <button className="mt-2 text-orange-500 hover:text-orange-600">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faCalendar} className="text-gray-400 text-4xl mb-4" />
                    <p className="text-gray-600">No bookings found</p>
                    <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                      Book a Puja
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                {userData.orders?.length > 0 ? (
                  <div className="space-y-4">
                    {userData.orders.map((order, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">Order #{order.orderId}</h3>
                            <p className="text-gray-600">
                              Date: {new Date(order.timestamp.toDate()).toLocaleDateString()}
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
                            <p className="font-medium text-gray-900">₹{order.total}</p>
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
                    <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
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

            {activeTab === 'referral' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Refer & Earn</h2>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-medium mb-2">Invite Friends & Earn Rewards</h3>
                  <p className="text-gray-600 mb-4">
                    Share your referral code with friends and earn points for every successful referral.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <code className="text-orange-500 font-mono">REF{currentUser.uid.slice(0, 6)}</code>
                    </div>
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                      <FontAwesomeIcon icon={faShare} className="mr-2" />
                      Share Code
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Total Referrals</h4>
                    <p className="text-2xl font-bold text-orange-500">{userData.referrals?.length || 0}</p>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Earned Points</h4>
                    <p className="text-2xl font-bold text-orange-500">{userData.referralPoints || 0}</p>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Available Rewards</h4>
                    <p className="text-2xl font-bold text-orange-500">₹{userData.availableRewards || 0}</p>
                  </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;