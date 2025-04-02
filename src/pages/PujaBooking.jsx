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
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };
  
  const filterPujas = () => {
    let filteredPujas = [...pujas];
    
    // Filter by search term
    if (filters.searchTerm) {
      filteredPujas = filteredPujas.filter(puja => 
        puja.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        puja.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    // Filter by price range
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under-1500':
          filteredPujas = filteredPujas.filter(puja => puja.price < 1500);
          break;
        case '1500-2500':
          filteredPujas = filteredPujas.filter(puja => puja.price >= 1500 && puja.price <= 2500);
          break;
        case 'above-2500':
          filteredPujas = filteredPujas.filter(puja => puja.price > 2500);
          break;
        default:
          break;
      }
    }
    
    // Filter by duration
    if (filters.duration !== 'all') {
      switch (filters.duration) {
        case 'short':
          filteredPujas = filteredPujas.filter(puja => 
            parseFloat(puja.duration.split(' ')[0]) <= 1.5
          );
          break;
        case 'medium':
          filteredPujas = filteredPujas.filter(puja => {
            const hours = parseFloat(puja.duration.split(' ')[0]);
            return hours > 1.5 && hours <= 2.5;
          });
          break;
        case 'long':
          filteredPujas = filteredPujas.filter(puja => 
            parseFloat(puja.duration.split(' ')[0]) > 2.5
          );
          break;
        default:
          break;
      }
    }
    
    // Filter by occasion
    if (filters.occasion !== 'all') {
      // In a real application, we would filter by occasion
      // Since our mock data doesn't have an occasion field, this is just a placeholder
    }
    
    // Sort pujas
    switch (filters.sortBy) {
      case 'price-low-high':
        filteredPujas.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filteredPujas.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredPujas.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        filteredPujas.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    
    return filteredPujas;
  };
  
  const handleBookPuja = (puja) => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    if (!selectedDate) {
      alert('Please select a date for your puja booking');
      return;
    }
    
    // Set the selected puja and show pandit selection modal
    setSelectedPuja(puja);
    setShowPanditModal(true);
  };

  const handleSelectPandit = (pandit) => {
    setSelectedPandit(pandit);
  };

  const handleConfirmBooking = () => {
    if (!selectedPandit) {
      alert('Please select a pandit to continue');
      return;
    }

    // In a real app, you would handle the booking process here
    alert(`Booking confirmed for ${selectedPuja.name} on ${selectedDate} with ${selectedPandit.name}. Our team will contact you shortly for confirmation.`);
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
    <div className="min-h-screen bg-gray-100 pt-2 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Book a Puja</h1>
        
        {/* Search and Date picker */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#317bea] focus:border-[#317bea]"
                  placeholder="Search for pujas..."
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#317bea] focus:border-[#317bea]"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#317bea] focus:border-[#317bea] appearance-none bg-white"
                >
                  <option value="">Select your location</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="chennai">Chennai</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="pune">Pune</option>
                  <option value="ahmedabad">Ahmedabad</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row mb-8">
          <div className="w-64 space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-4">Filters</h3>
              
              {/* Search and Sort */}
              <div className="mb-6">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search pujas..."
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                  />
                  <button className="absolute right-0 top-0 mt-2 mr-3 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
                <select className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]">
                  <option value="">Sort By</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Occasion Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Occasion</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Wedding</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>House Warming</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Birthday</span>
                  </label>
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Duration</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>1-2 hours</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>2-3 hours</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>3+ hours</span>
                  </label>
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Under ₹1000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>₹1000 - ₹2000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>₹2000 - ₹3000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>Over ₹3000</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            {filteredPujas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPujas.map(puja => (
                  <div key={puja.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="relative">
                      <img 
                        src={puja.image} 
                        alt={puja.name} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 right-0 bg-[#317bea] text-white px-3 py-1 text-sm font-medium">
                        ₹{puja.price.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{puja.name}</h3>
                        <div className="flex items-center text-sm">
                          <FontAwesomeIcon icon={faClock} className="text-gray-500 mr-1" />
                          <span className="text-gray-700">{puja.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center text-yellow-400">
                          <FontAwesomeIcon icon={faStar} />
                          <span className="ml-1 text-gray-700">{puja.rating}</span>
                        </div>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-gray-700">{puja.reviews} reviews</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 flex-1">{puja.description}</p>
                      
                      <button
                        onClick={() => handleBookPuja(puja)}
                        className="w-full bg-[#317bea] text-white py-2 rounded-md hover:bg-[#317bea]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#317bea]"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8 text-center">
                <p className="text-xl font-medium text-gray-500 mb-3">No pujas found</p>
                <p className="text-gray-500">
                  Try adjusting your filters or search term to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* FAQs Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-12 mb-8">
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
                      <FontAwesomeIcon icon={faQuestionCircle} className="text-[#317bea] mr-3" />
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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md overflow-hidden mt-12">
          <div className="p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Puja Package?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              We can arrange customized puja services for special occasions, corporate events, or specific requirements. 
              Our expert pandits can guide you through the process and help create a meaningful spiritual experience.
            </p>
            <button className="bg-white text-[#317bea] px-8 py-3 rounded-md font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-500">
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
                    <div className="flex items-center">
                      <div className="mr-4">
                        <img 
                          src={selectedPuja.image} 
                          alt={selectedPuja.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{selectedPuja.name}</h3>
                        <div className="flex text-sm text-gray-600 mt-1">
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
                      <div className="ml-auto">
                        <span className="font-bold text-lg">₹{selectedPuja.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">Available Pandits</h3>
                  <div className="space-y-4">
                    {pandits.map(pandit => (
                      <div 
                        key={pandit.id} 
                        className={`border rounded-lg p-4 ${selectedPandit?.id === pandit.id ? 'border-[#317bea] bg-blue-50' : 'border-gray-200'} ${!pandit.availability ? 'opacity-50' : ''}`}
                      >
                        <div className="flex">
                          <div className="mr-4">
                            <img 
                              src={pandit.image} 
                              alt={pandit.name}
                              className="w-20 h-20 object-cover rounded-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-lg font-semibold">{pandit.name}</h4>
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                                <span>{pandit.rating}</span>
                                <span className="text-gray-500 text-sm ml-1">({pandit.reviews})</span>
                              </div>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              <div className="flex items-center mb-1">
                                <FontAwesomeIcon icon={faUser} className="mr-2 text-[#317bea]" />
                                <span>Experience: {pandit.experience}</span>
                              </div>
                              <div className="flex items-center mb-1">
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-[#317bea]" />
                                <span>Specialization: {pandit.specialization}</span>
                              </div>
                              <div className="flex items-center">
                                <FontAwesomeIcon icon={faLanguage} className="mr-2 text-[#317bea]" />
                                <span>Languages: {pandit.languages.join(", ")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {pandit.availability ? (
                          <button
                            onClick={() => handleSelectPandit(pandit)}
                            className={`mt-3 w-full py-2 rounded-md ${selectedPandit?.id === pandit.id ? 'bg-[#317bea] text-white' : 'border border-[#317bea] text-[#317bea]'}`}
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
                    className={`px-4 py-2 rounded-md ${selectedPandit ? 'bg-[#317bea] text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
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