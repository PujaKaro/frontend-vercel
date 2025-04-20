import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trackNavigation } from '../utils/navigationTracker';

/**
 * Hook to track navigation between pages and send notifications
 * for specific navigation patterns
 */
export const useNavigationTracker = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const prevPathRef = useRef(null);
  
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Only track if we have a previous path and a user
    if (prevPathRef.current && currentUser) {
      trackNavigation(prevPathRef.current, currentPath, currentUser);
    }
    
    // Update the previous path for next navigation
    prevPathRef.current = currentPath;
  }, [location.pathname, currentUser]);
  
  return location;
};

export default useNavigationTracker; 