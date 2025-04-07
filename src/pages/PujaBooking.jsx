import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faCalendar, 
  faClock, 
  faMapMarkerAlt, 
  faFilter, 
  faStar, 
  faChevronDown, 
  faChevronUp, 
  faQuestionCircle,
  faTimes,
  faUser,
  faPhoneAlt,
  faCheckCircle,
  faLanguage
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { pujaServices } from '../data/data';
import SEO from '../components/SEO';

const PujaBooking = () => {
  const [pujas, setPujas] = useState([]);
  const [filteredPujas, setFilteredPujas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showPanditModal, setShowPanditModal] = useState(false);
  const [selectedPuja, setSelectedPuja] = useState(null);
  const [selectedPandit, setSelectedPandit] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // FAQ data
  const faqs = [
    {
      question: "What items do I need to arrange for the puja?",
      answer: "Most pujas require standard items like flowers, fruits, incense sticks, and lamps. Our pandits will provide you with a detailed list of required items after booking. Additionally, you can opt for our puja samagri kit that includes all necessary items for an additional cost."
    },
    {
      question: "How far in advance should I book a puja?",
      answer: "We recommend booking at least 3-7 days in advance to ensure availability of our experienced pandits. For auspicious dates or festivals, booking 2-3 weeks ahead is advisable as these are high-demand periods."
    },
    {
      question: "Can I reschedule a booked puja?",
      answer: "Yes, you can reschedule a booked puja up to 24 hours before the scheduled time without any extra charges. Rescheduling requests made within 24 hours may incur a nominal fee."
    },
    {
      question: "Do you perform pujas outside the listed cities?",
      answer: "Currently, our services are available in the major cities listed. However, for locations within 50km of these cities, we can arrange services with an additional travel charge. Please contact our customer support for more details."
    },
    {
      question: "How experienced are your pandits?",
      answer: "All our pandits have a minimum of 10 years of experience performing various Vedic rituals and are well-versed in Sanskrit mantras and traditional procedures. They are carefully vetted for their knowledge, authenticity, and ability to explain the significance of each ritual."
    }
  ];

  // Define JSON-LD schemas
  const createStructuredData = () => {
    // Service schema
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://pujakaro.com/#pujaservice",
      "name": "PujaKaro Puja Booking Services",
      "serviceType": "Religious Services",
      "provider": {
        "@type": "Organization",
        "@id": "https://pujakaro.com/#organization",
        "name": "PujaKaro",
        "url": "https://pujakaro.com"
      },
      "description": "Book authentic puja services performed by experienced pandits for various occasions and needs.",
      "areaServed": [
        {
          "@type": "City",
          "name": "Mumbai",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          }
        },
        {
          "@type": "City",
          "name": "Delhi",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          }
        },
        {
          "@type": "City",
          "name": "Bangalore",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          }
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Puja Services Catalog",
        "itemListElement": pujaServices.slice(0, 3).map((puja, index) => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": puja.name,
            "url": `https://pujakaro.com/puja-booking/${puja.id}`,
            "description": puja.description.substring(0, 150)
          },
          "price": puja.price,
          "priceCurrency": "INR"
        }))
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": "500",
        "highPrice": "5000",
        "offerCount": pujaServices.length.toString()
      }
    };

    // FAQ schema
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    // BreadcrumbList schema
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
        }
      ]
    };

    return [serviceSchema, faqSchema, breadcrumbSchema];
  };
  
  useEffect(() => {
    // Fetch pujas from data
    setPujas(pujaServices);
    setFilteredPujas(pujaServices);
  }, []);
  
  // Filter pujas based on selected criteria
  useEffect(() => {
    let result = pujas;
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(puja => 
        puja.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        puja.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(puja => puja.category === selectedCategory);
    }
    
    // Filter by occasion
    if (selectedOccasion !== 'all') {
      result = result.filter(puja => puja.occasion === selectedOccasion);
    }
    
    // Filter by duration
    if (selectedDuration !== 'all') {
      result = result.filter(puja => puja.duration === selectedDuration);
    }
    
    // Filter by price range
    result = result.filter(puja => 
      puja.price >= priceRange.min && puja.price <= priceRange.max
    );
    
    setFilteredPujas(result);
  }, [selectedCategory, selectedOccasion, selectedDuration, priceRange, searchQuery, pujas]);
  
  // Extract unique categories, occasions, and durations for filters
  const categories = ['all', ...new Set(pujas.map(puja => puja.category))];
  const occasions = ['all', ...new Set(pujas.map(puja => puja.occasion))];
  const durations = ['all', ...new Set(pujas.map(puja => puja.duration))];
  
  // Handler for price range change
  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Toggle filters on mobile
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const handleBookPuja = (puja) => {
    // Navigate directly to the puja details page
    navigate(`/puja-booking/${puja.id}`);
  };

  const handleSelectPandit = (pandit) => {
    setSelectedPandit(pandit);
  };

  const handleConfirmBooking = () => {
    if (!selectedPandit) {
      toast.error('Please select a pandit to continue');
      return;
    }

    // In a real app, you would handle the booking process here
    toast.success(`Booking confirmed for ${selectedPuja.name} on ${selectedDate} with ${selectedPandit.name}. Our team will contact you shortly for confirmation.`);
    setShowPanditModal(false);
    setSelectedPuja(null);
    setSelectedPandit(null);
  };
  
  const handleFaqToggle = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };
  
  // Sample pandit data
  const pandits = [
    {
      id: 1,
      name: "Pandit Ramesh Sharma",
      image: "/images/ganesh.jpg",
      experience: "15+ years",
      specialization: "Satyanarayan Puja, Griha Pravesh",
      rating: 4.9,
      reviews: 132,
      languages: ["Hindi", "Sanskrit", "English"],
      availability: true
    },
    {
      id: 2,
      name: "Pandit Suresh Joshi",
      image: "/images/featuredPuja.jpg",
      experience: "20+ years",
      specialization: "Navgraha Puja, Rudrabhishek",
      rating: 4.8,
      reviews: 98,
      languages: ["Hindi", "Sanskrit", "Gujarati"],
      availability: true
    },
    {
      id: 3,
      name: "Pandit Vijay Trivedi",
      image: "/images/ganesh.jpg",
      experience: "12+ years",
      specialization: "Ganesh Puja, Lakshmi Puja",
      rating: 4.7,
      reviews: 85,
      languages: ["Hindi", "Sanskrit", "English", "Marathi"],
      availability: true
    },
    {
      id: 4,
      name: "Pandit Karan Shastri",
      image: "/images/featuredPuja.jpg",
      experience: "18+ years",
      specialization: "Kaal Sarp Dosh Nivaran, Maha Mrityunjaya Japa",
      rating: 4.9,
      reviews: 115,
      languages: ["Hindi", "Sanskrit", "Bengali"],
      availability: false
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <SEO
        title="Book Authentic Puja Services Online - PujaKaro"
        description="Book authentic puja services performed by experienced pandits. Choose from a wide range of pujas for various occasions, including Satyanarayan Puja, Griha Pravesh, and more."
        canonicalUrl="https://pujakaro.com/puja-booking"
        imageUrl="https://pujakaro.com/images/puja-booking-banner.jpg"
        type="service"
        schema={createStructuredData()}
        keywords={[
          "puja booking online", 
          "hindu puja services", 
          "book pandit online", 
          "satyanarayan puja", 
          "griha pravesh puja", 
          "ganesh puja", 
          "lakshmi puja", 
          "navgraha shanti puja", 
          "rudrabhishek", 
          "religious ceremonies"
        ]}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Book a Puja</h1>
        
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm text-gray-500" aria-current="page">Puja Services</span>
              </div>
            </li>
          </ol>
        </nav>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for pujas..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <button
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FontAwesomeIcon icon={faFilter} />
                Filters
                <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} />
              </button>

              <div className="hidden md:flex md:items-center md:gap-4">
                <div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category, index) => (
                      <option key={`category-${index}`} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={selectedOccasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                  >
                    {occasions.map(occasion => (
                      <option key={occasion} value={occasion}>
                        {occasion === 'all' ? 'All Occasions' : occasion}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration}>
                        {duration === 'all' ? 'All Durations' : duration}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="mt-4 md:hidden space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category, index) => (
                      <option key={`category-${index}`} value={category}>
                        {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={selectedOccasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                  >
                    {occasions.map(occasion => (
                      <option key={occasion} value={occasion}>
                        {occasion === 'all' ? 'All Occasions' : occasion}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                  >
                    {durations.map(duration => (
                      <option key={duration} value={duration}>
                        {duration === 'all' ? 'All Durations' : duration}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={priceRange.min.toString() + '-' + priceRange.max.toString()}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split('-').map(Number);
                      setPriceRange({ min, max });
                    }}
                  >
                    <option value="0-10000">Any Price</option>
                    <option value="0-2000">Under ₹2,000</option>
                    <option value="2000-3000">₹2,000 - ₹3,000</option>
                    <option value="3000-5000">₹3,000 - ₹5,000</option>
                    <option value="5000-10000">₹5,000+</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Puja Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPujas.map((puja) => (
            <div 
              key={puja.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/puja-booking/${puja.id}`)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={puja.image}
                  alt={puja.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{puja.name}</h3>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                    <span className="text-gray-700">{puja.rating}</span>
                    <span className="text-gray-500 text-xs ml-1">({puja.reviews})</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  <span>{puja.duration}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{puja.description.length > 120 ? `${puja.description.substring(0, 120)}...` : puja.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-blue-600 font-bold">₹{puja.price.toLocaleString()}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation to detail page
                      handleBookPuja(puja);
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* FAQs Section */}
        <div className="bg-white rounded-lg shadow-sm mt-12 mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full flex justify-between items-center p-4 bg-gray-50 text-left"
                    onClick={() => handleFaqToggle(index)}
                  >
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faQuestionCircle} className="text-blue-600 mr-3" />
                      <span className="font-medium text-gray-900">{faq.question}</span>
                    </div>
                    <FontAwesomeIcon 
                      icon={expandedFaq === index ? faChevronUp : faChevronDown} 
                      className="text-gray-500"
                    />
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="p-4 bg-white">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md mt-12">
          <div className="p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Puja Package?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              We can arrange customized puja services for special occasions, corporate events, or specific requirements. 
              Our expert pandits can guide you through the process and help create a meaningful spiritual experience.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500">
              Contact Us for Custom Packages
            </button>
          </div>
        </div>

        {/* Pandit Selection Modal */}
        {showPanditModal && selectedPuja && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Select a Pandit for {selectedPuja.name}</h2>
                  <button 
                    onClick={() => {
                      setShowPanditModal(false);
                      setSelectedPuja(null);
                      setSelectedPandit(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:mr-4 mb-4 md:mb-0">
                        <img 
                          src={selectedPuja.image} 
                          alt={selectedPuja.name}
                          className="w-full md:w-16 h-32 md:h-16 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{selectedPuja.name}</h3>
                        <div className="flex flex-wrap text-sm text-gray-600 mt-1">
                          <div className="flex items-center mr-4">
                            <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                            <span>{selectedDate}</span>
                          </div>
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faClock} className="mr-1" />
                            <span>{selectedPuja.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0 md:ml-auto">
                        <span className="font-bold text-lg">₹{selectedPuja.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">Available Pandits</h3>
                  <div className="space-y-4">
                    {pandits.map(pandit => (
                      <div 
                        key={pandit.id} 
                        className={`border rounded-lg p-4 ${selectedPandit?.id === pandit.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'} ${!pandit.availability ? 'opacity-50' : ''}`}
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:mr-4 mb-4 md:mb-0 flex justify-center">
                            <img 
                              src={pandit.image} 
                              alt={pandit.name}
                              className="w-20 h-20 object-cover rounded-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                              <h4 className="text-lg font-semibold mb-2 md:mb-0">{pandit.name}</h4>
                              <div className="flex items-center mb-2 md:mb-0">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                                <span>{pandit.rating}</span>
                                <span className="text-gray-500 text-sm ml-1">({pandit.reviews})</span>
                              </div>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              <div className="flex items-center mb-1">
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-600" />
                                <span>Experience: {pandit.experience}</span>
                              </div>
                              <div className="flex items-center mb-1">
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-blue-600" />
                                <span>Specialization: {pandit.specialization}</span>
                              </div>
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faLanguage} className="mr-2 text-blue-600" />
                                <span>Languages: {pandit.languages.join(", ")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {pandit.availability ? (
                          <button
                            onClick={() => handleSelectPandit(pandit)}
                            className={`mt-3 w-full py-2 rounded-md ${selectedPandit?.id === pandit.id ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600'}`}
                          >
                            {selectedPandit?.id === pandit.id ? 'Selected' : 'Select Pandit'}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="mt-3 w-full py-2 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
                          >
                            Not Available
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowPanditModal(false);
                      setSelectedPuja(null);
                      setSelectedPandit(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={!selectedPandit}
                    className={`px-4 py-2 rounded-md ${selectedPandit ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PujaBooking;