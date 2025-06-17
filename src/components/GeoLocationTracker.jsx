import { useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const GeoLocationTracker = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchAndStoreLocation = async () => {
      if (!currentUser) return;

      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        const locationData = {
          uid: currentUser.uid,
          email: currentUser.email,
          city: data.city,
          region: data.region,
          postal: data.postal,
          country: data.country_name,
          ip: data.ip,
          datetime: new Date().toISOString(),
        };

        // Create or update the user's document in the 'livelocation' collection
        const locationRef = doc(db, 'livelocation', currentUser.uid);
        await setDoc(locationRef, locationData, { merge: true });

        // Optionally, save to localStorage
        localStorage.setItem('userLocation', JSON.stringify(locationData));

        console.log('Live location updated in livelocation collection');
      } catch (error) {
        console.error('Error fetching or storing location:', error);
      }
    };

    fetchAndStoreLocation();
  }, [currentUser]);

  return null;
};

export default GeoLocationTracker;