import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash, faArrowLeft, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // In a real app, cart items would come from a Context or Redux store
  // For demo, we'll use local storage
  const [cartItems, setCartItems] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    };
    
    loadCartItems();
    
    // Add event listener to update cart when changes occur
    const handleStorageChange = () => {
      loadCartItems();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for sessionStorage cartUpdated flag
    const interval = setInterval(() => {
      const cartUpdated = sessionStorage.getItem('cartUpdated');
      if (cartUpdated) {
        loadCartItems();
        sessionStorage.removeItem('cartUpdated');
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  const updateQuantity = (productId, productType, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Update the cart items in state
    const updatedCart = cartItems.map(item => 
      (item.id === productId && item.type === productType) ? { ...item, quantity: newQuantity } : item
    );
    
    // Update state and localStorage
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  const removeItem = (productId, productType) => {
    // Filter out the item to be removed
    const updatedCart = cartItems.filter(item => 
      !(item.id === productId && item.type === productType)
    );
    
    // Update state and localStorage
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateTax = () => {
    // Assuming 18% GST
    return calculateSubtotal() * 0.18;
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + (cartItems.length > 0 ? 99 : 0); // Delivery charge: ₹99
  };
  
  // Razorpay integration
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, you would create an order from your backend
    // and get the order ID, which would be used to initialize Razorpay
    
    // Simulate a backend call
    setTimeout(() => {
      const options = {
        key: "rzp_test_yourkeyhere", // Enter your test key here
        amount: calculateTotal() * 100, // Razorpay amount is in paisa
        currency: "INR",
        name: "Pooja",
        description: "Purchase of Puja Items",
        image: "/images/logo.png",
        handler: function (response) {
          // Handle the success payment
          console.log('Payment successful', response);
          // Redirect to order confirmation page
          navigate('/order-confirmation', { 
            state: { 
              orderId: 'ORD' + Math.floor(Math.random() * 1000000),
              items: cartItems,
              amount: calculateTotal(),
              paymentId: response.razorpay_payment_id
            } 
          });
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9876543210"
        },
        notes: {
          address: "Customer Address"
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };
      
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      setIsLoading(false);
    }, 1000);
  };
  
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
                                onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                              >
                                <FontAwesomeIcon icon={faMinus} className="text-gray-500 h-3 w-3" />
                              </button>
                              <span className="mx-2 w-8 text-center text-gray-700">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                              >
                                <FontAwesomeIcon icon={faPlus} className="text-gray-500 h-3 w-3" />
                              </button>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeItem(item.id, item.type)}
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
                      <p className="font-medium">₹{calculateSubtotal().toLocaleString()}</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="text-gray-600">Tax (18% GST)</p>
                      <p className="font-medium">₹{calculateTax().toLocaleString()}</p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="text-gray-600">Delivery Charges</p>
                      <p className="font-medium">₹99</p>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 flex justify-between">
                      <p className="text-lg font-bold text-gray-900">Total</p>
                      <p className="text-lg font-bold text-blue-600">₹{calculateTotal().toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading || cartItems.length === 0}
                    className={`w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center
                      ${(isLoading || cartItems.length === 0) ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    {isLoading ? (
                      'Processing...'
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faShoppingBag} className="mr-2" />
                        Proceed to Checkout
                      </>
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Secured payment powered by Razorpay
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