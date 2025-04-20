import { sendNavigationNotification } from './firestoreUtils';

// Map of puja IDs to their names - this could be fetched from an API in a real implementation
const pujaNameMap = {
  1: 'Satyanarayan Puja',
  2: 'Ganesh Puja',
  3: 'Lakshmi Puja',
  4: 'Griha Pravesh Puja',
  5: 'Navgraha Shanti Puja',
  6: 'Rudrabhishek',
  7: 'Kanya Puja',
  8: 'Sundarkand Path',
  9: 'Vastu Shanti Puja',
  10: 'Maha Mrityunjaya Japa',
  11: 'Durga Puja',
  12: 'Kaal Sarp Dosh Nivaran'
};

/**
 * Tracks a page navigation and sends a notification if appropriate
 * @param {string} from - Previous path
 * @param {string} to - Current path
 * @param {object} user - Current user object
 * @returns {Promise<boolean>} - Whether a notification was sent
 */
export const trackNavigation = async (from, to, user) => {
  if (!user) return false;
  
  // Check if navigating to a puja booking page
  const pujaBookingRegex = /^\/puja-booking\/(\d+)$/;
  const match = to.match(pujaBookingRegex);
  
  if (match && from === '/puja-booking') {
    const pujaId = parseInt(match[1]);
    const pujaName = pujaNameMap[pujaId] || `Puja #${pujaId}`;
    
    // Send a notification about the navigation
    return await sendNavigationNotification(
      user.uid,
      from,
      to,
      `${pujaName} booking`
    );
  }
  
  return false;
};

/**
 * Creates a custom hook for tracking navigation
 * @param {function} useNavigationHook - The hook to use for navigation (e.g., useLocation)
 * @param {function} useUserHook - The hook to use for getting the current user (e.g., useAuth)
 * @returns {function} - A hook that can be used to track navigation
 */
export const createNavigationTracker = (useNavigationHook, useUserHook) => {
  return () => {
    const location = useNavigationHook();
    const { currentUser } = useUserHook();
    
    let prevPath = null;
    
    if (location.pathname !== prevPath) {
      if (prevPath) {
        trackNavigation(prevPath, location.pathname, currentUser);
      }
      prevPath = location.pathname;
    }
    
    return location;
  };
}; 