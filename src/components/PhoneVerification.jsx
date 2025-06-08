import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  PhoneAuthProvider,
  updatePhoneNumber 
} from 'firebase/auth';
import { auth } from '../config/firebase';

const PhoneVerification = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [testMode, setTestMode] = useState(false);
  const [testOtp, setTestOtp] = useState('123456'); // Default test OTP
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already phone verified, redirect to profile
    if (currentUser?.phoneVerified) {
      navigate('/profile');
    }
    
    // If email is not verified, redirect to email verification
    if (!currentUser?.emailVerified) {
      navigate('/email-verification');
    }
    
    // Set phone number from user data if available
    if (currentUser?.phone) {
      setPhoneNumber(currentUser.phone);
    }
  }, [currentUser, navigate]);

  // Setup invisible reCAPTCHA only when not in test mode
  useEffect(() => {
    if (!testMode) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [testMode]);

  const handleSendVerificationCode = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('Please enter a valid phone number');
      }
      
      if (testMode) {
        // Test mode - simulate sending OTP
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        setCodeSent(true);
        setMessage(`TEST MODE: Verification code sent to ${phoneNumber}. Use code: ${testOtp}`);
        toast.success('Test verification code sent!');
      } else {
        // Real Firebase Phone Authentication
        // Format phone number for international format (assuming India +91)
        const formattedPhoneNumber = phoneNumber.startsWith('+') 
          ? phoneNumber 
          : `+91${phoneNumber}`; // Assuming India country code
        
        const appVerifier = window.recaptchaVerifier;
        
        // Send verification code via SMS
        const confirmationResult = await signInWithPhoneNumber(
          auth, 
          formattedPhoneNumber, 
          appVerifier
        );
        
        // Save the verification ID for later
        window.confirmationResult = confirmationResult;
        
        setCodeSent(true);
        setMessage(`Verification code sent to ${formattedPhoneNumber}`);
        toast.success('Verification code sent!');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to send verification code. Please try again.';
      setMessage(errorMessage);
      toast.error(errorMessage);
      
      // Reset reCAPTCHA if there's an error and not in test mode
      if (!testMode && window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          window.recaptchaVerifier.reset(widgetId);
        }).catch(err => {
          console.log('Could not render/reset reCAPTCHA');
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      if (!verificationCode || verificationCode.length < 4) {
        throw new Error('Please enter a valid verification code');
      }
      
      if (testMode) {
        // Test mode - verify against test OTP
        if (verificationCode !== testOtp) {
          throw new Error(`Invalid code. For testing, use: ${testOtp}`);
        }
        
        // Update user profile to mark phone as verified
        await updateUserProfile(currentUser.uid, {
          phoneVerified: true,
          phone: phoneNumber
        });
      } else {
        // Real Firebase Phone Authentication verification
        const result = await window.confirmationResult.confirm(verificationCode);
        
        // If successful, we have a valid phone number
        // Update user profile to mark phone as verified
        await updateUserProfile(currentUser.uid, {
          phoneVerified: true,
          phone: phoneNumber
        });
      }
      
      setMessage('Phone verified successfully! Redirecting to your profile...');
      toast.success('Phone verified successfully!');
      
      // Redirect to profile after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      const errorMessage = error.message || 'Failed to verify code. Please try again.';
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add a useEffect to handle redirection if user is not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  // Don't render anything if there's no user
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Email Verified</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Phone Verification</span>
            </div>
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify Your Phone Number
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          This is the final step to secure your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Step 2: Phone Verification
            </h3>
            
            <p className="mt-2 text-sm text-gray-500 mb-6">
              We'll send a verification code to your phone number to confirm it's really you.
            </p>

            {message && (
              <div className={`p-4 rounded-md mb-6 ${
                message.includes('sent') || message.includes('Success')
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                <p className="text-sm">{message}</p>
              </div>
            )}

            {/* Invisible reCAPTCHA container */}
            <div id="recaptcha-container"></div>

            <div className="space-y-4">
              {/* Test Mode Toggle */}
              <div className="flex items-center justify-center mb-4">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={testMode}
                      onChange={() => setTestMode(!testMode)}
                    />
                    <div className={`block w-10 h-6 rounded-full ${testMode ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${testMode ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-sm font-medium text-gray-700">
                    Test Mode {testMode ? 'ON' : 'OFF'}
                  </div>
                </label>
              </div>

              {!codeSent ? (
                <>
                  <div>
                    <label htmlFor="phone" className="sr-only">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#317bea] focus:border-[#317bea] sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <button
                    onClick={handleSendVerificationCode}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#317bea] disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      'Send Verification Code'
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="code" className="sr-only">
                      Verification Code
                    </label>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      required
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#317bea] focus:border-[#317bea] sm:text-sm"
                      placeholder="Enter verification code"
                    />
                  </div>
                  <button
                    onClick={handleVerifyCode}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#317bea] disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                  <button
                    onClick={() => setCodeSent(false)}
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#317bea] disabled:opacity-50"
                  >
                    Send New Code
                  </button>
                </>
              )}
            </div>

            <div className="mt-6 text-xs text-gray-500">
              {testMode ? (
                <div className="bg-yellow-50 p-3 rounded-md mb-2">
                  <p className="font-semibold mb-1">🧪 TEST MODE ACTIVE</p>
                  <p>For testing, use the verification code: <span className="font-bold">{testOtp}</span></p>
                  <p className="mt-2">No real SMS will be sent in test mode.</p>
                </div>
              ) : (
                <div className="bg-yellow-50 p-3 rounded-md mb-2">
                  <p className="font-semibold mb-1">📱 Phone Verification</p>
                  <p>Firebase will send a real SMS verification code to your phone number.</p>
                  <p className="mt-2 text-red-600">Error: Billing is not enabled for this Firebase project.</p>
                  <p className="mt-1">Please switch to Test Mode or enable billing in Firebase Console.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerification;