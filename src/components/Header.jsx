import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUser, 
  faBars, 
  faTimes, 
  faSearch, 
  faMapMarkerAlt, 
  faGlobe 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Select Location');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    };
    
    // Update count on mount
    updateCartCount();
    
    // Listen for changes to localStorage
    window.addEventListener('storage', updateCartCount);
    
    // Also check for sessionStorage cartUpdated flag
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

  return (
    <header className={`sticky top-0 z-50 bg-white ${isScrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl sm:text-2xl font-bold text-custom">
            PujaKaro
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
            {/* <Link to="/flowers-and-mala" className="text-gray-700 hover:text-[#317bea] font-medium">
              Flowers & Mala
            </Link>
            <Link to="/prashad-services" className="text-gray-700 hover:text-[#317bea] font-medium">
              Prashad Services
            </Link> */}
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
            <div className="relative">
              <button 
                className="text-sm text-gray-600 flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              >
                <FontAwesomeIcon icon={faGlobe} className="mr-1" />
                <span>English</span>
              </button>
              
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10">
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">हिन्दी</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">தமிழ்</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">తెలుగు</button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Location Selector */}
            <div className="relative">
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

            <button 
              onClick={handleProfileClick}
              className="text-gray-700 hover:text-[#317bea] p-2 rounded-full hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={faUser} />
              {isAuthenticated && (
                <span className="ml-2 hidden lg:inline-block">
                  {currentUser?.name?.split(' ')[0] || 'Profile'}
                </span>
              )}
            </button>
            
            <Link 
              to="/cart" 
              className="text-gray-700 hover:text-[#317bea] p-2 rounded-full hover:bg-gray-100 relative"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
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
        <div className="lg:hidden bg-white border-t py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/"
              className="py-2 text-gray-700 hover:text-[#317bea] font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/shop"
              className="py-2 text-gray-700 hover:text-[#317bea] font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              to="/puja-booking"
              className="py-2 text-gray-700 hover:text-[#317bea] font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book a Puja
            </Link>
            {/* <Link 
              to="/flowers-and-mala"
              className="py-2 text-gray-700 hover:text-[#317bea] font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Flowers & Mala
            </Link>
            <Link 
              to="/prashad-services"
              className="py-2 text-gray-700 hover:text-[#317bea] font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Prashad Services
            </Link> */}
            
            <div className="border-t border-gray-200 pt-4">
              <Link 
                to={isAuthenticated ? "/profile" : "/signin"}
                className="py-2 text-gray-700 hover:text-[#317bea] font-medium flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {isAuthenticated ? 'My Account' : 'Sign In / Register'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;