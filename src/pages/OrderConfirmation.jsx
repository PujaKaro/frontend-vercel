import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHome, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import SEO from '../components/SEO';

const OrderConfirmation = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  
  useEffect(() => {
    // Get order details from location state or localStorage
    const details = location.state?.orderDetails;
    if (details) {
      setOrderDetails(details);
      // Clear cart after successful order
      localStorage.removeItem('cart');
    } else {
      // If no order details in state, try to get from localStorage (in case of page refresh)
      const savedOrderDetails = localStorage.getItem('lastOrderDetails');
      if (savedOrderDetails) {
        setOrderDetails(JSON.parse(savedOrderDetails));
      }
    }
  }, [location]);
  
  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <SEO 
          title="Order Confirmation | PujaKaro"
          description="Thank you for your order with PujaKaro."
          canonicalUrl="https://pujakaro.com/order-confirmation"
          noindex={true}
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Order Information Found</h1>
          <p className="text-gray-600 mb-8">It seems you've refreshed the page or accessed this page directly.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Return to Home
            </Link>
            <Link to="/shop" className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">
              <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const { orderId, items, totalAmount, paymentId, shippingAddress } = orderDetails;
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <SEO 
        title="Order Confirmation | PujaKaro"
        description="Thank you for your order with PujaKaro."
        canonicalUrl="https://pujakaro.com/order-confirmation"
        noindex={true}
      />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-500 py-6 px-6 text-white text-center">
          <FontAwesomeIcon icon={faCheckCircle} className="text-4xl mb-3" />
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-lg mt-2">Thank you for your purchase</p>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap justify-between mb-8">
            <div className="mb-4 md:mb-0">
              <h2 className="text-sm text-gray-600 font-medium">ORDER NUMBER</h2>
              <p className="text-lg font-bold text-gray-800">{orderId}</p>
            </div>
            {paymentId && (
              <div className="mb-4 md:mb-0">
                <h2 className="text-sm text-gray-600 font-medium">PAYMENT ID</h2>
                <p className="text-lg font-bold text-gray-800">{paymentId}</p>
              </div>
            )}
            <div>
              <h2 className="text-sm text-gray-600 font-medium">ORDER TOTAL</h2>
              <p className="text-lg font-bold text-gray-800">₹{totalAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-center">
                  <div className="h-16 w-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-800">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {shippingAddress && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Address</h2>
              <p className="text-gray-700">
                {shippingAddress.name}<br />
                {shippingAddress.street}<br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}<br />
                Phone: {shippingAddress.phone}
              </p>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-gray-600 mb-6">
              You will receive an email confirmation shortly at {shippingAddress?.email || "your registered email"}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Return to Home
              </Link>
              <Link to="/shop" className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">
                <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 