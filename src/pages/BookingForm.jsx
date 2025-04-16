import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faUser, faMapMarkerAlt, faPhoneAlt, faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { pujaServices } from '../data/data';
import { trackPujaBooking, trackPurchase } from '../utils/analytics';
import { useAuth } from '../contexts/AuthContext';
import { saveFormData, getCurrentLocation, saveLocationToBooking } from '../utils/formUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import emailjs from 'emailjs-com';
import { createBooking } from '../utils/firestoreUtils';

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    additionalInfo: '',
    date: '',
    time: '',
    specialInstructions: ''
  });
  
  const [puja, setPuja] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    // Get puja info from location state or fetch it based on ID
    if (location.state?.puja) {
      setPuja(location.state.puja);
    } else {
      const pujaData = pujaServices.find(puja => puja.id === parseInt(id));
      if (pujaData) {
        setPuja(pujaData);
      } else {
        navigate('/puja-booking');
      }
    }
    
    // Track puja booking view in Google Analytics
    if (puja) {
      trackPujaBooking(puja);
    }

    // Get user's current location
    getCurrentLocation()
      .then(location => {
        setUserLocation(location);
      })
      .catch(error => {
        console.error('Error getting location:', error);
        toast.warning('Could not get your location. Please enter your address manually.');
      });

    if (!currentUser) {
      navigate('/signin', { state: { from: location.pathname } });
      return;
    }

    // Set user data if available
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      }));
    }
  }, [id, location, navigate, currentUser]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.replace(/\D/g, ''))) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Please sign in to book a puja');
      navigate('/login');
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const bookingData = {
          userId: currentUser.uid,
          userName: currentUser.displayName || formData.name,
          userEmail: currentUser.email,
          pujaId: puja.id,
          pujaName: puja.name,
          price: puja.price,
          date: formData.date,
          time: formData.time,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone,
          specialInstructions: formData.specialInstructions || '',
          additionalInfo: formData.additionalInfo || '',
          status: 'pending',
          location: userLocation || null
        };

        // Save booking to the bookings collection
        const bookingId = await createBooking(bookingData);

        // Send email notification about the new booking
        const emailParams = {
          to_email: 'pujakaro.in@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          from_phone: formData.phone,
          subject: `New Booking: ${puja.name}`,
          puja_name: puja.name,
          puja_date: formData.date,
          puja_time: formData.time,
          puja_price: puja.price.toLocaleString(),
          address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
          special_instructions: formData.specialInstructions || 'None',
          reply_to: 'pujakaro.in@gmail.com'
        };

        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams);

        // Navigate to booking confirmation page
        navigate('/booking-confirmation', {
          state: {
            bookingDetails: {
              bookingId,
              puja,
              price : puja.price,
              date: formData.date,
              timeSlot: formData.time,
              customerDetails: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode
              }
            }
          }
        });
        
        toast.success('Puja booking successful!');
      } catch (error) {
        console.error('Error saving booking:', error);
        toast.error(`Failed to book puja: ${error.text || error.message || 'Please try again'}`);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  if (!puja) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <span>Back</span>
        </button>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#fb9548] to-[#ffb677]">
            <h1 className="text-2xl font-bold text-white">Booking Details</h1>
            <p className="text-white text-opacity-90 mt-1">Please provide your details to complete the booking</p>
          </div>
          
          <div className="p-6">
            {/* Puja Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
              <div className="space-y-2">
                <div className="flex">
                  <div className="w-32 text-gray-600">Puja:</div>
                  <div className="font-medium">{puja.name}</div>
                </div>
                <div className="flex">
                  <div className="w-32 text-gray-600">Price:</div>
                  <div className="font-medium text-[#fb9548]">₹{puja.price.toLocaleString()}</div>
                </div>
                <div className="flex">
                  <div className="w-32 text-gray-600">Duration:</div>
                  <div className="font-medium">{puja.duration}</div>
                </div>
                <div className="flex">
                  <div className="w-32 text-gray-600">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    Date:
                  </div>
                  <div className="font-medium">{formData.date}</div>
                </div>
                <div className="flex">
                  <div className="w-32 text-gray-600">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    Time:
                  </div>
                  <div className="font-medium">{formData.time}</div>
                </div>
              </div>
            </div>
            
            {/* Booking Form */}
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
                    Full Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                    Email Address*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="phone">
                    Phone Number*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faPhoneAlt} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`w-full pl-10 pr-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>
              
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Details</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="address">
                  Address*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className={`w-full pl-10 pr-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="Your complete address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="city">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className={`w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="state">
                    State*
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className={`w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="pincode">
                    Pincode*
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    className={`w-full px-3 py-2 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="6-digit pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                  {errors.pincode && <p className="mt-1 text-sm text-red-500">{errors.pincode}</p>}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="additionalInfo">
                  Additional Information (Optional)
                </label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any specific requirements or information you want to share"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-[#fb9548] hover:bg-[#f58232] text-white py-3 rounded-lg font-medium flex items-center justify-center
                    ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;