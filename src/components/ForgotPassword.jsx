import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword, checkEmailExists } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address.');
      return;
    }

    try {
      setMessage('');
      setLoading(true);
      
      // Add basic email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setMessage('Please enter a valid email address.');
        setLoading(false);
        return;
      }
      
      // Send password reset email directly
      await resetPassword(email);
      setSuccess(true);
      setMessage('Password reset email sent! Please check your inbox (and spam folder) for instructions to reset your password.');
    } catch (error) {
      // Display the error message with more context
      if (error.message) {
        setMessage(error.message);
      } else if (error.code) {
        // Handle Firebase error codes
        switch (error.code) {
          case 'auth/user-not-found':
            setMessage('No account found with this email address. Please check your email or sign up for a new account.');
            break;
          case 'auth/invalid-email':
            setMessage('The email address is not valid. Please enter a valid email address.');
            break;
          case 'auth/too-many-requests':
            setMessage('Too many attempts. Please try again later.');
            break;
          default:
            setMessage('Failed to send password reset email. Please try again.');
        }
      } else {
        setMessage('Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Email Sent!
              </h3>
              <p className="mt-2 text-sm text-gray-500 mb-6">
                {message}
              </p>
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <p className="text-sm text-blue-700">
                  <strong>Important:</strong> If you don't see the email in your inbox, please check your spam or junk folder.
                </p>
              </div>
              <div className="space-y-4">
                <Link
                  to="/signin"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#317bea]"
                >
                  Back to Sign In
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setMessage('');
                    setEmail('');
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#317bea]"
                >
                  Send Another Email
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {message && (
                <div className={`p-4 rounded-md ${
                  message.includes('sent') || message.includes('Success')
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  <p className="text-sm">{message}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#317bea] focus:border-[#317bea] sm:text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#317bea] disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Email'}
                </button>
              </div>

              <div className="text-center">
                <Link 
                  to="/signin" 
                  className="text-sm text-[#317bea] hover:text-[#317bea]/90"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
