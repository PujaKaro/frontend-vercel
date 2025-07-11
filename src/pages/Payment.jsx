import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faQrcode, faUpload, faCheck, 
  faMapMarkerAlt, faPlus, faEdit, faTrash,
  faPhone, faEnvelope, faUser, faCreditCard
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SEO from '../components/SEO';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { cartItems, clearCart } = useCart();
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment

  useEffect(() => {
    if (!currentUser) {
      navigate('/signin', { state: { from: '/payment' } });
      return;
    }

    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Get order details from location state
    const details = location.state?.orderDetails;
    if (details) {
      setOrderDetails(details);
    } else {
      // Calculate order details
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.18;
      const shippingCost = 99;
      const total = subtotal + tax + shippingCost;
      
      setOrderDetails({
        subtotal,
        tax,
        shippingCost,
        total,
        items: cartItems
      });
    }

    // Load user addresses
    loadUserAddresses();
  }, [currentUser, navigate, cartItems, location]);

  const loadUserAddresses = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const addresses = userData.addresses || [];
        setUserAddresses(addresses);
        
        // Set default address if available
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Failed to load addresses');
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const addressData = {
        ...newAddress,
        id: Date.now().toString(),
        createdAt: new Date()
      };

      await updateDoc(doc(db, 'users', currentUser.uid), {
        addresses: arrayUnion(addressData)
      });

      setUserAddresses(prev => [...prev, addressData]);
      setSelectedAddress(addressData);
      setShowAddressForm(false);
      setNewAddress({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
      
      toast.success('Address added successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentScreenshot && !utrNumber) {
      toast.error('Please provide either payment screenshot or UTR number');
      return;
    }

    setLoading(true);
    
    try {
      // Create order in Firestore
      const orderData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || '',
        userEmail: currentUser.email || '',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
          image: item.image
        })),
        subtotal: orderDetails.subtotal,
        tax: orderDetails.tax,
        shippingCost: orderDetails.shippingCost,
        total: orderDetails.total,
        status: 'pending',
        paymentMethod: 'UPI',
        paymentScreenshot: paymentScreenshot,
        utrNumber: utrNumber,
        shippingAddress: selectedAddress,
        createdAt: new Date()
      };

      // Add order to Firestore
      const { addDoc, collection } = await import('firebase/firestore');
      const orderRef = await addDoc(collection(db, 'orders'), orderData);

      // Clear cart
      clearCart();

      // Navigate to confirmation
      navigate('/order-confirmation', {
        state: {
          orderDetails: {
            orderId: orderRef.id,
            items: cartItems,
            totalAmount: orderDetails.total,
            shippingAddress: selectedAddress
          }
        }
      });

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const proceedToPayment = () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    setStep(2);
  };

  if (!currentUser || !orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEO 
        title="Payment | PujaKaro"
        description="Complete your payment securely with UPI"
        canonicalUrl="https://pujakaro.com/payment"
      />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2">Address</span>
            </div>
            <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-orange-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2">Payment</span>
            </div>
          </div>
        </div>

        <div className="lg:flex lg:space-x-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {step === 1 ? (
              /* Address Selection Step */
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
                  
                  {/* Existing Addresses */}
                  {userAddresses.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-700 mb-3">Saved Addresses</h3>
                      <div className="space-y-3">
                        {userAddresses.map((address) => (
                          <div 
                            key={address.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedAddress?.id === address.id 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleAddressSelect(address)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <FontAwesomeIcon icon={faUser} className="text-gray-400 mr-2" />
                                  <span className="font-medium">{address.name}</span>
                                  {address.isDefault && (
                                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center mb-1">
                                  <FontAwesomeIcon icon={faPhone} className="text-gray-400 mr-2" />
                                  <span className="text-sm text-gray-600">{address.phone}</span>
                                </div>
                                <div className="flex items-start">
                                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mr-2 mt-1" />
                                  <div className="text-sm text-gray-600">
                                    <div>{address.address}</div>
                                    <div>{address.city}, {address.state} {address.pincode}</div>
                                  </div>
                                </div>
                              </div>
                              {selectedAddress?.id === address.id && (
                                <FontAwesomeIcon icon={faCheck} className="text-orange-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Address */}
                  {!showAddressForm ? (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      Add New Address
                    </button>
                  ) : (
                    <div className="border rounded-lg p-4">
                      <h3 className="text-md font-medium text-gray-700 mb-4">Add New Address</h3>
                      <form onSubmit={handleAddressSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.name}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              required
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complete Address *
                          </label>
                          <textarea
                            required
                            rows="3"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.city}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.state}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pincode *
                            </label>
                            <input
                              type="text"
                              required
                              value={newAddress.pincode}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>
                        </div>
                        <div className="flex items-center mb-4">
                          <input
                            type="checkbox"
                            id="defaultAddress"
                            checked={newAddress.isDefault}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                            className="mr-2"
                          />
                          <label htmlFor="defaultAddress" className="text-sm text-gray-700">
                            Set as default address
                          </label>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                          >
                            Save Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {selectedAddress && (
                    <div className="mt-6">
                      <button
                        onClick={proceedToPayment}
                        className="w-full bg-orange-600 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-700 transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Payment Step */
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">UPI Payment</h2>
                  
                  {/* UPI QR Code */}
                  <div className="mb-6 p-6 bg-gray-50 rounded-lg text-center">
                    <FontAwesomeIcon icon={faQrcode} className="text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Scan QR Code to Pay</h3>
                    <p className="text-gray-600 mb-4">
                      Amount: <span className="font-bold text-lg">₹{orderDetails.total.toLocaleString()}</span>
                    </p>
                    <div className="bg-white p-4 rounded-lg inline-block">
                      {/* Replace with actual QR code image */}
                      <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">QR Code</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      UPI ID: pujakaro@upi
                    </p>
                  </div>

                  {/* Payment Confirmation Form */}
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-700 mb-3">Payment Confirmation</h3>
                      
                      {/* Screenshot Upload */}
                      {/* <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Screenshot
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <FontAwesomeIcon icon={faUpload} className="text-2xl text-gray-400 mb-2" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="hidden"
                            id="screenshot-upload"
                          />
                          <label htmlFor="screenshot-upload" className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-700">
                              Click to upload screenshot
                            </span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                        </div>
                        {paymentScreenshot && (
                          <div className="mt-2">
                            <img 
                              src={paymentScreenshot} 
                              alt="Payment Screenshot" 
                              className="w-32 h-32 object-cover rounded border"
                            />
                          </div>
                        )}
                      </div> */}

                      {/* UTR Number */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          UTR Number 
                        </label>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="Enter UTR number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      {/* Contact Information */}
                      <div className="mb-4 p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Send payment screenshot to WhatsApp: <span className="font-medium">+91 98765 43210</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Or call us: <span className="font-medium">+91 98765 43210</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Back to Address
                      </button>
                      <button
                        type="submit"
                        disabled={loading || (!paymentScreenshot && !utrNumber)}
                        className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : 'Confirm Order'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">₹{orderDetails.subtotal.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Tax (18% GST)</p>
                    <p className="font-medium">₹{orderDetails.tax.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Delivery Charges</p>
                    <p className="font-medium">₹{orderDetails.shippingCost.toLocaleString()}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <p className="text-lg font-bold text-gray-900">Total</p>
                    <p className="text-lg font-bold text-orange-600">₹{orderDetails.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Selected Address */}
                {selectedAddress && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Delivery Address</h3>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium">{selectedAddress.name}</div>
                      <div>{selectedAddress.phone}</div>
                      <div>{selectedAddress.address}</div>
                      <div>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}</div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Items</h3>
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} x {item.quantity}</span>
                        <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 