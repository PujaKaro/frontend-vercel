import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendNotification } from '../utils/firestoreUtils';

const NotificationDebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, notifications, unreadCount } = useAuth();
  const [title, setTitle] = useState('Test Notification');
  const [message, setMessage] = useState('This is a test notification');
  const [type, setType] = useState('test');
  
  // Firebase index link to be used if needed
  const firebaseIndexLink = "https://console.firebase.google.com/v1/r/project/pujakaro-aaadc/firestore/indexes/compound";

  const handleCreateNotification = async () => {
    if (!currentUser) {
      alert('You must be logged in to create a notification');
      return;
    }

    try {
      await sendNotification(
        currentUser.uid,
        title,
        message,
        { type }
      );
      alert('Notification created successfully!');
    } catch (error) {
      console.error('Error creating notification:', error);
      alert(`Error creating notification: ${error.message}`);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-2 rounded-full shadow-lg z-50"
      >
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 w-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Notification Debug Panel</h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-1">User ID: {currentUser?.uid || 'Not logged in'}</p>
        <p className="text-sm text-gray-600 mb-1">Total Notifications: {notifications.length}</p>
        <p className="text-sm text-gray-600 mb-1">Unread Notifications: {unreadCount}</p>
        
        <div className="mt-2 p-2 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-800 mb-1">If you're seeing index errors, you need to create the required Firebase index:</p>
          <a 
            href={firebaseIndexLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Create Firebase Index
          </a>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="test">Test</option>
          <option value="navigation">Navigation</option>
          <option value="order">Order</option>
          <option value="booking">Booking</option>
          <option value="coupon">Coupon</option>
        </select>
      </div>

      <button 
        onClick={handleCreateNotification}
        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
      >
        Create Notification
      </button>

      <div className="mt-4 max-h-40 overflow-y-auto">
        <h4 className="font-medium mb-2">Recent Notifications</h4>
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications found</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li key={notification.id} className="py-2">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-gray-600">{notification.message}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    Type: {notification.type || 'unknown'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Read: {notification.read ? 'Yes' : 'No'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationDebugPanel; 