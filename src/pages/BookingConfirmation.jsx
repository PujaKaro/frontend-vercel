import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHome, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import SEO from '../components/SEO';

const BookingConfirmation = () => {
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState(null);
  
  useEffect(() => {
    // Get booking details from location state or localStorage
    const details = location.state?.bookingDetails;
    if (details) {
      setBookingDetails(details);
      // Save to localStorage in case of page refresh
      localStorage.setItem('lastBookingDetails', JSON.stringify(details));
    } else {
      // If no booking details in state, try to get from localStorage (in case of page refresh)
      const savedBookingDetails = localStorage.getItem('lastBookingDetails');
      if (savedBookingDetails) {
        setBookingDetails(JSON.parse(savedBookingDetails));
      }
    }
  }, [location]);
  
  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <SEO 
          title="Booking Confirmation | PujaKaro"
          description="Thank you for booking a puja service with PujaKaro."
          canonicalUrl="https://pujakaro.com/booking-confirmation"
          noindex={true}
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Booking Information Found</h1>
          <p className="text-gray-600 mb-8">It seems you've refreshed the page or accessed this page directly.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Return to Home
            </Link>
            <Link to="/puja-booking" className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">
              <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
              Explore More Pujas
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const { bookingId, puja, date, timeSlot, customerDetails, paymentId, price, pandit } = bookingDetails;
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <SEO 
        title="Booking Confirmation | PujaKaro"
        description="Thank you for booking a puja service with PujaKaro."
        canonicalUrl="https://pujakaro.com/booking-confirmation"
        noindex={true}
      />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-orange-500 py-6 px-6 text-white text-center">
          <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3" />
          <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-lg mt-2">Thank you for booking a puja with us</p>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-sm text-gray-600 font-medium">BOOKING NUMBER</h2>
              <p className="text-lg font-bold text-gray-800">{bookingId}</p>
            </div>
            {paymentId && (
              <div className="mb-4 md:mb-0">
                <h2 className="text-sm text-gray-600 font-medium">PAYMENT ID</h2>
                <p className="text-lg font-bold text-gray-800">{paymentId}</p>
              </div>
            )}
            <div>
              <h2 className="text-sm text-gray-600 font-medium">BOOKING AMOUNT</h2>
              <p className="text-lg font-bold text-gray-800">₹{price}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Puja Details</h2>
            <div className="flex items-start">
              <div className="h-20 w-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                <img src={puja.image} alt={puja.name} className="h-full w-full object-cover" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-800">{puja.name}</h3>
                <p className="text-gray-600 mt-1">Duration: {puja.duration}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                    Date: {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Time: {timeSlot}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {pandit && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Assigned Pandit</h2>
              <div className="flex items-center">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                  <img src={pandit.image} alt={pandit.name} className="h-full w-full object-cover" />
                </div>
                <div className="ml-4">
                  <h3 className="text-md font-medium text-gray-800">{pandit.name}</h3>
                  <p className="text-sm text-gray-600">Experience: {pandit.experience}</p>
                  <p className="text-sm text-gray-600">Specialization: {pandit.specialization}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Address</h2>
            <p className="text-gray-700">
              {customerDetails.name}<br />
              {customerDetails.address}<br />
              {customerDetails.city}, {customerDetails.state} {customerDetails.zip}<br />
              Phone: {customerDetails.phone}
            </p>
          </div>
          
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-gray-600 mb-6">
              You will receive a confirmation email shortly at {customerDetails.email}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Return to Home
              </Link>
              <Link to="/puja-booking" className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">
                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
                Explore More Pujas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 