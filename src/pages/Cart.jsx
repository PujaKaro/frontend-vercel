import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash, faArrowLeft, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { currentUser } = useAuth();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin', { state: { from: '/cart' } });
    }
  }, [currentUser, navigate]);

  const handleProceedToPayment = async () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = totalAmount * 0.18;
    const shippingCost = 99;
    const finalAmount = totalAmount + tax + shippingCost;

    // Navigate to payment page with order details
    navigate('/payment', {
      state: {
        orderDetails: {
          subtotal: totalAmount,
          tax: tax,
          shippingCost: shippingCost,
          total: finalAmount,
          items: cartItems
        }
      }
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        </div>
        
        {cartItems.length > 0 ? (
          <div className="lg:flex lg:space-x-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items ({cartItems.length})</h2>
                  
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="py-6 flex">
                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>
                                <Link to={`/${item.type}/${item.id}`} className="hover:text-blue-600">
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="ml-4">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Price: ₹{item.price.toLocaleString()}</p>
                          </div>
                          
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                                disabled={item.quantity <= 1}
                              >
                                <FontAwesomeIcon icon={faMinus} className="text-gray-500 h-3 w-3" />
                              </button>
                              <span className="mx-2 w-8 text-center text-gray-700">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                              >
                                <FontAwesomeIcon icon={faPlus} className="text-gray-500 h-3 w-3" />
                              </button>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="font-medium text-red-600 hover:text-red-800 flex items-center"
                            >
                              <FontAwesomeIcon icon={faTrash} className="mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-medium">₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="text-gray-600">Tax (18% GST)</p>
                      <p className="font-medium">₹{cartItems.reduce((sum, item) => sum + (item.price * item.quantity * 0.18), 0).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="text-gray-600">Delivery Charges</p>
                      <p className="font-medium">₹99</p>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <p className="text-lg font-bold text-gray-900">Total</p>
                      <p className="text-lg font-bold text-blue-600">₹{(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + cartItems.reduce((sum, item) => sum + (item.price * item.quantity * 0.18), 0) + 99).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleProceedToPayment}
                    disabled={cartItems.length === 0}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF8C00] hover:bg-[#FF8C00]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8C00]"
                  >
                    Proceed to Payment
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Secured payment powered by UPI
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FontAwesomeIcon icon={faShoppingBag} className="text-gray-300 text-5xl mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/shop"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;