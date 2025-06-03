import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faCalendarAlt, 
  faClock,
  faMapMarkerAlt,
  faUser,
  faVenusMars
} from '@fortawesome/free-solid-svg-icons';
import { generateBirthChart } from '../utils/astrologyUtils';
import { submitIssueReport } from '../services/issueReportService';
import useNavigationTracker from '../hooks/useNavigationTracker';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const BirthChartAstrology = () => {
  // Use the navigation tracker hook
  useNavigationTracker();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: '',
    system: 'vedic' // Default to Vedic system
  });
  
  // Birth chart result state
  const [birthChart, setBirthChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Issue reporting state
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueForm, setIssueForm] = useState({
    issueEmail: '',
    issueType: '',
    issueDescription: ''
  });
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle issue input changes
  const handleIssueInputChange = (e) => {
    const { name, value } = e.target;
    setIssueForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate form data
      if (!formData.name || !formData.birthDate || !formData.birthPlace) {
        throw new Error('Please fill all required fields');
      }
      
      console.log('Submitting birth chart data:', formData);
      
      // Generate birth chart with selected system
      const chartData = await generateBirthChart(formData, formData.system);
      console.log('Received birth chart data:', chartData);
      setBirthChart(chartData);
    } catch (err) {
      // Provide more user-friendly error messages
      let errorMessage = err.message || 'An error occurred while generating your birth chart';
      
      // Handle specific error types with friendlier messages
      if (errorMessage.includes('timezone')) {
        errorMessage = 'We had trouble identifying the timezone for your location, but we\'ve used a reasonable default. Your chart may not be perfectly accurate.';
      } else if (errorMessage.includes('coordinates')) {
        errorMessage = 'We couldn\'t find the exact coordinates for your location, but we\'ve used a similar location. Your chart may not be perfectly accurate.';
      } else if (errorMessage.includes('Unknown') || errorMessage.includes('not found')) {
        errorMessage = 'We encountered an issue with your location input. Your chart has been generated using approximate location data.';
      }
      
      console.error('Error generating birth chart:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle consultation booking
  const handleBookConsultation = () => {
    // Navigate to the booking form with a specific service ID for astrological consultation
    navigate('/booking-form/10', { 
      state: { 
        serviceName: 'Detailed Birth Chart Reading',
        serviceType: 'consultation',
        fromPage: 'birthChart',
        customerData: formData // Pass the birth data to the booking form
      } 
    });
  };
  
  // Handle issue submission
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingIssue(true);
    setIssueSubmitted(false);
    
    try {
      // Include current chart data with the issue report
      await submitIssueReport(issueForm, birthChart);
      
      // Reset the form after successful submission
      setIssueForm({
        issueEmail: '',
        issueType: '',
        issueDescription: ''
      });
      
      setIssueSubmitted(true);
      
      // Hide the form after 3 seconds
      setTimeout(() => {
        setShowIssueForm(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting issue:', err);
      alert('There was an error submitting your issue. Please try again later.');
    } finally {
      setIsSubmittingIssue(false);
    }
  };
  
  return (
    <main className="mt-2">
      <SEO
        title="Birth Chart Analysis | PujaKaro"
        description="Get your personalized birth chart analysis based on Vedic astrology. Enter your birth details to discover planetary positions and their influence on your life."
        canonicalUrl="https://pujakaro.com/birth-chart"
        keywords={[
          "birth chart", 
          "kundli", 
          "vedic astrology", 
          "janam kundali", 
          "horoscope", 
          "birth time astrology", 
          "jyotish"
        ]}
      />
      
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div className="relative max-w-8xl mx-auto px-4 h-full flex items-center">
          <img 
            src="/images/astrology-hero.jpg" 
            className="absolute inset-0 w-full h-full object-cover opacity-90" 
            alt="Astrology Background" 
          />
          <div className="max-w-2xl text-white relative z-10">
            <h1 className="text-4xl font-bold mb-4">
              Your Personalized<br />Birth Chart Analysis
            </h1>
            <p className="text-xl mb-6">
              Discover how the planets were positioned at the time of your birth
              and their influence on various aspects of your life.
            </p>
          </div>
        </div>
      </section>
      
      {/* Birth Chart Form/Results Section */}
      <section className="py-8 max-w-8xl mx-auto px-4 relative bg-[#ffeee7]">
        <div className="max-w-4xl mx-auto">
          {!birthChart ? (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Enter Your Birth Details</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faVenusMars} className="text-gray-400" />
                      </div>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="birthTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Time of Birth (if known)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="birthTime"
                        name="birthTime"
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">More accurate results with birth time</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="birthPlace" className="block text-sm font-medium text-gray-700 mb-1">
                      Place of Birth*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="birthPlace"
                        name="birthPlace"
                        value={formData.birthPlace}
                        onChange={handleInputChange}
                        required
                        className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                        placeholder="City, State, Country"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Example: Mumbai, Maharashtra, India</p>
                    <p className="mt-1 text-xs text-gray-500">If your city isn't recognized, we'll try to find a close match or use a default location in the same region.</p>
                  </div>
                  
                  <div className="md:col-span-2 mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Astrological System
                    </label>
                    <div className="flex space-x-6">
                      <div className="flex items-center">
                        <input
                          id="vedic"
                          name="system"
                          type="radio"
                          value="vedic"
                          checked={formData.system === 'vedic'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-[#317bea] focus:ring-[#317bea] border-gray-300"
                        />
                        <label htmlFor="vedic" className="ml-2 block text-sm text-gray-700">
                          Vedic (Indian)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="western"
                          name="system"
                          type="radio"
                          value="western"
                          checked={formData.system === 'western'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-[#317bea] focus:ring-[#317bea] border-gray-300"
                        />
                        <label htmlFor="western" className="ml-2 block text-sm text-gray-700">
                          Western (Tropical)
                        </label>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Vedic uses the sidereal zodiac with Lahiri ayanamsa. Western uses the tropical zodiac.</p>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-[#317bea] text-white font-semibold rounded-md hover:bg-[#317bea]/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Birth Chart...
                      </span>
                    ) : (
                      'Generate Birth Chart'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Birth Chart Results Section
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Birth Chart Results</h2>
                <button
                  onClick={() => setBirthChart(null)}
                  className="text-[#317bea] hover:text-[#317bea]/80 text-sm font-medium"
                >
                  Generate New Chart
                </button>
              </div>
              
              {/* Development Stage Notification Banner */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-blue-800">Development in Progress</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Our astrological chart calculations are still under development. We offer both Western (Tropical) and Vedic (Sidereal) 
                      systems, but some refinements are ongoing. If you notice any calculation discrepancies or other issues, 
                      please report them using the form below.
                    </p>
                    <button
                      onClick={() => setShowIssueForm(prevState => !prevState)}
                      className="mt-2 text-xs font-medium py-1 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
                    >
                      {showIssueForm ? 'Hide Issue Form' : 'Report an Issue'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Issue Reporting Form */}
              {showIssueForm && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Report an Issue</h3>
                  <form onSubmit={handleIssueSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="issueEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email (optional)
                        </label>
                        <input
                          type="email"
                          id="issueEmail"
                          name="issueEmail"
                          value={issueForm.issueEmail}
                          onChange={handleIssueInputChange}
                          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-1">
                          Issue Type*
                        </label>
                        <select
                          id="issueType"
                          name="issueType"
                          value={issueForm.issueType}
                          onChange={handleIssueInputChange}
                          required
                          className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                        >
                          <option value="">Select an issue type</option>
                          <option value="calculation">Calculation Error</option>
                          <option value="interpretation">Interpretation Issue</option>
                          <option value="display">Display Problem</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="issueDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Description*
                      </label>
                      <textarea
                        id="issueDescription"
                        name="issueDescription"
                        value={issueForm.issueDescription}
                        onChange={handleIssueInputChange}
                        required
                        rows={4}
                        className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                        placeholder="Please describe the issue in detail. If it's a calculation error, please note what system you were using (Western/Vedic) and what specific values look incorrect."
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      {issueSubmitted ? (
                        <p className="text-green-600 text-sm font-medium">Thank you for your feedback! We'll look into this issue.</p>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmittingIssue}
                          className="px-4 py-2 bg-[#317bea] text-white font-medium rounded-md hover:bg-[#317bea]/90 transition-colors disabled:opacity-50"
                        >
                          {isSubmittingIssue ? 'Submitting...' : 'Submit Issue'}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
              
              <div className="mb-6 p-4 bg-[#ffeee7] rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Birth Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium">{formData.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date of Birth:</span>
                    <span className="ml-2 font-medium">{new Date(formData.birthDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  {formData.birthTime && (
                    <div>
                      <span className="text-gray-600">Time of Birth:</span>
                      <span className="ml-2 font-medium">{formData.birthTime}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Place of Birth:</span>
                    <span className="ml-2 font-medium">{formData.birthPlace}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">System:</span>
                    <span className="ml-2 font-medium">{birthChart.system}</span>
                  </div>
                </div>
              </div>
              
              {/* Add calculation note */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-yellow-800">About These Calculations</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      This birth chart uses astronomically-based calculations, providing a close approximation 
                      to professional astrological software. For complete precision, we recommend consulting with
                      our expert astrologers who use specialized ephemeris data and can provide personalized interpretations.
                    </p>
                    {!formData.birthTime && (
                      <p className="text-sm font-medium text-yellow-700 mt-2">
                        Note: Without birth time, ascendant and house positions are approximated.
                        For greater accuracy, please include your time of birth.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Ascendant (Lagna)</h3>
                  <div className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-[#ffeee7]/30">
                    <p className="mb-2"><span className="font-medium">Rising Sign:</span> {birthChart.ascendant.sign}</p>
                    <p className="mb-2"><span className="font-medium">Degree:</span> {birthChart.ascendant.degree}°</p>
                    <p className="text-sm text-gray-600">
                      {birthChart.ascendant.description}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Moon Sign (Rashi)</h3>
                  <div className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-[#ffeee7]/30">
                    <p className="mb-2"><span className="font-medium">Moon Sign:</span> {birthChart.moonSign.sign}</p>
                    {birthChart.moonSign.nakshatra && (
                      <div className="mb-2">
                        <span className="font-medium">Nakshatra:</span> {birthChart.moonSign.nakshatra.name} (Pada {birthChart.moonSign.nakshatra.pada})
                        <div className="text-xs text-gray-500 mt-1">Ruled by {birthChart.moonSign.nakshatra.ruler}, Deity: {birthChart.moonSign.nakshatra.deity}</div>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">
                      {birthChart.moonSign.description}
                    </p>
                  </div>
                </div>
                
                {birthChart.sunSign && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Sun Sign</h3>
                    <div className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow bg-[#ffeee7]/30">
                      <p className="mb-2"><span className="font-medium">Sun Sign:</span> {birthChart.sunSign.sign}</p>
                      <p className="text-sm text-gray-600">
                        {birthChart.sunSign.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Planetary Positions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {birthChart.planetaryPositions.map((planet) => (
                    <div key={planet.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-2">
                        <div className="bg-[#ffeee7] text-[#fb9548] rounded-full w-10 h-10 flex items-center justify-center text-xl mr-3">
                          <span>{planet.glyph}</span>
                        </div>
                        <h4 className="font-medium">{planet.name} {planet.retrograde && <span className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-600">Retrograde</span>}</h4>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p><span className="font-medium">Sign:</span> {planet.sign}</p>
                        <p><span className="font-medium">House:</span> {planet.house}</p>
                        <p><span className="font-medium">Degree:</span> {planet.degree}°</p>
                        <p className="text-xs text-gray-500 mt-1">{planet.significations}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Houses</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {birthChart.houses.map((house) => (
                    <div key={house.number} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-medium mb-2">House {house.number}</h4>
                      <p className="text-sm text-gray-600"><span className="font-medium">Sign:</span> {house.sign}</p>
                      <p className="text-sm text-gray-600"><span className="font-medium">Cusp:</span> {house.cusp}°</p>
                      <p className="text-xs text-gray-500 mt-1">{house.significations}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {birthChart.aspects && birthChart.aspects.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Planetary Aspects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {birthChart.aspects.map((aspect, index) => (
                      <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium mb-1">{aspect.type}: {aspect.planet1} - {aspect.planet2}</h4>
                        <p className="text-xs text-gray-500 mb-2">Orb: {aspect.orb}°</p>
                        {aspect.influence && (
                          <p className="text-sm text-gray-600">{aspect.influence}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {birthChart.yogas && birthChart.yogas.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Auspicious Yogas</h3>
                  <div className="space-y-4">
                    {birthChart.yogas.map((yoga, index) => (
                      <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-green-50">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-green-800">{yoga.name}</h4>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{yoga.strength}</span>
                        </div>
                        <p className="text-sm text-gray-600">{yoga.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {birthChart.doshas && birthChart.doshas.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Planetary Challenges</h3>
                  <div className="space-y-4">
                    {birthChart.doshas.map((dosha, index) => (
                      <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-amber-50">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-amber-800">{dosha.name}</h4>
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">{dosha.severity}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{dosha.description}</p>
                        {dosha.remedies && (
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Suggested Remedies:</span> {dosha.remedies}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {birthChart.strengths && birthChart.strengths.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Planetary Strengths</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planet</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strength</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {birthChart.strengths.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.planet}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sign}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.house}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.strength === 'Exalted' ? 'bg-green-100 text-green-800' :
                                item.strength === 'Strong' ? 'bg-blue-100 text-blue-800' :
                                item.strength === 'Moderate' ? 'bg-gray-100 text-gray-800' :
                                item.strength === 'Challenged' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {item.strength}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <div className="bg-gradient-to-r from-[#fb9548] to-[#fb9548]/80 rounded-lg p-6 text-white text-center">
                  <h3 className="text-xl font-bold mb-3">Want a Detailed Birth Chart Reading?</h3>
                  <p className="mb-4">
                    Consult with our expert astrologers for a personalized reading and guidance based on your birth chart.
                  </p>
                  <button
                    onClick={handleBookConsultation}
                    className="px-8 py-3 bg-[#317bea] text-white font-semibold rounded-md hover:bg-[#317bea]/90 transition-colors"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Information Section */}
      <section className="py-12 max-w-8xl mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Understanding Your Birth Chart</h2>
          <p className="text-gray-600 mb-6">
            A birth chart, also known as a natal chart or horoscope, is a map of the sky at the exact moment of your birth. 
            It shows the positions of the planets, the Sun, and the Moon from the perspective of your birthplace.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-[#ffeee7] p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">The Ascendant (Lagna)</h3>
              <p className="text-gray-600">
                The Ascendant represents your outer personality and physical appearance. It is the zodiac sign that was rising 
                on the eastern horizon at the time of your birth and forms the first house in your chart.
              </p>
            </div>
            
            <div className="bg-[#ffeee7] p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">The Moon Sign (Rashi)</h3>
              <p className="text-gray-600">
                Your Moon sign represents your emotions, subconscious mind, and inner self. In Vedic astrology, 
                the Moon sign is often considered more important than the Sun sign.
              </p>
            </div>
            
            <div className="bg-[#ffeee7] p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">The Houses</h3>
              <p className="text-gray-600">
                The 12 houses in your birth chart represent different areas of your life, such as career, relationships, 
                health, and spirituality. The planets placed in these houses influence these life areas.
              </p>
            </div>
            
            <div className="bg-[#ffeee7] p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">The Planets</h3>
              <p className="text-gray-600">
                Each planet governs different aspects of your personality and life. Their positions in signs and houses, 
                as well as the aspects they form with each other, create a unique cosmic blueprint for your life.
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-blue-800">Our Astronomical Calculations</h3>
            <p className="text-gray-700 mb-3">
              Our birth chart calculator uses advanced astronomical algorithms based on the astronomia library to calculate 
              planetary positions with high accuracy. We incorporate:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Precise planetary motion calculations based on astronomical ephemeris data</li>
              <li>Proper ascendant calculations using local sidereal time</li>
              <li>Lahiri ayanamsa adjustments for sidereal zodiac positions</li>
              <li>Geographic coordinates for accurate birth location positioning</li>
              <li>Retrograde motion detection through comparative positional analysis</li>
            </ul>
            <p className="text-gray-700 mt-3">
              For the most detailed and personalized analysis, we recommend booking a consultation with our 
              expert astrologers who can provide deeper insights into your unique birth chart.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BirthChartAstrology; 