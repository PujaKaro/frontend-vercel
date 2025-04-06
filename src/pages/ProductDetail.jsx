import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart, faShoppingCart, faClock, faCalendarAlt, faArrowLeft, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { products, pujaServices, getSuggestedProducts, getSuggestedPujas, pandits, getPanditById } from '../data/data';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const [item, setItem] = useState(null);
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [itemType, setItemType] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  
  // Mock additional images for all products
  const [additionalImages, setAdditionalImages] = useState([]);
  
  useEffect(() => {
    // Determine if this is a product or puja service
    const typeFromPath = location.pathname.includes('/product/') ? 'product' : 'puja';
    setItemType(typeFromPath);
    
    let foundItem;
    let suggestions;
    
    if (typeFromPath === 'product') {
      foundItem = products.find(product => product.id === parseInt(id));
      suggestions = getSuggestedProducts(id);
    } else {
      foundItem = pujaServices.find(puja => puja.id === parseInt(id));
      suggestions = getSuggestedPujas(id);
    }
    
    setItem(foundItem);
    setSuggestedItems(suggestions);
    
    // Generate additional mock images
    if (foundItem) {
      const mockImages = [
        foundItem.image,
        '/images/ganesh.jpg',
        '/images/featuredPuja.jpg',
        '/images/ganesh.jpg',
      ];
      setAdditionalImages(mockImages);
      setActiveImage(0);
    }
  }, [id, location.pathname]);
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // In a real app, you would persist this to a database or context
  };
  
  const handleAddToCart = () => {
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(cartItem => 
      cartItem.id === item.id && cartItem.type === itemType
    );
    
    if (existingItemIndex >= 0) {
      // Increment quantity if item already exists
      existingCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      existingCart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        type: itemType
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show success message
    toast.success(`${item.name} added to cart successfully!`);
    
    // Force a refresh on header component by updating sessionStorage
    sessionStorage.setItem('cartUpdated', Date.now().toString());
  };
  
  const handleBookNow = () => {
    if (!selectedDate) {
      toast.warning('Please select a date for your puja booking');
      return;
    }
    
    if (!selectedTime) {
      toast.warning('Please select a time slot for your puja booking');
      return;
    }
    
    // Navigate to booking form with selected item details
    navigate(`/booking-form/${id}`, { 
      state: { 
        puja: item,
        date: selectedDate,
        timeSlot: selectedTime
      } 
    });
  };
  
  // Truncate text with read more functionality
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength || showFullDescription) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span>Back</span>
        </button>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <div className="relative">
                {/* Main Image */}
                <div className="h-64 md:h-96 bg-gray-200 relative">
                  <img 
                    src={additionalImages[activeImage]} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
                  >
                    <FontAwesomeIcon 
                      icon={isWishlisted ? faHeart : farHeart} 
                      className={`text-xl ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}
                    />
                  </button>
                </div>
                
                {/* Thumbnail Images */}
                <div className="flex mt-2 space-x-2 overflow-x-auto py-2">
                  {additionalImages.map((img, index) => (
                    <div 
                      key={index} 
                      className={`w-16 h-16 flex-shrink-0 cursor-pointer border-2 ${index === activeImage ? 'border-blue-500' : 'border-transparent'}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img 
                        src={img} 
                        alt={`${item.name} view ${index+1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="md:w-1/2 p-6 md:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FontAwesomeIcon icon={faStar} />
                  <span className="ml-1 text-gray-800">{item.rating}</span>
                </div>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{item.reviews} reviews</span>
                
                {itemType === 'puja' && (
                  <>
                    <span className="mx-2 text-gray-400">•</span>
                    <div className="flex items-center text-gray-600">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      <span>{item.duration}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="text-2xl font-bold text-blue-600 mb-6">
                ₹{item.price.toLocaleString()}
                {itemType === 'product' && item.discount > 0 && (
                  <span className="ml-2 text-sm text-green-600">
                    ({item.discount}% off)
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-600">
                  {itemType === 'puja' 
                    ? truncateText(item.longDescription, 200) 
                    : truncateText(item.description, 150)
                  }
                </p>
                {((itemType === 'puja' && item.longDescription && item.longDescription.length > 200) || 
                  (itemType === 'product' && item.description && item.description.length > 150)) && (
                  <button 
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-2 flex items-center"
                  >
                    {showFullDescription ? 'Show less' : 'Read more'}
                    <FontAwesomeIcon 
                      icon={showFullDescription ? faChevronDown : faChevronRight} 
                      className="ml-1 text-xs"
                    />
                  </button>
                )}
              </div>
              
              {itemType === 'puja' && (
                <>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Requirements</h2>
                    <ul className="list-disc pl-5 text-gray-600">
                      {item.requirements.map((req, index) => (
                        <li key={index} className="mb-1">{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Ritual Steps</h2>
                    <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                      <li>Sankalpa (Statement of Intent) - Stating the purpose of performing the puja</li>
                      <li>Setup of puja items in the correct positions according to Vedic guidelines</li>
                      <li>Invocation of the deity through mantras and offerings</li>
                      <li>Main worship ritual with specific mantras for {item.name}</li>
                      <li>Offering of flowers, incense, and food items to the deity</li>
                      <li>Aarti (ritual of light) accompanied by devotional songs</li>
                      <li>Distribution of prasad (blessed offerings)</li>
                    </ol>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Key Mantras</h2>
                    <div className="bg-gray-50 p-3 rounded-md font-serif">
                      <p className="text-gray-800 mb-2">Om Namah Shivaya</p>
                      <p className="text-gray-800 mb-2">Om Namo Bhagavate Vasudevaya</p>
                      <p className="text-gray-800">Om Gam Ganapataye Namaha</p>
                      <p className="text-xs text-gray-500 mt-2">* Actual mantras may vary based on specific puja requirements</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Spiritual Significance</h2>
                    <p className="text-gray-600">
                      {item.name} is performed to {item.occasions.includes('peace') ? 'bring peace and harmony' : 
                        item.occasions.includes('prosperity') ? 'attract prosperity and wealth' : 
                        item.occasions.includes('house-warming') ? 'bless a new home with positive energy' : 
                        'connect with divine energy and receive blessings'}. According to Hindu traditions, this ceremony creates a powerful spiritual 
                      connection with the divine forces and helps remove obstacles from one's life path.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Available Pandits</h2>
                    <div className="space-y-3">
                      {item.pandits.map(panditId => {
                        const pandit = getPanditById(panditId);
                        return (
                          <div key={panditId} className="flex items-center">
                            <img 
                              src={pandit.image} 
                              alt={pandit.name}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium">{pandit.name}</p>
                              <p className="text-sm text-gray-600">{pandit.specialization}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Select Date & Time</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">Time Slot</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                        >
                          <option value="">Select a time slot</option>
                          {item.availableTimeSlots.map((slot, index) => (
                            <option key={index} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {itemType === 'product' && (
                <>
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Features</h2>
                    <ul className="list-disc pl-5 text-gray-600">
                      {item.features.map((feature, index) => (
                        <li key={index} className="mb-1">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Ritual Usage</h2>
                    <p className="text-gray-600 mb-3">
                      This {item.name.toLowerCase()} is commonly used in the following pujas and rituals:
                    </p>
                    <ul className="list-disc pl-5 text-gray-600">
                      {item.category === 'puja-items' && (
                        <>
                          <li>Daily worship ceremonies (Nitya Puja)</li>
                          <li>Satyanarayan Puja</li>
                          <li>Griha Pravesh (Housewarming) ceremony</li>
                          <li>Navratri celebrations</li>
                        </>
                      )}
                      {item.category === 'idols' && (
                        <>
                          <li>Home temple installation</li>
                          <li>Special festival celebrations</li>
                          <li>Meditation and devotional practices</li>
                        </>
                      )}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Placement & Care</h2>
                    <p className="text-gray-600 mb-2">
                      According to Hindu traditions, proper placement and care of religious items is important:
                    </p>
                    <ul className="list-disc pl-5 text-gray-600">
                      {item.category === 'puja-items' && (
                        <>
                          <li>Store in a clean, elevated place away from foot traffic</li>
                          <li>Avoid placing on the floor or in impure areas</li>
                          <li>Clean regularly with a dry cloth</li>
                          <li>For brass/metal items: polish occasionally with appropriate metal cleaners</li>
                        </>
                      )}
                      {item.category === 'idols' && (
                        <>
                          <li>Place in the northeast (Ishan) corner of your home or in a dedicated temple area</li>
                          <li>Position facing west or south for optimal energy flow</li>
                          <li>Clean gently with a soft dry cloth</li>
                          <li>Avoid placing directly under sunlight to prevent color fading</li>
                        </>
                      )}
                    </ul>
                  </div>
                </>
              )}
              
              {itemType === 'product' ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Add to Cart
                </button>
              ) : (
                <button
                  onClick={handleBookNow}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Suggested Products Section */}
        {suggestedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {itemType === 'product' ? 'Similar Products' : 'Related Pujas'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedItems.map(item => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/${itemType === 'product' ? 'product' : 'puja-booking'}/${item.id}`)}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-blue-600 font-bold">₹{item.price.toLocaleString()}</div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;