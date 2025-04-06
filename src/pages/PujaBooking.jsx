import { useState } from 'react';
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

const PujaBooking = () => {
  const [pujas, setPujas] = useState([
    {
      id: 1,
      name: 'Satyanarayan Puja',
      image: '/images/featuredPuja.jpg',
      duration: '3 hours',
      price: 2100,
      rating: 4.8,
      reviews: 126,
      occasions: ['house-warming', 'new-venture'],
      description: 'Dedicated to Lord Vishnu, Satyanarayan Puja is performed to seek blessings for prosperity, well-being, and success in new ventures. This auspicious ceremony is conducted by our experienced pandits following all Vedic rituals.'
    },
    {
      id: 2,
      name: 'Ganesh Puja',
      image: '/images/ganesh.jpg',
      duration: '2 hours',
      price: 1800,
      rating: 4.7,
      reviews: 98,
      occasions: ['new-venture', 'festival'],
      description: 'Invoke the blessings of Lord Ganesha, the remover of obstacles, with this traditional puja. Perfect for beginning new ventures, celebrating Ganesh Chaturthi, or seeking divine intervention for success in your endeavors.'
    },
    {
      id: 3,
      name: 'Lakshmi Puja',
      image: '/images/featuredPuja.jpg',
      duration: '2 hours',
      price: 2500,
      rating: 4.9,
      reviews: 155,
      occasions: ['diwali', 'financial-success'],
      description: 'Attract wealth, prosperity and abundance with this sacred puja dedicated to Goddess Lakshmi. Especially auspicious during Diwali, but beneficial throughout the year for financial growth and stability.'
    },
    {
      id: 4,
      name: 'Griha Pravesh Puja',
      image: '/images/ganesh.jpg',
      duration: '3.5 hours',
      price: 3500,
      rating: 4.8,
      reviews: 87,
      occasions: ['house-warming'],
      description: 'Begin your journey in your new home with this sacred housewarming ceremony. This comprehensive puja purifies the new space, invites positive energies, and seeks blessings from household deities for peace and harmony.'
    },
    {
      id: 5,
      name: 'Navgraha Shanti Puja',
      image: '/images/featuredPuja.jpg',
      duration: '2.5 hours',
      price: 2800,
      rating: 4.6,
      reviews: 72,
      occasions: ['astrological-remedy', 'peace'],
      description: 'Balance the influences of the nine celestial planets in your life with this powerful ritual. Recommended for those facing astrological challenges or seeking to enhance positive planetary influences.'
    },
    {
      id: 6,
      name: 'Rudrabhishek',
      image: '/images/ganesh.jpg',
      duration: '2.5 hours',
      price: 2300,
      rating: 4.7,
      reviews: 105,
      occasions: ['shiva-worship', 'peace'],
      description: 'Honor Lord Shiva with this divine abhishekam ritual. Performed with milk, honey, yogurt, and other sacred offerings, Rudrabhishek brings spiritual growth, removes negativity, and bestows peace and prosperity.'
    },
    {
      id: 7,
      name: 'Kanya Puja',
      image: '/images/featuredPuja.jpg',
      duration: '2 hours',
      price: 1900,
      rating: 4.5,
      reviews: 63,
      occasions: ['navratri', 'festival'],
      description: 'A significant ritual during Navratri where young girls are worshipped as manifestations of the goddess. This puja honors the divine feminine energy and is believed to bring blessings from Goddess Durga.'
    },
    {
      id: 8,
      name: 'Sundarkand Path',
      image: '/images/ganesh.jpg',
      duration: '3 hours',
      price: 1700,
      rating: 4.8,
      reviews: 92,
      occasions: ['peace', 'obstacle-removal'],
      description: 'A sacred recitation of Sundarkand from the Ramcharitmanas, describing Hanuman\'s journey to Lanka. This powerful path removes obstacles, fulfills wishes, and brings peace and prosperity to the household.'
    },
    {
      id: 9,
      name: 'Vastu Shanti Puja',
      image: '/images/featuredPuja.jpg',
      duration: '2.5 hours',
      price: 2600,
      rating: 4.6,
      reviews: 78,
      occasions: ['house-warming', 'peace'],
      description: 'Harmonize the energies of your home or office according to Vastu Shastra principles. This puja corrects Vastu defects, removes negative energies, and enhances positive vibrations in your living or working space.'
    },
    {
      id: 10,
      name: 'Maha Mrityunjaya Japa',
      image: '/images/ganesh.jpg',
      duration: '2 hours',
      price: 2200,
      rating: 4.9,
      reviews: 111,
      occasions: ['health', 'protection'],
      description: 'A powerful ritual centered around the Maha Mrityunjaya mantra, dedicated to Lord Shiva. This puja promotes healing, longevity, removes fear of death, and protects from accidents and illnesses.'
    },
    {
      id: 11,
      name: 'Durga Puja',
      image: '/images/featuredPuja.jpg',
      duration: '3 hours',
      price: 3000,
      rating: 4.9,
      reviews: 143,
      occasions: ['navratri', 'festival'],
      description: 'Invoke the divine power of Goddess Durga to defeat negative forces in your life. This ceremonial worship includes mantras, offerings, and rituals that channel the protective and nurturing energy of the goddess.'
    },
    {
      id: 12,
      name: 'Kaal Sarp Dosh Nivaran',
      image: '/images/ganesh.jpg',
      duration: '3 hours',
      price: 3200,
      rating: 4.7,
      reviews: 89,
      occasions: ['astrological-remedy', 'obstacle-removal'],
      description: 'A specialized puja to mitigate the effects of Kaal Sarp Yoga in the horoscope. This comprehensive ritual helps overcome obstacles, delays, and challenges caused by this astrological alignment.'
    }
  ]);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    priceRange: 'all',
    duration: 'all',
    occasion: 'all',
    sortBy: 'popularity'
  });
  
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showPanditModal, setShowPanditModal] = useState(false);
  const [selectedPuja, setSelectedPuja] = useState(null);
  const [selectedPandit, setSelectedPandit] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };
  
  const filterPujas = () => {
    let filtered = [...pujas];
    
    if (filters.searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(p => 
        max ? p.price >= min && p.price <= max : p.price >= min
      );
    }

    if (filters.duration !== 'all') {
      filtered = filtered.filter(p => {
        const hours = parseFloat(p.duration);
        return filters.duration === 'short' ? hours <= 2 :
               filters.duration === 'medium' ? hours > 2 && hours <= 3 :
               hours > 3;
      });
    }

    if (filters.occasion !== 'all') {
      filtered = filtered.filter(p => 
        p.occasions.includes(filters.occasion)
      );
    }

    switch (filters.sortBy) {
      case 'price-low-high': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high-low': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      default: filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
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
  
  const filteredPujas = filterPujas();
  
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
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Book a Puja</h1>
        
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
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
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
                    value={filters.occasion}
                    onChange={(e) => handleFilterChange('occasion', e.target.value)}
                  >
                    <option value="all">All Occasions</option>
                    <option value="house-warming">House Warming</option>
                    <option value="new-venture">New Venture</option>
                    <option value="festival">Festival</option>
                    <option value="diwali">Diwali</option>
                    <option value="navratri">Navratri</option>
                    <option value="peace">Peace & Harmony</option>
                    <option value="financial-success">Financial Success</option>
                    <option value="health">Health & Wellbeing</option>
                    <option value="astrological-remedy">Astrological Remedy</option>
                  </select>
                </div>

                <div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="popularity">Sort by: Popularity</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="mt-4 md:hidden space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={filters.occasion}
                    onChange={(e) => handleFilterChange('occasion', e.target.value)}
                  >
                    <option value="all">All Occasions</option>
                    <option value="house-warming">House Warming</option>
                    <option value="new-venture">New Venture</option>
                    <option value="festival">Festival</option>
                    <option value="diwali">Diwali</option>
                    <option value="navratri">Navratri</option>
                    <option value="peace">Peace & Harmony</option>
                    <option value="financial-success">Financial Success</option>
                    <option value="health">Health & Wellbeing</option>
                    <option value="astrological-remedy">Astrological Remedy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={filters.duration}
                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                  >
                    <option value="all">Any Duration</option>
                    <option value="short">Short (Up to 2 hours)</option>
                    <option value="medium">Medium (2-3 hours)</option>
                    <option value="long">Long (3+ hours)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  >
                    <option value="all">Any Price</option>
                    <option value="0-2000">Under ₹2,000</option>
                    <option value="2000-3000">₹2,000 - ₹3,000</option>
                    <option value="3000">₹3,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Puja Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterPujas().map((puja) => (
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