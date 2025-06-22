import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const COLLECTION_NAME = 'LiveLocation';

const IPInfoLocationTracker = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    // Fetch location from ipapi.co (no token needed)
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(async data => {
        console.log('ipapi location:', data);

        // Parse lat/lon if available
        const latitude = data.latitude || null;
        const longitude = data.longitude || null;

        // Update Firestore
        await setDoc(
          doc(db, COLLECTION_NAME, currentUser.uid),
          {
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            city: data.city || '',
            region: data.region || '',
            country: data.country || '',
            latitude,
            longitude,
            ip: data.ip,
            updatedAt: serverTimestamp(),
            source: 'ipapi'
          },
          { merge: true }
        );
      })
      .catch(err => {
        console.log('ipapi error:', err);
      });
  }, [currentUser]);

  return null;
};

export default IPInfoLocationTracker;