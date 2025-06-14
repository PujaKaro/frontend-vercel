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
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import NotificationBell from './NotificationBell';

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
  const [cartCount, setCartCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    const interval = setInterval(() => {
      const cartUpdated = sessionStorage.getItem('cartUpdated');
      if (cartUpdated) {
        updateCartCount();
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationDropdownOpen(false);
      }

      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
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
    navigate(`/shop?search=${searchTerm}`);
    setSearchTerm('');
    setIsSearchVisible(false);
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
        {/* <div className="container mx-auto px-4 py-2"> */}
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
              <div className="relative group">
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
              </div>
            </nav>

            {/* Search Bar and Location/Language */}
            <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-2xl mx-4">
              <form onSubmit={handleSearch} className="relative flex-1">
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
                      {currentUser.displayName?.split(' ')[0] || 'User'}
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
            <div className="lg:hidden mt-4">
              <form onSubmit={handleSearch} className="relative">
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
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t p-4 z-50">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-[#317bea] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/shop" className="text-gray-700 hover:text-[#317bea] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/puja-booking" className="text-gray-700 hover:text-[#317bea] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                Book a Puja
              </Link>
              <div className="border-t border-gray-100 pt-2">
                <p className="text-sm font-medium text-gray-500 mb-1">Astrology</p>
                <Link to="/daily-horoscope" className="text-gray-700 hover:text-[#317bea] font-medium py-2 pl-3 block" onClick={() => setIsMobileMenuOpen(false)}>
                  Daily Horoscope
                </Link>
                <Link to="/birth-chart" className="text-gray-700 hover:text-[#317bea] font-medium py-2 pl-3 block" onClick={() => setIsMobileMenuOpen(false)}>
                  Birth Chart Analysis
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">New!</span>
                </Link>
              </div>
              <Link to="/cart" className="text-gray-700 hover:text-[#317bea] font-medium py-2 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                Cart
                {cartCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={handleProfileClick} className="text-gray-700 hover:text-[#317bea] font-medium py-2 flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {isAuthenticated ? 'My Account' : 'Sign In'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;