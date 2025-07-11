import { useState, useEffect } from 'react';

const UpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Check if service worker has an update
    if ('serviceWorker' in navigator) {
      let updateAvailable = false;

      const handleControllerChange = () => {
        if (!updateAvailable) {
          updateAvailable = true;
          setShowUpdate(true);
        }
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      // Check for updates less frequently (every 2 minutes instead of 30 seconds)
      const checkForUpdates = () => {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration && !updateAvailable) {
            registration.update();
          }
        });
      };

      const interval = setInterval(checkForUpdates, 2 * 60 * 1000);
      
      return () => {
        clearInterval(interval);
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    // Small delay to show updating state
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Update Available</h3>
          <p className="text-xs opacity-90">A new version is ready to install</p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleDismiss}
            className="px-2 py-1 text-xs opacity-70 hover:opacity-100"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="px-3 py-1 bg-white text-orange-500 rounded text-xs font-medium hover:bg-gray-100 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification; 