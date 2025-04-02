import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    // Mock cart data - In a real app, this would be fetched from an API
    const mockCartItems = [
      {
        id: 1,
        name: 'Silver Puja Thali Set',
        image: '/images/products/thali.jpg',
        price: 1499,
        quantity: 1,
        stock: 10
      },
      {
        id: 2,
        name: 'Brass Diya (Set of 5)',
        image: '/images/products/diya.jpg',
        price: 499,
        quantity: 2,
        stock: 15
      },
      {
        id: 3,
        name: 'Sandalwood Incense Sticks',
        image: '/images/products/incense.jpg',
        price: 199,
        quantity: 3,
        stock: 30
      }
    ];
    
    setCartItems(mockCartItems);
    setLoading(false);
  }, [isAuthenticated, navigate]);
  
  const handleQuantityChange = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 && newQuantity <= item.stock
            ? { ...item, quantity: newQuantity }
            : item;
        }
        return item;
      })
    );
  };
  
  const handleRemoveItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const handleCouponApply = () => {
    if (couponCode.toUpperCase() === 'PUJA10') {
      setCouponApplied(true);
      setDiscount(10); // 10% discount
    } else {
      alert('Invalid coupon code');
    }
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = couponApplied ? (subtotal * discount / 100) : 0;
    return subtotal - discountAmount;
  };
  
  const handleCheckout = () => {
    alert('Proceeding to checkout...');
    // In a real app, this would navigate to a checkout page or process
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/shop" className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none">
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Shopping Cart ({cartItems.length} items)</h2>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <li key={item.id} className="px-6 py-6 flex items-center">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className={`p-1 rounded-md ${
                              item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <span className="mx-2 px-3 py-1 border rounded-md text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={item.quantity >= item.stock}
                            className={`p-1 rounded-md ${
                              item.quantity >= item.stock ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                        
                        <div className="flex">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-800 flex items-center"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="mt-6">
                  <Link to="/shop" className="text-[#317bea] hover:text-[#317bea]/80 flex items-center">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="text-gray-900 font-medium">₹{calculateSubtotal().toLocaleString()}</p>
                </div>
                
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <p>Discount ({discount}%)</p>
                    <p>- ₹{((calculateSubtotal() * discount) / 100).toLocaleString()}</p>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="text-gray-900 font-medium">Free</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <p className="text-lg font-medium text-gray-900">Total</p>
                  <p className="text-lg font-bold text-[#317bea]">₹{calculateTotal().toLocaleString()}</p>
                </div>
                
                {!couponApplied && (
                  <div className="mt-6">
                    <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                      Apply Coupon Code
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="coupon"
                        name="coupon"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#317bea] focus:border-[#317bea] sm:text-sm"
                        placeholder="Enter coupon code"
                      />
                      <button
                        onClick={handleCouponApply}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none"
                      >
                        Apply
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Try "PUJA10" for 10% off</p>
                  </div>
                )}
                
                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-[#317bea] border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-[#317bea]/90 focus:outline-none"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 