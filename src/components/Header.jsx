import { useState, useEffect } from 'react';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {
  faShoppingCart,
  faUser,
  faBars,
  faTimes,
  faSearch,
  faMapMarkerAlt,
  faGlobe,
  faCoins,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useCoinWallet } from '../contexts/CoinWalletContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import NotificationBell from './NotificationBell';
import SavedAddressesModal from './SavedAddressesModal';
import { getAllProducts } from '../utils/dataUtils';
import { getAllPujas } from '../utils/dataUtils';
import ImageOptimized from '../components/ImageOptimized';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const locationRef = useRef(null);
  const languageRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Select Location');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [pujas, setPujas] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isSavedAddressesModalOpen, setIsSavedAddressesModalOpen] = useState(false);

  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const { wallet } = useCoinWallet();

  const locations = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
  ];

  // Load search data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, pujasData] = await Promise.all([
          getAllProducts(),
          getAllPujas()
        ]);
        setProducts(productsData);
        setPujas(pujasData);
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    };
    loadData();
  }, []);

  // Generate search suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const results = [];

    // Search in products
    products.forEach(product => {
      const nameMatch = product.name?.toLowerCase().includes(term);
      const descMatch = product.description?.toLowerCase().includes(term);
      const categoryMatch = product.category?.toLowerCase().includes(term);
      const materialMatch = product.material?.toLowerCase().includes(term);

      if (nameMatch || descMatch || categoryMatch || materialMatch) {
        results.push({
          id: product.id,
          name: product.name,
          type: 'product',
          category: product.category,
          price: product.price,
          image: product.image
        });
      }
    });

    // Search in pujas
    pujas.forEach(puja => {
      const nameMatch = puja.name?.toLowerCase().includes(term);
      const descMatch = puja.description?.toLowerCase().includes(term);
      const categoryMatch = puja.category?.toLowerCase().includes(term);
      const benefitsMatch = puja.benefits?.toLowerCase().includes(term);

      if (nameMatch || descMatch || categoryMatch || benefitsMatch) {
        results.push({
          id: puja.id,
          name: puja.name,
          type: 'puja',
          category: puja.category,
          price: puja.price,
          image: puja.image
        });
      }
    });

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === term;
      const bExact = b.name.toLowerCase() === term;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.name.localeCompare(b.name);
    });

    // Limit to 6 suggestions
    setSuggestions(results.slice(0, 6));
    setShowSuggestions(true);
  }, [searchTerm, products, pujas]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }

      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }

      // Close suggestions when clicking outside
      if (!event.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm('');
    setShowSuggestions(false);
    setIsSearchVisible(false);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'product') {
      navigate(`/product/${suggestion.id}`);
    } else if (suggestion.type === 'puja') {
      navigate(`/puja-booking/${suggestion.id}`);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/signin', { state: { from: '/profile' } });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to sign out?');
    if (!confirmLogout) return;

    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleBannerClose = () => {
    setIsBannerVisible(false);
  };

  const handleSavedAddressesClick = () => {
    setIsSavedAddressesModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleEditAddress = (address) => {
    setIsSavedAddressesModalOpen(false);
    navigate('/profile', { state: { editAddress: address } });
  };

  const handleDeleteAddress = (addressId) => {
    // This would typically call a function to delete the address
    console.log('Delete address:', addressId);
  };

  const handleAddAddress = (newAddress) => {
    // This would typically call a function to add the address to the user's profile
    console.log('Add address:', newAddress);
    // For now, we'll just close the modal and show a success message
    setIsSavedAddressesModalOpen(false);
    alert('Address added successfully!');
  };

  return (
    <>
      {/* Offer Banner */}
      {isBannerVisible && (
        <div className="bg-blue-500 text-white text-center py-1 px-4 relative">
          <span>🎉 Limited Time Offer: Get 20% off on all bookings! Use code: PUJAKARO20</span>
          <button
            onClick={handleBannerClose}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
          >
            <FontAwesomeIcon icon={faTimesCircle} className="text-lg" />
          </button>
          <button
            onClick={() => navigate('/puja-booking')}
            className="ml-4 bg-white text-blue-500 font-medium px-4 py-1 rounded-md hover:bg-gray-100"
          >
            Book Now
          </button>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-50 bg-white ${isScrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
        <div className="container mx-auto px-4 pb-1 py-1">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex justify-center items-center pr-4">
              {/* Mobile Logo */}
              <img 
                src="/images/logo_mobile.svg" 
                alt="Logo" 
                className="block sm:hidden h-8"
              />
              {/* Desktop Logo */}
              <img 
                src="/images/logo_desktop.svg" 
                alt="Logo" 
                className="hidden sm:block h-12"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-[#317bea] font-medium">
                Home
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-[#317bea] font-medium">
                Shop
              </Link>
              <Link to="/puja-booking" className="text-gray-700 hover:text-[#317bea] font-medium">
                Book a Puja
              </Link>
              {/* Astrology dropdown - commented out */}
              {/* <div className="relative group">
                <button className="text-gray-700 hover:text-[#317bea] font-medium flex items-center">
                  Astrology
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-1 rounded-md bg-white shadow-xs">
                    <Link to="/daily-horoscope" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Daily Horoscope
                    </Link>
                    <Link to="/birth-chart" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Birth Chart Analysis
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">New!</span>
                    </Link>
                  </div>
                </div>
              </div> */}
            </nav>

            {/* Search Bar and Location/Language */}
            <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-2xl mx-4">
              <div className="relative flex-1 search-container">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for products, pujas..."
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                  />
                  <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </form>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.type}-${suggestion.id}-${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center p-3 hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          {suggestion.image ? (
                            <ImageOptimized 
                              src={suggestion.image} 
                              alt={suggestion.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                {suggestion.type === 'puja' ? 'P' : 'S'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900 text-sm">{suggestion.name}</h3>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              suggestion.type === 'puja' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {suggestion.type === 'puja' ? 'Puja' : 'Product'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 capitalize">
                            {suggestion.category} • ₹{suggestion.price?.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div className="relative" ref={languageRef}>
                <button
                  className="text-sm text-gray-600 flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                >
                  <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                  <span>{selectedLanguage}</span>
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10">
                    <div className="py-1">
                     <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedLanguage('English');
                          setIsLanguageDropdownOpen(false);
                        }}
                      >
                        English
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedLanguage('हिन्दी');
                          setIsLanguageDropdownOpen(false);
                        }}
                      >
                        हिन्दी
                      </button>
                                           <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedLanguage('தமிழ்');
                          setIsLanguageDropdownOpen(false);
                        }}
                      >
                        தமிழ்
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedLanguage('తెలుగు');
                          setIsLanguageDropdownOpen(false);
                        }}
                      >
                        తెలుగు
                      </button>
                    </div>
                  </div>
                )}
              </div>


              {/* Location Selector */}
              <div className="relative" ref={locationRef}>
                <button
                  className="text-sm text-gray-600 flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                  <span>{selectedLocation}</span>
                </button>

                {isLocationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10 max-h-60 overflow-y-auto">
                    <div className="py-1">
                      {locations.map((location) => (
                        <button
                          key={location}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleLocationSelect(location)}
                        >
                          {location}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="lg:hidden text-gray-700 hover:text-[#317bea] p-2 rounded-full hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>

              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">
                          {currentUser.displayName?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                    <span className="text-gray-700 font-medium">
                      {/* {currentUser.displayName?.split(' ')[0] || 'User'} */}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      {userData?.addresses && userData.addresses.length > 0 && (
                        <button
                          onClick={handleSavedAddressesClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                        >
                          Saved Addresses ({userData.addresses.length})
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/signin" className="text-gray-600 hover:text-gray-900">
                  Sign in
                </Link>
              )}

              {currentUser && <NotificationBell />}

              {/* Coin Balance Display */}
              {currentUser && wallet && (
                <div className="hidden sm:flex items-center bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  <FontAwesomeIcon icon={faCoins} className="text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium text-sm">
                    {wallet.balance} Coins
                  </span>
                </div>
              )}

              <Link
                to="/cart"
                className="text-gray-700 hover:text-[#317bea] p-2 rounded-full hover:bg-gray-100 relative"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchVisible && (
            <div className="lg:hidden mt-4 search-container">
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for products, pujas..."
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                  />
                  <button type="submit" className="absolute right-0 top-0 mt-2 mr-3 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </form>

                {/* Mobile Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.type}-${suggestion.id}-${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center p-3 hover:bg-orange-50 border-b border-gray-100 last:border-b-0 transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          {suggestion.image ? (
                            <ImageOptimized 
                              src={suggestion.image} 
                              alt={suggestion.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                {suggestion.type === 'puja' ? 'P' : 'S'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-900 text-sm">{suggestion.name}</h3>
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                              suggestion.type === 'puja' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {suggestion.type === 'puja' ? 'Puja' : 'Product'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 capitalize">
                            {suggestion.category} • ₹{suggestion.price?.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50" style={{padding : '5px 5px 0px 30px'}}>
            {/* User Info Section */}
            {currentUser && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
                <div className="flex items-center">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      className="h-12 w-12 rounded-full mr-3 border-2 border-white"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3 border-2 border-white">
                      <span className="text-white text-lg font-semibold">
                        {currentUser.displayName?.[0] || 'U'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-semibold text-lg">{currentUser.displayName || 'User'}</p>
                    <p className="text-orange-100 text-sm">{currentUser.email}</p>
                    {wallet && (
                      <div className="flex items-center mt-1">
                        <FontAwesomeIcon icon={faCoins} className="text-yellow-300 mr-1" />
                        <span className="text-yellow-200 text-sm font-medium">
                          {wallet.balance} Coins
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="p-4 space-y-1">
              <Link 
                to="/" 
                className="flex items-center py-3 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium">Home</span>
              </Link>
              
              <Link 
                to="/shop" 
                className="flex items-center py-3 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium">Shop</span>
              </Link>
              
              <Link 
                to="/puja-booking" 
                className="flex items-center py-3 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium">Book a Puja</span>
              </Link>

              {/* Astrology Section - commented out */}
              {/* <div className="border-t border-gray-100 pt-3 mt-3">
                <p className="text-sm font-semibold text-gray-500 mb-2 px-3">Astrology</p>
                <Link 
                  to="/daily-horoscope" 
                  className="flex items-center py-2 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium">Daily Horoscope</span>
                </Link>
                <Link 
                  to="/birth-chart" 
                  className="flex items-center py-2 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium">Birth Chart Analysis</span>
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">New!</span>
                </Link>
              </div> */}

              {/* Cart */}
              <Link 
                to="/cart" 
                className="flex items-center py-3 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="mr-3 text-lg" />
                <span className="font-medium">Cart</span>
                {cartItems.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* User Account Section */}
              {currentUser ? (
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <Link 
                    to="/profile" 
                    className="flex items-center py-3 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-3 text-lg" />
                    <span className="font-medium">My Account</span>
                  </Link>
                  
                  {userData?.addresses && userData.addresses.length > 0 && (
                    <button 
                      onClick={() => {
                        handleSavedAddressesClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full py-3 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3 text-lg" />
                      <span className="font-medium">Saved Addresses</span>
                      <span className="ml-auto bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                        {userData.addresses.length}
                      </span>
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="flex items-center w-full py-3 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleProfileClick} 
                  className="flex items-center w-full py-3 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-3 text-lg" />
                  <span className="font-medium">Sign In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Saved Addresses Modal */}
      <SavedAddressesModal
        isOpen={isSavedAddressesModalOpen}
        onClose={() => setIsSavedAddressesModalOpen(false)}
        addresses={userData?.addresses || []}
        onEditAddress={handleEditAddress}
        onDeleteAddress={handleDeleteAddress}
        onAddAddress={handleAddAddress}
      />
    </>
  );
};

export default Header;