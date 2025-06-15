import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EmailVerification = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { currentUser, resendEmailVerification, checkEmailVerification, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user email is already verified, redirect to phone verification
    if (currentUser?.emailVerified) {
      if (currentUser?.phoneVerified) {
        navigate('/profile');
      } else {
        navigate('/phone-verification');
      }
    }
  }, [currentUser, navigate]);

  // Auto-check verification status every 10 seconds
  useEffect(() => {
    if (!currentUser?.emailVerified) {
      const interval = setInterval(async () => {
        try {
          const isVerified = await checkEmailVerification();
          if (isVerified) {
            toast.success('Email verified successfully!');
            // Redirect to phone verification instead of profile
            navigate('/phone-verification');
          }
        } catch (error) {
          // Silent failure for auto-checking
        }
      }, 10000); // Check every 10 seconds

      return () => clearInterval(interval);
    }
  }, [currentUser, checkEmailVerification, navigate]);

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      setMessage('');
      
      await resendEmailVerification();
      setMessage('Verification email sent! Please check your inbox and spam folder.');
      toast.success('Verification email sent!');
    } catch (error) {
      const errorMessage = error.message || 'Failed to send verification email. Please try again.';
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setIsChecking(true);
      setMessage('');
      
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        setMessage('Email verified successfully! Redirecting to phone verification...');
        toast.success('Email verified successfully!');
        setTimeout(() => {
          navigate('/phone-verification');
        }, 2000);
      } else {
        setMessage('Email not yet verified. Please check your inbox and click the verification link.');
        toast.error('Email not yet verified');
      }
    } catch (error) {
      const errorMessage = 'Error checking verification status. Please try again.';
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      toast.error('Error logging out. Please try again.');
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
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">Email Verification</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-500">Phone Verification</span>
            </div>
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify Your Email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a verification email to <strong>{currentUser.email}</strong>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Step 1: Email Verification
            </h3>
            
            <p className="mt-2 text-sm text-gray-500 mb-6">
              Click the verification link in your email to activate your account. 
              After email verification, you'll need to verify your phone number to complete the setup.
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

            <div className="space-y-4">
              <button
                onClick={handleCheckVerification}
                disabled={isChecking}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#317bea] disabled:opacity-50"
              >
                {isChecking ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking...
                  </div>
                ) : (
                  'Check Verification Status'
                )}
              </button>

              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#317bea] disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign Out
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>Didn't receive the email?</p>
              <ul className="mt-2 space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure the email address is correct</li>
                <li>• Wait a few minutes and try resending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
