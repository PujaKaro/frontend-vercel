import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTruck, 
  faClock, 
  faCheckCircle, 
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faHeart,
  faLeaf,
  faHandHoldingHeart,
  faStar,
  faFilter,
  faSearch,
  faArrowRight,
  faQuoteLeft,
  faUser,
  faCalendar,
  faGift,
  faShieldAlt,
  faThumbsUp,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { flowersAndMalaProducts, flowerCategories, servicePackages, testimonials } from '../data/flowersAndMalaData';
import { saveLead } from '../services/flowersMalaLeadsService';

const FlowersAndMala = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    sector: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('premium');
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Debug: Log when package changes
  useEffect(() => {
    console.log('Selected package changed to:', selectedPackage);
  }, [selectedPackage]);
  const [showProducts, setShowProducts] = useState(true);

  // Filter products based on category and search term
  const filteredProducts = flowersAndMalaProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Add to package function - adds product to selected products list
  const addToPackage = (product) => {
    // Clear service package selection when adding products
    setSelectedPackage('');
    
    setSelectedProducts(prev => {
      const existingProduct = prev.find(item => item.id === product.id);
      if (existingProduct) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    // Scroll to registration form to show selected products
    setTimeout(() => {
      const formElement = document.getElementById('registration-form');
      if (formElement) {
        formElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  // Remove product from selected products
  const removeFromSelectedProducts = (productId) => {
    setSelectedProducts(prev => prev.filter(item => item.id !== productId));
  };

  // Update product quantity in selected products
  const updateSelectedProductQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromSelectedProducts(productId);
      return;
    }
    setSelectedProducts(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare lead data
      const leadData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        city: formData.city,
        sector: formData.sector,
        address: formData.address,
        selectedProducts: selectedProducts.length > 0 ? selectedProducts : null,
        selectedPackage: selectedPackage || null,
        totalAmount: selectedProducts.length > 0 
          ? selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0)
          : servicePackages.find(pkg => pkg.id === selectedPackage)?.price || 0,
        submissionDate: new Date().toISOString(),
        status: 'pending'
      };

      // Save to Firebase
      const leadId = await saveLead(leadData);
      
      setSuccess('Your information has been saved successfully! We will contact you soon.');
      
      // Reset form
          setFormData({
            name: '',
            phone: '',
        email: '',
            city: '',
            sector: '',
            address: ''
          });
      setSelectedProducts([]);
      setSelectedPackage('premium');
    } catch (error) {
      setError('Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#FF8C00] to-[#FF6B35] text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Flowers & Mala Services
            </h1>
            <p className="mt-6 text-xl sm:text-2xl max-w-4xl mx-auto leading-relaxed">
              Connect your soul with the divine through our carefully curated floral offerings and sacred malas. 
              Experience spiritual fulfillment with fresh flowers and authentic malas delivered to your doorstep.
            </p>
             <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
               <button
                 onClick={() => {
                   // Scroll to the registration form
                   const formElement = document.getElementById('registration-form') ||
                                      document.querySelector('[data-form="registration"]') ||
                                      document.querySelector('form') ||
                                      document.querySelector('input[name="name"]')?.closest('form');
                   
                   if (formElement) {
                     formElement.scrollIntoView({ 
                       behavior: 'smooth',
                       block: 'center'
                     });
                   } else {
                     // Fallback: scroll to bottom of page where form should be
                     window.scrollTo({
                       top: document.body.scrollHeight,
                       behavior: 'smooth'
                     });
                   }
                 }}
                 className="bg-white text-[#FF8C00] px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center"
               >
                 <FontAwesomeIcon icon={faGift} className="mr-2" />
                 Subscribe Now
               </button>
               <button
                 onClick={() => setShowProducts(true)}
                 className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                   showProducts 
                     ? 'bg-white text-[#FF8C00] shadow-lg' 
                     : 'bg-white/20 text-white hover:bg-white/30'
                 }`}
               >
                 Browse Products
               </button>
               <button
                 onClick={() => setShowProducts(false)}
                 className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                   !showProducts 
                     ? 'bg-white text-[#FF8C00] shadow-lg' 
                     : 'bg-white/20 text-white hover:bg-white/30'
                 }`}
               >
                 Service Packages
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Value Proposition */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Experience the Divine Connection
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our Flowers & Mala services are designed to bring spiritual fulfillment while delivering quality and convenience. 
            Each offering is carefully selected to enhance your spiritual journey and maintain the sanctity of your rituals.
          </p>
        </div>

        {/* Search and Filter Section */}
        {showProducts && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search flowers and malas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-[#FF8C00] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {flowerCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'bg-[#FF8C00] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Section */}
        {showProducts && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Our Products ({filteredProducts.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#FF8C00] bg-[#FF8C00]/10 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{product.deliveryTime}</span>
                    </div>
                    <button
                      onClick={() => addToPackage(product)}
                      className="w-full bg-[#FF8C00] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#FF8C00]/90 transition-colors flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={faGift} className="mr-2" />
                      Add to Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Packages Section */}
        {!showProducts && (
          <div className="mb-16 service-packages-section">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Choose Your Service Package
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {servicePackages.map(pkg => (
                <div
                  key={pkg.id}
                  className={`relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 ${
                    pkg.popular ? 'ring-2 ring-[#FF8C00]' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#FF8C00] text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h4>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="text-3xl font-bold text-[#FF8C00] mb-2">₹{pkg.price}</div>
                    <div className="text-sm text-gray-500">{pkg.duration}</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      // Clear selected products when choosing a service package
                      setSelectedProducts([]);
                      setSelectedPackage(pkg.id);
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      selectedPackage === pkg.id
                        ? 'bg-[#FF8C00] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faLeaf} className="h-8 w-8 text-[#FF8C00] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fresh Flowers</h3>
            <p className="text-gray-600">Daily fresh flowers sourced from trusted vendors</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faHeart} className="h-8 w-8 text-[#FF8C00] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sacred Malas</h3>
            <p className="text-gray-600">Handcrafted malas with authentic materials</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faTruck} className="h-8 w-8 text-[#FF8C00] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Delivery</h3>
            <p className="text-gray-600">On orders above ₹500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-[#FF8C00] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Same Day Delivery</h3>
            <p className="text-gray-600">Order before 2 PM for same day delivery</p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What Our Customers Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-gray-600 mb-4">
                  <FontAwesomeIcon icon={faQuoteLeft} className="h-4 w-4 text-[#FF8C00] mr-2" />
                  {testimonial.comment}
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#FF8C00] rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
            </div>
            </div>
            </div>
            ))}
          </div>
        </div>


        {/* Registration Form */}
        <div id="registration-form" className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-12 sm:mb-16">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Submit Your Information</h2>
             <p className="text-lg text-gray-600">
               Fill in your details and we will contact you to confirm your flower and mala service order
             </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6" data-form="registration">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                
            <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                    placeholder="Enter your full name"
              />
            </div>

            <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                    placeholder="Enter your phone number"
              />
            </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                      placeholder="Enter your city"
                />
              </div>

              <div>
                    <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-2">
                      Sector/Area *
                </label>
                <input
                  type="text"
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                      placeholder="Enter your area"
                />
              </div>
            </div>

            <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address *
              </label>
              <textarea
                id="address"
                name="address"
                    rows="4"
                value={formData.address}
                onChange={handleChange}
                required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>

              <div className="space-y-6">
                {/* Selected Products */}
                {selectedProducts.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FontAwesomeIcon icon={faGift} className="mr-2 text-blue-600" />
                      Selected Products ({selectedProducts.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedProducts.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">₹{item.price} each</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateSelectedProductQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateSelectedProductQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromSelectedProducts(item.id)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">Products Total:</span>
                          <span className="font-bold text-blue-600">
                            ₹{selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900 mb-4">Selected Package</h3>
                
                {/* Selection Status */}
                {selectedProducts.length === 0 && !selectedPackage && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faGift} className="h-5 w-5 text-yellow-600 mr-2" />
                      <p className="text-yellow-800 font-medium">
                        Please select either individual products OR a service package
                      </p>
                    </div>
                  </div>
                )}
                
                {servicePackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                      selectedPackage === pkg.id
                        ? 'border-[#FF8C00] bg-[#FF8C00]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      // Clear selected products when choosing a service package
                      setSelectedProducts([]);
                      setSelectedPackage(pkg.id);
                      console.log('Package selected in registration form:', pkg.id, pkg.name);
                    }}
                  >
                    {selectedPackage === pkg.id && (
                      <div className="absolute -top-2 -right-2 bg-[#FF8C00] text-white text-xs px-2 py-1 rounded-full font-medium">
                        SELECTED
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                      <div className="text-2xl font-bold text-[#FF8C00]">₹{pkg.price}</div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                    <div className="text-xs text-gray-500">{pkg.duration}</div>
                  </div>
                ))}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Package Benefits - {servicePackages.find(pkg => pkg.id === selectedPackage)?.name}
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {servicePackages.find(pkg => pkg.id === selectedPackage)?.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <button
                type="submit"
                className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
                  loading || (selectedProducts.length === 0 && !selectedPackage)
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed focus:ring-gray-400'
                    : 'text-white bg-[#FF8C00] hover:bg-[#FF8C00]/90 focus:ring-[#FF8C00]'
                }`}
                disabled={loading || (selectedProducts.length === 0 && !selectedPackage)}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faArrowRight} className="mr-2" />
                     Submit Information - ₹{(() => {
                       if (selectedProducts.length > 0) {
                         // If products are selected, use products total
                         return selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0);
                       } else if (selectedPackage) {
                         // If service package is selected, use package price
                         return servicePackages.find(pkg => pkg.id === selectedPackage)?.price || 0;
                       }
                       return 0;
                     })()}
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {loading && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                  <p className="text-blue-700">Processing your request...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faShieldAlt} className="h-4 w-4 text-red-600 mr-3" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faThumbsUp} className="h-4 w-4 text-green-600 mr-3" />
                  <p className="text-green-700">{success}</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-[#FF8C00] to-[#FF6B35] rounded-lg p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Get in Touch</h3>
            <p className="text-xl opacity-90">
              Have questions about our services? We're here to help you on your spiritual journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faPhone} className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Call Us</h4>
              <p className="text-lg opacity-90 mb-2">+91 8800627513</p>
              <p className="text-sm opacity-75">Available 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faEnvelope} className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Email Us</h4>
              <p className="text-lg opacity-90 mb-2">pujakaro.in@gmail.com</p>
              <p className="text-sm opacity-75">Quick response guaranteed</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Visit Us</h4>
              <p className="text-lg opacity-90 mb-2">G-275 Molarband Extn.</p>
              <p className="text-sm opacity-75">New Delhi, India</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button className="bg-white text-[#FF8C00] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              <FontAwesomeIcon icon={faGift} className="mr-2" />
              Get Free Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Floating Subscribe Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            // Scroll to the registration form with multiple selectors
            const formElement = document.getElementById('registration-form') ||
                               document.querySelector('[data-form="registration"]') ||
                               document.querySelector('form') ||
                               document.querySelector('input[name="name"]')?.closest('form');
            
            if (formElement) {
              formElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
              });
            } else {
              // Fallback: scroll to bottom of page where form should be
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
            }
          }}
          className="bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 animate-pulse"
        >
          <FontAwesomeIcon icon={faGift} className="h-5 w-5" />
          <span className="font-semibold">Subscribe Now</span>
        </button>
      </div>
    </div>
  );
};

export default FlowersAndMala; 