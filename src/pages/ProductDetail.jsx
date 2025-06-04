import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart, faShoppingCart, faClock, faCalendarAlt, faArrowLeft, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SEO from '../components/SEO';
import { trackProductView, trackAddToCart } from '../utils/analytics';
import useNavigationTracker from '../hooks/useNavigationTracker';
import { 
  getProductById, 
  getPujaById, 
  getSuggestedProducts, 
  getSuggestedPujas, 
  getPanditById 
} from '../utils/dataUtils';

const ProductDetail = () => {
  // Use the navigation tracker hook to enable page navigation notifications
  useNavigationTracker();
  
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
  const [seoData, setSeoData] = useState(null);
  
  // Mock additional images for all products
  const [additionalImages, setAdditionalImages] = useState([]);
  
  // Add a loading state to manage the data fetching process
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Determine if this is a product or puja service
    const typeFromPath = location.pathname.includes('/product/') ? 'product' : 'puja';
    setItemType(typeFromPath);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let foundItem;
        
        // Fetch the appropriate item based on the path type
        if (typeFromPath === 'product') {
          foundItem = await getProductById(id);
        } else {
          foundItem = await getPujaById(id);
        }
        
        // Only proceed if we found a valid item
        if (foundItem) {
          setItem(foundItem);
          
          // Get related items
          let suggestions = [];
          if (typeFromPath === 'product') {
            // Get similar products from the same category
            suggestions = await getSuggestedProducts(id, 3);
          } else {
            // Get suggested pujas
            suggestions = await getSuggestedPujas(id, 3);
          }
          setSuggestedItems(suggestions || []);
          
          // Generate additional mock images
          const mockImages = [
            foundItem.image || '/images/featuredPuja.jpg',
          ];
          setAdditionalImages(mockImages);
          setActiveImage(0);
          
          // Generate SEO data based on item type
          if (typeFromPath === 'product' && foundItem.category) {
            generateProductSEO(foundItem);
          } else if (typeFromPath === 'puja') {
            generatePujaSEO(foundItem);
          }
          
          // Track product view in Google Analytics when product is loaded
          trackProductView(foundItem);
        } else {
          setError('Item not found');
          toast.error('Item not found');
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
        setError('Failed to load item details');
        toast.error('Failed to load item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, location.pathname]);
  
  // Generate SEO data for products
  const generateProductSEO = (product) => {
    if (!product || !product.category) return;
    
    // Create breadcrumb schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://pujakaro.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Shop",
          "item": "https://pujakaro.com/shop"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": `https://pujakaro.com/product/${product.id}`
        }
      ]
    };
    
    // Create product schema
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": additionalImages.map(img => img ? (img.startsWith('/') ? `https://pujakaro.com${img}` : img) : ""),
      "description": product.description || "",
      "sku": `PUJA-PROD-${product.id}`,
      "mpn": `P${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "PujaKaro"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://pujakaro.com/product/${product.id}`,
        "priceCurrency": "INR",
        "price": product.price || 0,
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "PujaKaro"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || 4.5,
        "reviewCount": product.reviews || 22,
        "bestRating": 5,
        "worstRating": 1
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Priya Sharma"
          },
          "datePublished": "2023-04-15",
          "reviewBody": `I purchased this ${product.name} for my home temple. The quality is excellent and the delivery was fast. Highly recommended!`
        }
      ]
    };
    
    // Set SEO data
    setSeoData({
      title: `${product.name} - Premium Religious Items | PujaKaro`,
      description: product.description && product.description.length > 160 ? 
        `${product.description.substring(0, 157)}...` : 
        (product.description || "Premium religious items for your home temple"),
      canonicalUrl: `https://pujakaro.com/product/${product.id}`,
      imageUrl: product.image ? (product.image.startsWith('/') ? `https://pujakaro.com${product.image}` : product.image) : "",
      type: "product",
      schema: [breadcrumbSchema, productSchema],
      keywords: [product.name, product.category, "religious items", "puja items", "hindu worship", "home temple", ...(product.tags || [])]
    });
  };
  
  // Generate SEO data for puja services
  const generatePujaSEO = (puja) => {
    // Early return if puja is invalid
    if (!puja) return;
    
    try {
      // Create breadcrumb schema
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://pujakaro.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Puja Services",
            "item": "https://pujakaro.com/puja-booking"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": puja.name || "Puja Service",
            "item": `https://pujakaro.com/puja-booking/${puja.id}`
          }
        ]
      };
      
      // Create service schema
      const serviceSchema = {
        "@context": "https://schema.org/",
        "@type": "Service",
        "name": puja.name || "Puja Service",
        "serviceType": "Religious Service",
        "image": puja.image ? (puja.image.startsWith('/') ? `https://pujakaro.com${puja.image}` : puja.image) : "",
        "description": puja.longDescription || puja.description || "",
        "provider": {
          "@type": "Organization",
          "name": "PujaKaro"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://pujakaro.com/puja-booking/${puja.id}`,
          "priceCurrency": "INR",
          "price": puja.price || 0,
          "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          "availability": "https://schema.org/InStock",
          "validFrom": new Date().toISOString().split('T')[0]
        },
        "areaServed": {
          "@type": "City",
          "name": "Mumbai",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": puja.rating || 5,
          "reviewCount": puja.reviews || 15,
          "bestRating": 5,
          "worstRating": 1
        },
        "review": [
          {
            "@type": "Review",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Raj Patel"
            },
            "datePublished": "2023-05-20",
            "reviewBody": `We had an excellent experience with the ${puja.name || "puja service"} conducted by PujaKaro. The pandit was very knowledgeable and performed all rituals perfectly.`
          }
        ]
      };
      
      // Set SEO data
      setSeoData({
        title: `${puja.name || "Puja Service"} - Book Authentic Puja Services | PujaKaro`,
        description: puja.description && puja.description.length > 160 ? 
          `${puja.description.substring(0, 157)}...` : 
          (puja.description || "Book authentic puja services with experienced pandits"),
        canonicalUrl: `https://pujakaro.com/puja-booking/${puja.id}`,
        imageUrl: puja.image ? (puja.image.startsWith('/') ? `https://pujakaro.com${puja.image}` : puja.image) : "",
        type: "service",
        schema: [breadcrumbSchema, serviceSchema],
        keywords: [
          puja.name || "puja service", 
          "puja services", 
          "hindu rituals", 
          "religious ceremonies", 
          puja.occasion || "", 
          puja.category || ""
        ]
      });
    } catch (error) {
      console.error("Error generating SEO data:", error);
    }
  };
  
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
    
    // Track add to cart event in Google Analytics
    trackAddToCart(item, 1);
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
  
  // Update the loading and error states
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-xl text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "We couldn't find the item you're looking for."}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {seoData && <SEO {...seoData} />}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span>Back</span>
        </button>
        
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link to={itemType === 'product' ? '/shop' : '/puja-booking'} className="text-sm text-gray-600 hover:text-gray-900">
                  {itemType === 'product' ? 'Shop' : 'Puja Services'}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm text-gray-500" aria-current="page">{item.name}</span>
              </div>
            </li>
          </ol>
        </nav>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <div className="relative">
                {/* Main Image */}
                <div className="h-64 md:h-96 bg-gray-200 relative">
                  <img 
                    src={additionalImages[activeImage]} 
                    alt={`${item.name} - Main view ${activeImage+1}`}
                    className="w-full h-full object-cover"
                    loading="eager" // Load main image immediately
                  />
                  <button 
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
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
                        alt={`${item.name} thumbnail ${index+1}`}
                        className="w-full h-full object-cover"
                        loading="lazy" // Lazy load thumbnails
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

              <div className="services-section mb-6">
                <h4 className="text-lg font-semibold mb-3">Services Included</h4>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Pandit Service</li>
                  <li>Samagri Kit</li>
                  <li>Home Decoration</li>
                </ul>
              </div>

              {itemType === 'puja' && (
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
                        min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
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
                </div>)}

              {itemType === 'product' ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center mb-4"

                >
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  Add to Cart
                </button>
              ) : (
                <button
                  onClick={handleBookNow}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium flex items-center justify-center mb-4"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  Book Now
                </button>
              )}
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
                  
                  {/* <div className="mb-6">
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
                   */}
                  {/* <div className="mb-6">
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
                  </div> */}
                  
                  {/* {itemType === 'puja' && item.pandits && item.pandits.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">Available Pandits</h2>
                      <div className="space-y-3">
                        {item.pandits.map((panditId, index) => (
                          <div key={`pandit-${index}-${panditId}`} className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                              <span className="text-gray-500">{typeof panditId === 'string' ? panditId.charAt(0).toUpperCase() : 'P'}</span>
                            </div>
                            <div>
                              <p className="font-medium">Pandit {panditId}</p>
                              <p className="text-sm text-gray-600">Ritual Specialist</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                  
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
                      loading="lazy" // Lazy load suggested items
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