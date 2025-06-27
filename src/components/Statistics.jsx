import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Statistics = () => {
  const [heroStats, setHeroStats] = useState({
    pujasToday: "238",
    happyDevotees: "1,500+",
    expertPandits: "50+"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsDoc = await getDoc(doc(db, 'siteContent', 'heroStats'));
        if (statsDoc.exists()) {
          setHeroStats(statsDoc.data());
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF7F00]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 p-6 rounded-lg border border-amber-200 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Achievements</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="font-bold text-amber-600 text-3xl animate-pulse mb-2">{heroStats.pujasToday}</div>
          <div className="text-sm text-amber-900 font-medium">Pujas Today</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-[#FF7F00] text-3xl mb-2">{heroStats.happyDevotees}</div>
          <div className="text-sm text-amber-900 font-medium">Happy Devotees</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-[#8B0000] text-3xl mb-2">{heroStats.expertPandits}</div>
          <div className="text-sm text-amber-900 font-medium">Expert Pandits</div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 