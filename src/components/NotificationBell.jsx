import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircle, faMapMarked, faMapMarkerAlt, faCompass } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    markNotificationAsRead(id);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    let date;
    try {
      // Handle Firestore Timestamp objects
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } 
      // Handle string timestamps
      else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      }
      // Handle numeric timestamps (milliseconds since epoch)
      else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      }
      // Handle Date objects
      else if (timestamp instanceof Date) {
        date = timestamp;
      }
      // Default fallback
      else {
        date = new Date();
      }

      // Ensure date is valid
      if (isNaN(date.getTime())) {
        return 'Just now';
      }
      
      const now = new Date();
      const diffMs = now - date;
      const diffMin = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMin < 1) return 'Just now';
      if (diffMin < 60) return `${diffMin} min ago`;
      if (diffHrs < 24) return `${diffHrs} hr ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return 'Just now';
    }
  };

  // Map notification type to an appropriate icon/color/style
  const getNotificationStyle = (type) => {
    switch(type) {
      case 'order':
        return { 
          bgColor: 'bg-blue-100', 
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
          icon: null
        };
      case 'booking':
        return { 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
          icon: null
        };
      case 'coupon':
        return { 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
          icon: null
        };
      case 'navigation':
        return { 
          bgColor: 'bg-purple-100', 
          textColor: 'text-purple-800',
          borderColor: 'border-purple-200',
          icon: faCompass
        };
      default:
        return { 
          bgColor: 'bg-gray-100', 
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
          icon: null
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell icon with notification indicator */}
      <button 
        onClick={toggleDropdown}
        className="text-gray-700 relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        aria-label="Notifications"
      >
        <FontAwesomeIcon icon={faBell} className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="fixed right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllNotificationsAsRead}
                className="text-xs text-[#317bea] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <div>
                {notifications.map((notification) => {
                  const style = getNotificationStyle(notification.type);
                  
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b ${style.borderColor} ${!notification.read ? 'bg-gray-50' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start">
                            {!notification.read && (
                              <FontAwesomeIcon icon={faCircle} className="text-[#317bea] text-xs mr-2 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium ${style.textColor} flex items-center text-sm`}>
                                {style.icon && <FontAwesomeIcon icon={style.icon} className="mr-2 flex-shrink-0" />}
                                <span className="truncate">{notification.title}</span>
                              </h4>
                              <p className="text-gray-600 text-sm mt-1 break-words">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {formatTimestamp(notification.createdAt)}
                                </span>
                                {!notification.read && (
                                  <button 
                                    onClick={(e) => handleMarkAsRead(e, notification.id)}
                                    className="text-xs text-[#317bea] hover:underline flex-shrink-0 ml-2"
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 