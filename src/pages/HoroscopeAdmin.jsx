import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSave,
  faCalendarAlt,
  faClock,
  faExclamationTriangle,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { planets, saveHoroscope, getTodayHoroscope } from '../data/horoscopeData';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useNavigationTracker from '../hooks/useNavigationTracker';

const HoroscopeAdmin = () => {
  // Use the navigation tracker hook
  useNavigationTracker();
  
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromAdmin = location.state?.fromAdmin;
  
  const [horoscope, setHoroscope] = useState({
    date: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString(),
    entries: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Get tomorrow's date for the scheduler
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];
  
  useEffect(() => {
    // Only check auth when loading is complete to prevent premature redirects
    const fetchHoroscope = () => {
      try {
        // Check if there's a stored horoscope in localStorage first
        const storedHoroscope = localStorage.getItem('currentHoroscope');
        if (storedHoroscope) {
          const parsedHoroscope = JSON.parse(storedHoroscope);
          setHoroscope(parsedHoroscope);
        } else {
          // Otherwise initialize with sample data
          const initialData = getTodayHoroscope();
          setHoroscope(initialData);
        }
      } catch (error) {
        console.error('Error fetching horoscope:', error);
        // Initialize with empty data
        setHoroscope({
          date: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString(),
          entries: planets.map(planet => ({
            planetId: planet.id,
            text: ''
          }))
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // If coming from admin dashboard, skip auth check
    if (fromAdmin) {
      fetchHoroscope();
      return;
    }
    
    // Check authentication status
    if (!isAuthenticated && !currentUser) {
      // Only redirect if we're sure the user is not authenticated
      navigate('/signin', { state: { from: '/admin/horoscope' } });
      return;
    } else if (currentUser && currentUser.role !== 'admin') {
      // If user is authenticated but not admin
      toast.error('You do not have permission to access this page');
      navigate('/');
      return;
    } else {
      // User is authenticated and has admin role
      fetchHoroscope();
    }
  }, [isAuthenticated, currentUser, navigate, fromAdmin]);
  
  // Initialize entries if empty
  useEffect(() => {
    if (!isLoading && (!horoscope.entries || horoscope.entries.length === 0)) {
      setHoroscope(prev => ({
        ...prev,
        entries: planets.map(planet => ({
          planetId: planet.id,
          text: ''
        }))
      }));
    }
  }, [isLoading, horoscope.entries]);
  
  // Format date as "Month Day, Year"
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Handle text change for a planet
  const handleTextChange = (planetId, text) => {
    setHoroscope(prev => ({
      ...prev,
      entries: prev.entries.map(entry => 
        entry.planetId === planetId ? { ...entry, text } : entry
      )
    }));
    
    // Remove from empty fields if it now has content
    if (text.trim()) {
      setEmptyFields(prev => prev.filter(id => id !== planetId));
    }
  };
  
  // Validate all fields before saving
  const validateFields = () => {
    const empty = horoscope.entries
      .filter(entry => !entry.text.trim())
      .map(entry => entry.planetId);
    
    setEmptyFields(empty);
    return empty.length === 0;
  };
  
  // Handle save
  const handleSave = async (isScheduled = false) => {
    if (!validateFields()) {
      toast.error('Please fill in all horoscope entries before saving');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare the data to save
      const dataToSave = {
        ...horoscope,
        date: isScheduled ? scheduledDate : new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString()
      };
      
      // Save the data
      const success = saveHoroscope(dataToSave);
      
      if (success) {
        setHoroscope(dataToSave);
        toast.success(isScheduled 
          ? `Horoscope scheduled for ${formatDate(scheduledDate)}` 
          : 'Horoscope updated successfully');
      } else {
        toast.error('Failed to save horoscope');
      }
    } catch (error) {
      console.error('Error saving horoscope:', error);
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Get text for a specific planet
  const getPlanetText = (planetId) => {
    if (!horoscope.entries) return '';
    
    const entry = horoscope.entries.find(entry => entry.planetId === planetId);
    return entry ? entry.text : '';
  };
  
  if (isLoading) {
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
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Horoscope Admin Dashboard</h1>
              
              <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                  <span>Today: {formatDate(new Date().toISOString().split('T')[0])}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  <span>Last updated: {horoscope.lastUpdated ? new Date(horoscope.lastUpdated).toLocaleString() : 'Never'}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Today's Horoscope Entries</h2>
              <p className="text-gray-600 mb-4">
                Enter the horoscope text for each of the nine planets. Each entry can be up to 500 characters.
              </p>
              
              {emptyFields.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-md flex items-start">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mt-1 mr-2" />
                  <div>
                    <p className="font-medium">Please fill in all horoscope entries:</p>
                    <ul className="list-disc list-inside mt-1">
                      {emptyFields.map(planetId => (
                        <li key={`warning-${planetId}`}>
                          {planets.find(p => p.id === planetId)?.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {planets.map((planet) => (
                <div key={planet.id} className={`border rounded-lg p-4 ${emptyFields.includes(planet.id) ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                  <div className="flex items-center mb-3">
                    <div className="bg-orange-50 text-orange-700 rounded-full w-10 h-10 flex items-center justify-center text-xl mr-3">
                      <span>{planet.glyph}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{planet.name}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{planet.description}</p>
                  
                  <div>
                    <textarea
                      value={getPlanetText(planet.id)}
                      onChange={(e) => handleTextChange(planet.id, e.target.value)}
                      placeholder={`Enter ${planet.name}'s daily horoscope text...`}
                      className={`w-full p-3 border ${emptyFields.includes(planet.id) ? 'border-red-300' : 'border-gray-300'} rounded-md min-h-[120px] focus:ring-orange-500 focus:border-orange-500`}
                      maxLength={500}
                    />
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {emptyFields.includes(planet.id) && (
                          <span className="text-red-500">This field is required</span>
                        )}
                      </span>
                      <span>
                        {getPlanetText(planet.id).length}/500 characters
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Schedule Options</h3>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule for future date (optional)</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={tomorrowString}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                    className="w-full md:w-auto px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Scheduling...' : 'Schedule for Future'}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="w-full md:w-auto px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  {isSaving ? 'Saving...' : 'Save Today\'s Horoscope'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-orange-800 mb-3">Tips for Writing Effective Horoscopes</h2>
          
          <ul className="space-y-2 text-orange-700">
            <li className="flex items-start">
              <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-orange-500" />
              <span>Keep entries between 50-500 characters for optimal readability</span>
            </li>
            <li className="flex items-start">
              <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-orange-500" />
              <span>Focus on positive guidance rather than negative predictions</span>
            </li>
            <li className="flex items-start">
              <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-orange-500" />
              <span>Include practical advice that readers can apply to their day</span>
            </li>
            <li className="flex items-start">
              <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-orange-500" />
              <span>Use clear, simple language without excessive astrological jargon</span>
            </li>
            <li className="flex items-start">
              <FontAwesomeIcon icon={faCheck} className="mt-1 mr-2 text-orange-500" />
              <span>Consider the traditional qualities associated with each planet</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HoroscopeAdmin; 