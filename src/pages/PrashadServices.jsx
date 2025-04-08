import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUtensils, 
  faCalendarAlt, 
  faClock, 
  faCheckCircle, 
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faHeart,
  faHandHoldingHeart,
  faStar,
  faPrayingHands,
  faTruck
} from '@fortawesome/free-solid-svg-icons';
import { loadRazorpay } from '../utils/razorpay';

const PrashadServices = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    sector: '',
    address: '',
    preferredDay: 'any'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Initialize Razorpay
      await loadRazorpay();

      // Create payment options
      const options = {
        key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay test key
        amount: 1499 * 100, // amount in paise
        currency: 'INR',
        name: 'Puja Services',
        description: 'Prashad Service Activation',
        handler: function(response) {
          // Save the form data and payment details
          const formData = {
            ...formData,
            paymentId: response.razorpay_payment_id,
            activatedOn: new Date().toISOString(),
            serviceName: 'Prashad Service'
          };

          // Save to localStorage
          const existingServices = JSON.parse(localStorage.getItem('activatedServices') || '[]');
          localStorage.setItem('activatedServices', JSON.stringify([...existingServices, formData]));

          // Save card details if provided
          if (response.razorpay_payment_method === 'card') {
            const cardDetails = {
              last4: response.razorpay_payment_method_details.card.last4,
              brand: response.razorpay_payment_method_details.card.brand,
              expiry: response.razorpay_payment_method_details.card.expiry_month + '/' + 
                     response.razorpay_payment_method_details.card.expiry_year
            };
            
            const existingCards = JSON.parse(localStorage.getItem('savedCards') || '[]');
            localStorage.setItem('savedCards', JSON.stringify([...existingCards, cardDetails]));
          }

          // Show success message
          setSuccess('Service activated successfully!');
          setFormData({
            name: '',
            phone: '',
            city: '',
            sector: '',
            address: '',
            preferredDay: 'any'
          });
        },
        prefill: {
          name: formData.name,
          email: '',
          contact: formData.phone
        },
        theme: {
          color: '#fb9548'
        }
      };

      // Open Razorpay payment modal
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
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
      <div className="relative bg-[#FF8C00] text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Prashad Services
            </h1>
            <p className="mt-4 text-lg sm:text-xl max-w-3xl mx-auto">
              Experience the divine taste of authentic prashad, prepared with pure devotion and traditional recipes
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Value Proposition */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Connect with Divine Blessings
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our Prashad services bring the sacred essence of traditional offerings to your doorstep. 
            Each prashad is prepared with utmost devotion, following age-old recipes and rituals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faUtensils} className="h-8 w-8 text-[#FF8C00] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentic Recipes</h3>
            <p className="text-gray-600">Traditional recipes passed down through generations</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faPrayingHands} className="h-8 w-8 text-[#FF8C00] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Divine Preparation</h3>
            <p className="text-gray-600">Prepared with devotion by experienced pandits</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faTruck} className="h-8 w-8 text-[#FF8C00] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fresh Delivery</h3>
            <p className="text-gray-600">Delivered fresh and warm to your doorstep</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-[#FF8C00] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600">Always here to assist with your needs</p>
          </div>
        </div>

        {/* Service Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Special Offerings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4 hover:border-[#FF8C00] transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Daily Prashad</h3>
              <p className="text-gray-600">Fresh prashad for daily worship and rituals</p>
            </div>
            <div className="border rounded-lg p-4 hover:border-[#FF8C00] transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Days</h3>
              <p className="text-gray-600">Special prashad for Tuesdays and Saturdays</p>
            </div>
            <div className="border rounded-lg p-4 hover:border-[#FF8C00] transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Festival Specials</h3>
              <p className="text-gray-600">Traditional prashad for festivals and celebrations</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Register for Service</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF8C00] focus:border-[#FF8C00]"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF8C00] focus:border-[#FF8C00]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF8C00] focus:border-[#FF8C00]"
                />
              </div>

              <div>
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                  Sector/Area
                </label>
                <input
                  type="text"
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF8C00] focus:border-[#FF8C00]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Complete Address
              </label>
              <textarea
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF8C00] focus:border-[#FF8C00]"
              />
            </div>

            <div>
              <label htmlFor="preferredDay" className="block text-sm font-medium text-gray-700">
                Preferred Day
              </label>
              <select
                id="preferredDay"
                name="preferredDay"
                value={formData.preferredDay}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF8C00] focus:border-[#FF8C00]"
              >
                <option value="any">Any Day</option>
                <option value="tuesday">Tuesday (Hanuman Ji)</option>
                <option value="saturday">Saturday (Shani Dev)</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF8C00] hover:bg-[#FF8C00]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8C00]"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Submit Registration'}
              </button>
            </div>

            {/* Status Messages */}
            {loading && (
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-700 text-center">Processing your request...</p>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <p className="text-red-700 text-center">{error}</p>
              </div>
            )}
            {success && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <p className="text-green-700 text-center">{success}</p>
              </div>
            )}
          </form>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <FontAwesomeIcon icon={faPhone} className="h-6 w-6 text-[#FF8C00] mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600">+91 7982545360</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-[#FF8C00] mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600">pujakaro.in@gmail.com</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-6 w-6 text-[#FF8C00] mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600">G-275 Molarband Extn. New Delhi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrashadServices; 