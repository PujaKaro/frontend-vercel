import { useState, useEffect } from 'react';
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
  faLanguage,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useNavigationTracker from '../hooks/useNavigationTracker';
import { getAllPujas, getAllPandits } from '../utils/dataUtils';
import MigrateDataButton from '../components/MigrateDataButton';

const PujaBooking = () => {
  // Use the navigation tracker hook to enable page navigation notifications
  useNavigationTracker();
  
  const [pujas, setPujas] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch pujas and pandits from Firestore
        const [pujasData, panditsData] = await Promise.all([
          getAllPujas(),
          getAllPandits()
        ]);
        
        setPujas(pujasData);
        setPandits(panditsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
        p.occasions && p.occasions.includes(filters.occasion)
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
    // Navigate to the booking form with the selected date and time
    navigate(`/puja-booking/${puja.id}`, {
      state: {
        puja,
        selectedDate,
        selectedTime: '09:00' // Default time, can be made configurable
      }
    });
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
  
  const handleDataMigrationSuccess = async () => {
    // Refresh data after successful migration
    try {
      const [pujasData, panditsData] = await Promise.all([
        getAllPujas(),
        getAllPandits()
      ]);
      
      setPujas(pujasData);
      setPandits(panditsData);
    } catch (error) {
      console.error('Error fetching data after migration:', error);
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
        
        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <FontAwesomeIcon icon={faSpinner} className="text-blue-500 text-4xl animate-spin mb-4" />
            <p className="text-gray-600">Loading puja services...</p>
          </div>
        ) : filteredPujas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No puja services found</h3>
            <p className="text-gray-600 mb-6">
              {pujas.length === 0 
                ? "It looks like our puja database is empty. Please initialize the data to get started."
                : "No pujas match your current filters. Try adjusting your search criteria."}
            </p>
            
            {pujas.length === 0 && (
              <div className="flex justify-center">
                <MigrateDataButton
                  onSuccess={handleDataMigrationSuccess}
                  buttonText="Initialize Puja Database"
                  className="px-6 py-3 text-lg"
                />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Pujas List */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPujas.map((puja, index) => (
                <div 
                  key={`puja-${puja.id}-${index}`} 
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
                    
                    {expandedPujaId === puja.id ? (
                      <>
                        <p className="text-gray-700 whitespace-pre-line mb-2">{puja.longDescription}</p>
                        <button
                          className="text-blue-600 text-sm underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedPujaId(null);
                          }}
                        >
                          Read Less
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 whitespace-pre-line mb-2">
                          {puja.longDescription.length > 180
                            ? `${puja.longDescription.substring(0, 180)}...`
                            : puja.longDescription}
                        </p>
                        {puja.longDescription.length > 180 && (
                          <button
                            className="text-blue-600 text-sm underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedPujaId(puja.id);
                            }}
                          >
                            Read More
                          </button>
                        )}
                      </>
                    )}
                    
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
          </>
        )}
        
        {/* FAQs Section */}
        <div className="bg-white rounded-lg shadow-sm mt-12 mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={`faq-${index}-${faq.question.substring(0, 10)}`} className="border border-gray-200 rounded-lg overflow-hidden">
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
                        key={`pandit-${pandit.id}`} 
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