import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AuthTestComponent = () => {
  const [email, setEmail] = useState('');
  const [results, setResults] = useState('');
  const { checkEmailExists, resetPassword } = useAuth();

  const testEmailExists = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setResults('Checking...');
      const exists = await checkEmailExists(email);
      const result = `Email ${email} ${exists ? 'EXISTS' : 'DOES NOT EXIST'} in Firebase Auth`;
      setResults(result);
      toast.success(result);
    } catch (error) {
      const errorMsg = `Error checking email: ${error.message}`;
      setResults(errorMsg);
      toast.error(errorMsg);
    }
  };

  const testPasswordReset = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setResults('Sending password reset...');
      await resetPassword(email);
      const result = `Password reset email sent to ${email}`;
      setResults(result);
      toast.success(result);
    } catch (error) {
      const errorMsg = `Error sending reset email: ${error.message}`;
      setResults(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Firebase Auth Test</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Test Email Address:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter email to test"
          />
        </div>

        <div className="space-y-2">
          <button
            onClick={testEmailExists}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Test Email Exists
          </button>
          
          <button
            onClick={testPasswordReset}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          >
            Test Password Reset
          </button>
        </div>

        {results && (
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <h3 className="font-medium mb-2">Test Results:</h3>
            <p className="text-sm">{results}</p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <h4 className="font-medium mb-2">How to test:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Enter an email address you've used to sign up</li>
            <li>Click "Test Email Exists" - should return TRUE</li>
            <li>Enter a random email that doesn't exist</li>
            <li>Click "Test Email Exists" - should return FALSE</li>
            <li>For existing email, click "Test Password Reset"</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AuthTestComponent;
