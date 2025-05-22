import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { migrateDataToFirestore } from '../utils/dataUtils';
import { toast } from 'react-hot-toast';

const MigrateDataButton = ({ onSuccess, className, buttonText }) => {
  const [loading, setLoading] = useState(false);

  const handleMigrateData = async () => {
    try {
      setLoading(true);
      const result = await migrateDataToFirestore();
      
      if (result.success) {
        toast.success(result.message);
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess();
        }
      } else {
        toast.error(result.message);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error(`Migration failed: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMigrateData}
      disabled={loading}
      className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className || ''}`}
    >
      {loading ? (
        <>
          <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
          <span>Migrating...</span>
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faDatabase} className="mr-2" />
          <span>{buttonText || 'Initialize Data'}</span>
        </>
      )}
    </button>
  );
};

export default MigrateDataButton; 