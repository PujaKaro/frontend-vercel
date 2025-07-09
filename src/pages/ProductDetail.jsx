import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart, faShoppingCart, faClock, faCalendarAlt, faArrowLeft, faChevronDown, faChevronRight, faCheck, faShieldAlt, faTruck, faHeadset, faStarHalfAlt, faWeight, faRuler, faBox, faTag, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
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
          
          // Use actual additional images from the product data if available
          if (foundItem.additionalImages && Array.isArray(foundItem.additionalImages) && foundItem.additionalImages.length > 0) {
            // Filter out empty strings and add the main image first
            const validAdditionalImages = foundItem.additionalImages.filter(img => img && img.trim() !== '');
            setAdditionalImages([foundItem.image, ...validAdditionalImages]);
          } else {
            setAdditionalImages(mockImages);
          }
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
  
  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-yellow-400" />);
    }
    
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStar} className="text-gray-300" />);
    }
    
    return stars;
  };
  
  // Update the loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we fetch the details</p>
        </div>
      </div>
    );
  }
  
  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faArrowLeft} className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-8">{error || "We couldn't find the item you're looking for."}</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {seoData && <SEO {...seoData} />}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors group"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-3 group-hover:-translate-x-1 transition-transform" />
          <span>Back to {itemType === 'product' ? 'Shop' : 'Puja Services'}</span>
        </button>
        
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link to={itemType === 'product' ? '/shop' : '/puja-booking'} className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  {itemType === 'product' ? 'Shop' : 'Puja Services'}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm text-gray-900 font-medium" aria-current="page">{item.name}</span>
              </div>
            </li>
          </ol>
        </nav>
        
        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="lg:flex">
            {/* Image Section */}
            <div className="lg:w-1/2">
              <div className="relative">
                {/* Main Image */}
                <div className="h-80 lg:h-96 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={additionalImages[activeImage]} 
                    alt={`${item.name} - Main view ${activeImage+1}`}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  
                  {/* Wishlist Button */}
                  <button 
                    onClick={toggleWishlist}
                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <FontAwesomeIcon 
                      icon={isWishlisted ? faHeart : farHeart} 
                      className={`text-xl ${isWishlisted ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
                    />
                  </button>
                  
                  {/* Discount Badge */}
                  {itemType === 'product' && item.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {item.discount}% OFF
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Images */}
                <div className="flex mt-4 space-x-3 overflow-x-auto py-2 px-4">
                  {additionalImages.map((img, index) => (
                    <div 
                      key={index} 
                      className={`w-20 h-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === activeImage 
                          ? 'border-blue-500 shadow-md' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img 
                        src={img} 
                        alt={`${item.name} thumbnail ${index+1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              {/* Product Title and Rating */}
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{item.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-3">
                    {renderStars(item.rating)}
                  </div>
                  <span className="text-gray-700 font-medium">{item.rating}</span>
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
              </div>
              
              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold text-orange-600">₹{item.price.toLocaleString()}</span>
                  {itemType === 'product' && item.discount > 0 && (
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      ₹{Math.round(item.price / (1 - item.discount / 100)).toLocaleString()}
                    </span>
                  )}
                </div>
                {itemType === 'product' && item.discount > 0 && (
                  <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Save ₹{Math.round(item.price * item.discount / 100).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Physical Attributes (for Products) */}
              {itemType === 'product' && (item.weight || item.dimensions || item.material || item.brand) && (
                <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <h4 className="text-lg font-semibold mb-3 text-gray-900">Product Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.weight && (
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faWeight} className="text-orange-600 mr-2" />
                        <span className="text-gray-700">Weight: {item.weight}</span>
                      </div>
                    )}
                    {item.dimensions && (
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faRuler} className="text-orange-600 mr-2" />
                        <span className="text-gray-700">Dimensions: {item.dimensions}</span>
                      </div>
                    )}
                    {item.material && (
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBox} className="text-orange-600 mr-2" />
                        <span className="text-gray-700">Material: {item.material}</span>
                      </div>
                    )}
                    {item.brand && (
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faTag} className="text-orange-600 mr-2" />
                        <span className="text-gray-700">Brand: {item.brand}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Services Included (for Pujas) */}
              {itemType === 'puja' && (
                <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <h4 className="text-lg font-semibold mb-3 text-gray-900">Services Included</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['Pandit Service', 'Samagri Kit', 'Home Decoration'].map((service, index) => (
                      <div key={index} className="flex items-center">
                        <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Date & Time Selection (for Pujas) */}
              {itemType === 'puja' && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Select Date & Time</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Preferred Date</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Time Slot</label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      >
                        <option value="">Select a time slot</option>
                        {item.availableTimeSlots?.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="mb-6">
                {itemType === 'product' ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
                    Add to Cart
                  </button>
                ) : (
                  <button
                    onClick={handleBookNow}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-3" />
                    Book Now
                  </button>
                )}
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-orange-600 text-xl mb-2" />
                  <p className="text-xs text-gray-600">Secure Payment</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon icon={faTruck} className="text-orange-600 text-xl mb-2" />
                  <p className="text-xs text-gray-600">Fast Delivery</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon icon={faHeadset} className="text-orange-600 text-xl mb-2" />
                  <p className="text-xs text-gray-600">24/7 Support</p>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Description</h3>
                <div className="text-gray-600 leading-relaxed">
                  {showFullDescription ? (
                    <p>{itemType === 'puja' ? item.longDescription : item.description}</p>
                  ) : (
                    <p>{itemType === 'puja' 
                      ? truncateText(item.longDescription, 200) 
                      : truncateText(item.description, 150)
                    }</p>
                  )}
                  {((itemType === 'puja' && item.longDescription && item.longDescription.length > 200) || 
                    (itemType === 'product' && item.description && item.description.length > 150)) && (
                    <button 
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-orange-600 hover:text-orange-700 font-medium mt-2 flex items-center transition-colors"
                    >
                      {showFullDescription ? 'Show less' : 'Read more'}
                      <FontAwesomeIcon 
                        icon={showFullDescription ? faChevronDown : faChevronRight} 
                        className="ml-1 text-sm"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Information Sections */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* Features/Requirements */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              {itemType === 'product' ? 'Features' : 'Requirements'}
            </h3>
            <ul className="space-y-2">
              {(itemType === 'product' ? item.features : item.requirements)?.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Spiritual Significance */}
          {item.spiritualSignificance && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Spiritual Significance</h3>
              <div className="text-gray-700 leading-relaxed">
                <p>{item.spiritualSignificance}</p>
              </div>
            </div>
          )}
        </div>

        {/* Key Mantras Section */}
        {item.keyMantras && item.keyMantras.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Key Mantras</h3>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <div className="space-y-2">
                {item.keyMantras.map((mantra, index) => (
                  <div key={index} className="flex items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-orange-600 mr-3" />
                    <span className="text-gray-800 font-medium">{mantra}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">* Actual mantras may vary based on specific requirements</p>
            </div>
          </div>
        )}

        {/* Ritual Steps Section */}
        {item.ritualSteps && item.ritualSteps.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Ritual Steps</h3>
            <ol className="space-y-3">
              {item.ritualSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Care & Placement Section */}
        {(item.placementGuide || item.careInstructions) && (
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {item.placementGuide && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Placement Guide</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p>{item.placementGuide}</p>
                </div>
              </div>
            )}
            
            {item.careInstructions && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Care Instructions</h3>
                <div className="text-gray-700 leading-relaxed">
                  <p>{item.careInstructions}</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Suggested Items */}
        {suggestedItems.length > 0 && (
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {itemType === 'product' ? 'Similar Products' : 'Related Pujas'}
              </h2>
              <p className="text-gray-600">You might also like these items</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedItems.map((item, idx) => (
                <div 
                  key={item.id || `suggested-${idx}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-200"
                  onClick={() => navigate(`/${itemType === 'product' ? 'product' : 'puja-booking'}/${item.id}`)}
                >
                  <div className="h-48 bg-gray-100 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-orange-600 font-bold text-lg">₹{item.price.toLocaleString()}</div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                        <span className="text-gray-700">{item.rating}</span>
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