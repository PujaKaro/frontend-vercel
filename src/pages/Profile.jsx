import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLocationDot, faEdit, faShoppingBag, faPray, faHistory, faAddressBook, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '9876543210',
    address: '123 Main Street, Mumbai, India - 400001',
    profileImage: null
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
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
  const { currentUser, logout, isAuthenticated: authContextAuthenticated } = useAuth();

  useEffect(() => {
    if (!authContextAuthenticated) {
      navigate('/signin');
      return;
    }
    
    setIsAuthenticated(true);
    
    // Load user data
    setUser({
      name: currentUser.name || 'User Name',
      email: currentUser.email || 'user@example.com',
      phone: '1234567890',
      profileImage: null
    });
    
    // Initialize form data
    setFormData({
      name: currentUser.name || 'User Name',
      email: currentUser.email || 'user@example.com',
      phone: '1234567890',
      profileImage: null
    });
    
    // Mock orders data
    setOrders([
      { id: 'ORD001', date: '2023-06-15', total: 2500, status: 'Delivered', items: 3 },
      { id: 'ORD002', date: '2023-07-20', total: 1800, status: 'Processing', items: 2 },
      { id: 'ORD003', date: '2023-08-05', total: 3200, status: 'Shipped', items: 4 }
    ]);
    
    // Mock addresses data
    setAddresses([
      { id: 1, type: 'Home', address: '123 Main St, Apartment 4B, City, State, 12345', isDefault: true },
      { id: 2, type: 'Office', address: '456 Work Blvd, Suite 200, Business City, State, 54321', isDefault: false }
    ]);
    
    setLoading(false);
  }, [authContextAuthenticated, currentUser, navigate]);

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
    
    setIsEditing(false);
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 bg-gray-50 p-6 border-r border-gray-200">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    {userData.profileImage ? (
                      <img src={userData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#317bea]/20 text-[#317bea]">
                        <FontAwesomeIcon icon={faUser} className="text-4xl" />
                      </div>
                    )}
                  </div>
                  {!isEditing && (
                    <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-custom text-white rounded-full p-2 cursor-pointer shadow-md">
                      <FontAwesomeIcon icon={faEdit} className="text-sm" />
                      <input 
                        type="file" 
                        id="profile-image" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleProfileImageChange}
                      />
                    </label>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{userData.fullName}</h3>
                <p className="text-gray-500">{userData.email}</p>
              </div>
              
              <nav className="space-y-1">
                <button 
                  onClick={() => handleTabChange('profile')}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 rounded-md ${
                    activeTab === 'profile' 
                      ? 'bg-[#317bea] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>My Profile</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange('orders')}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 rounded-md ${
                    activeTab === 'orders' 
                      ? 'bg-[#317bea] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FontAwesomeIcon icon={faShoppingBag} />
                  <span>My Orders</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange('addresses')}
                  className={`w-full text-left px-4 py-3 flex items-center space-x-3 rounded-md ${
                    activeTab === 'addresses' 
                      ? 'bg-[#317bea] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FontAwesomeIcon icon={faAddressBook} />
                  <span>Saved Addresses</span>
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 flex items-center space-x-3 rounded-md text-red-600 hover:bg-red-50"
                >
                  <FontAwesomeIcon icon={faSignOut} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
            
            {/* Main content */}
            <div className="w-full md:w-3/4 p-8">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          form="profile-form"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom hover:bg-custom/90 focus:outline-none"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-lg">
                    {isEditing ? (
                      <form id="profile-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={userData.fullName}
                              onChange={handleChange}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-custom focus:border-custom"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={userData.email}
                              onChange={handleChange}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-custom focus:border-custom"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={userData.phone}
                              onChange={handleChange}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-custom focus:border-custom"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                              Address
                            </label>
                            <textarea
                              id="address"
                              name="address"
                              rows="3"
                              value={userData.address}
                              onChange={handleChange}
                              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-custom focus:border-custom"
                            ></textarea>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center py-4 border-b border-gray-100">
                          <div className="w-1/3">
                            <span className="text-gray-500 flex items-center">
                              <FontAwesomeIcon icon={faUser} className="mr-2 text-custom" />
                              Full Name
                            </span>
                          </div>
                          <div className="w-2/3">
                            <span className="text-gray-900 font-medium">{userData.fullName}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center py-4 border-b border-gray-100">
                          <div className="w-1/3">
                            <span className="text-gray-500 flex items-center">
                              <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-custom" />
                              Email Address
                            </span>
                          </div>
                          <div className="w-2/3">
                            <span className="text-gray-900 font-medium">{userData.email}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center py-4 border-b border-gray-100">
                          <div className="w-1/3">
                            <span className="text-gray-500 flex items-center">
                              <FontAwesomeIcon icon={faPhone} className="mr-2 text-custom" />
                              Phone Number
                            </span>
                          </div>
                          <div className="w-2/3">
                            <span className="text-gray-900 font-medium">{userData.phone}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center py-4">
                          <div className="w-1/3">
                            <span className="text-gray-500 flex items-center">
                              <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-custom" />
                              Address
                            </span>
                          </div>
                          <div className="w-2/3">
                            <span className="text-gray-900 font-medium">{userData.address}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <div className="text-gray-500 mb-3">
                      <FontAwesomeIcon icon={faShoppingBag} className="text-4xl mb-4 text-gray-400" />
                      <p>You haven't placed any orders yet.</p>
                    </div>
                    <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none">
                      Browse Products
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h2>
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-lg font-semibold">Home</p>
                        <p className="text-gray-600">{userData.fullName}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-[#317bea]">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{userData.address}</p>
                    <p className="text-gray-600">Phone: {userData.phone}</p>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    + Add New Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 