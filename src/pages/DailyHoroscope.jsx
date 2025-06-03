import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, Link } from 'react-router-dom';
import { 
  faStar, 
  faCalendarAlt, 
  faClock,
  faShare,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import { planets, getTodayHoroscope } from '../data/horoscopeData';
import useNavigationTracker from '../hooks/useNavigationTracker';

const DailyHoroscope = () => {
  // Use the navigation tracker hook
  useNavigationTracker();
  const navigate = useNavigate();
  
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHoroscope = () => {
      try {
        // Check if there's a stored horoscope in localStorage first
        const storedHoroscope = localStorage.getItem('currentHoroscope');
        if (storedHoroscope) {
          setHoroscope(JSON.parse(storedHoroscope));
        } else {
          // Otherwise use the sample data
          setHoroscope(getTodayHoroscope());
        }
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        // Fallback to sample data
        setHoroscope(getTodayHoroscope());
      } finally {
        setLoading(false);
      }
    };
    
    fetchHoroscope();
  }, []);
  
  // Format date as "Month Day, Year"
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Function to get horoscope text for a planet
  const getPlanetHoroscope = (planetId) => {
    if (!horoscope) return 'Coming soon!';
    
    const entry = horoscope.entries.find(entry => entry.planetId === planetId);
    return entry ? entry.text : 'Coming soon!';
  };
  
  // Function to handle sharing a horoscope
  const handleShare = (planetName) => {
    if (navigator.share) {
      navigator.share({
        title: `${planetName} Horoscope for ${horoscope?.date ? formatDate(horoscope.date) : 'Today'}`,
        text: `Check out today's ${planetName} horoscope on Pujakaro.in!`,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      alert('Sharing is not available in your browser.');
    }
  };
  
  // Handle consultation booking
  const handleBookConsultation = () => {
    // Navigate to the booking form with a specific service ID for astrological consultation
    // Using ID 10 for astrological consultation, modify as needed based on your actual data
    navigate('/booking-form/10', { 
      state: { 
        serviceName: 'Astrological Consultation',
        serviceType: 'consultation',
        fromPage: 'horoscope'
      } 
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="spinner-border text-orange-600" role="status">
          <span className="sr-only">Loading...</span>
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Daily Horoscope | Pujakaro.in</title>
        <meta 
          name="description" 
          content="Today's horoscope for Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, and Ketu - Get your daily planetary insights at Pujakaro.in" 
        />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Today's Horoscope – {horoscope?.date ? formatDate(horoscope.date) : 'Today'}
          </h1>
          <p className="text-gray-600 mb-4">
            Discover how the nine planets influence your day with our daily planetary insights
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
            <div className="flex items-center text-sm text-gray-500 mb-2 sm:mb-0 sm:mr-6">
              <FontAwesomeIcon icon={faClock} className="mr-1" />
              <span>Last updated: {horoscope?.lastUpdated ? new Date(horoscope.lastUpdated).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              }) : 'N/A'}</span>
            </div>
            
            <Link 
              to="/birth-chart"
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-1" />
              <span>Get Your Personalized Birth Chart</span>
              <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">New!</span>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planets.map((planet) => (
            <div 
              key={planet.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="border-b border-gray-100">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-orange-50 text-orange-700 rounded-full w-10 h-10 flex items-center justify-center text-xl mr-3">
                      <span>{planet.glyph}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{planet.name}</h3>
                  </div>
                  <button 
                    onClick={() => handleShare(planet.name)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={`Share ${planet.name} horoscope`}
                  >
                    <FontAwesomeIcon icon={faShare} />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-3">{planet.description}</p>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-gray-800">
                    {getPlanetHoroscope(planet.id)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md mt-12">
          <div className="p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Get Personalized Astrological Guidance</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Want deeper insights into how these planetary positions affect your specific birth chart? 
              Book a personal consultation with our expert astrologers for detailed guidance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={handleBookConsultation}
                className="bg-white text-orange-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
              >
                Book Consultation
              </button>
              <Link 
                to="/birth-chart"
                className="bg-orange-700 text-white px-8 py-3 rounded-md font-medium hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
              >
                Generate Birth Chart
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Understanding the Nine Planets in Vedic Astrology</h2>
          <p className="text-gray-600 mb-4">
            In Vedic astrology, the nine planets (Navagraha) play a crucial role in determining our life's journey. 
            Each planet governs different aspects of our personality and life circumstances.
          </p>
          
          <div className="space-y-4 mt-6">
            <div>
              <h3 className="font-medium text-gray-900">The Luminaries: Sun (Surya) and Moon (Chandra)</h3>
              <p className="text-gray-600 text-sm">
                The Sun represents our soul, ego, and self-expression, while the Moon governs our emotions, 
                mind, and inner feelings. Together, they form the core of our being.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">The Personal Planets: Mars (Mangal), Mercury (Budha), Jupiter (Guru), Venus (Shukra), Saturn (Shani)</h3>
              <p className="text-gray-600 text-sm">
                These planets influence our personal traits, relationships, and day-to-day experiences. 
                Mars governs energy and courage, Mercury rules communication and intellect, 
                Jupiter brings wisdom and growth, Venus represents love and harmony, 
                while Saturn teaches discipline and patience.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">The Shadow Planets: Rahu and Ketu</h3>
              <p className="text-gray-600 text-sm">
                These nodes of the Moon represent our karmic patterns. Rahu points to our worldly desires and ambitions, 
                while Ketu indicates spiritual growth and detachment from material concerns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyHoroscope; 