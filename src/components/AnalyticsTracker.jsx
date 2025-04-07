import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

/**
 * Component for tracking page views in Google Analytics
 * This is a "silent" component that doesn't render anything
 */
const AnalyticsTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Get the current document title
    const pageTitle = document.title;
    
    // Track page view on initial load and when location changes
    trackPageView(location.pathname, pageTitle);
    
    // Set up a listener for title changes, as it might change after the page loads
    const titleObserver = new MutationObserver(() => {
      trackPageView(location.pathname, document.title);
    });
    
    // Start observing the document title
    titleObserver.observe(document.querySelector('title'), {
      subtree: true,
      characterData: true,
      childList: true
    });
    
    // Clean up observer on component unmount
    return () => titleObserver.disconnect();
  }, [location]);
  
  // This component doesn't render anything
  return null;
};

export default AnalyticsTracker; 