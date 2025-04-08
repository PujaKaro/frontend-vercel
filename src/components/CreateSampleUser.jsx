import { useState } from 'react';
import { createSampleUser } from '../utils/firestoreUtils';

const CreateSampleUser = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateUser = async () => {
    try {
      setLoading(true);
      setMessage('');
      await createSampleUser();
      setMessage('Sample user created successfully!');
    } catch (error) {
      setMessage('Error creating sample user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Create Sample User</h2>
      <button
        onClick={handleCreateUser}
        disabled={loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Sample User'}
      </button>
      {message && (
        <p className={`mt-4 p-2 rounded-md ${
          message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default CreateSampleUser;