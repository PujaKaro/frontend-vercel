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
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Select Location');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const locations = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  useEffect(() => {
    // Mock cart items count - In a real app, this would be fetched from a cart state/context
    setCartItemsCount(3);
    
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

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    navigate(`/shop?search=${searchTerm}`);
    setSearchTerm('');
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/signin');
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationDropdownOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 bg-white ${isScrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
      {/* Top Bar */}
      <div className="bg-gray-100 py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-600">Welcome to PujaKaro</div>
          
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button 
                className="text-sm text-gray-600 flex items-center"
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
                className="text-sm text-gray-600 flex items-center"
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
        </div>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#317bea]">
            PujaKaro
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#317bea] font-medium">
              Home
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-[#317bea] font-medium">
              Shop
            </Link>
            <Link to="/pujaBooking" className="text-gray-700 hover:text-[#317bea] font-medium">
              Book a Puja
            </Link>
          </nav>
          
          {/* Search Bar */}
          <div className="hidden md:block w-1/3">
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
          
          {/* Icons */}
          <div className="flex items-center space-x-4">
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
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            <form onSubmit={handleSearch} className="relative mb-4">
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
              to="/pujaBooking"
              className="py-2 text-gray-700 hover:text-[#317bea] font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book a Puja
            </Link>
            
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