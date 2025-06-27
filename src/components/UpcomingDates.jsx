import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link } from 'react-router-dom';

const UpcomingDates = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingDates = async () => {
      try {
        setLoading(true);
        
        // Fetch upcoming events
        const eventsQuery = query(
          collection(db, 'auspiciousDates'), 
          orderBy('date', 'asc')
        );
        
        const eventsSnapshot = await getDocs(eventsQuery);
        
        if (!eventsSnapshot.empty) {
          const now = new Date();
          // Filter for future events and sort by date
          const eventsData = eventsSnapshot.docs
            .map(doc => {
              const data = doc.data();
              // Convert Firestore timestamp to Date object
              const eventDate = data.date?.toDate ? data.date.toDate() : new Date(data.date);
              return {
                id: doc.id,
                ...data,
                date: eventDate
              };
            })
            .filter(event => event.date > now)
            .sort((a, b) => a.date - b.date)
            .slice(0, 4); // Get only the next 4 events
          
          setUpcomingEvents(eventsData);
        } else {
          // If no events in database, use sample data as fallback
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();
          
          const sampleEvents = [
            {
              id: 1,
              name: "Satyanarayan Puja",
              date: new Date(currentYear, currentMonth, currentDate.getDate() + 2),
              icon: "🪔",
              color: "bg-amber-100 text-amber-800 border-amber-200"
            },
            {
              id: 2,
              name: "Ganesh Chaturthi",
              date: new Date(currentYear, currentMonth, currentDate.getDate() + 5),
              icon: "🙏",
              color: "bg-orange-100 text-orange-800 border-orange-200"
            },
            {
              id: 3,
              name: "Sundarkand Path",
              date: new Date(currentYear, currentMonth, currentDate.getDate() + 9),
              icon: "✨",
              color: "bg-yellow-100 text-yellow-800 border-yellow-200"
            },
            {
              id: 4,
              name: "Laxmi Puja",
              date: new Date(currentYear, currentMonth, currentDate.getDate() + 12),
              icon: "💫",
              color: "bg-rose-100 text-rose-800 border-rose-200"
            }
          ];
          
          setUpcomingEvents(sampleEvents);
        }
      } catch (error) {
        console.error('Error fetching upcoming dates:', error);
        // Use sample data as fallback in case of error
        setUpcomingEvents([
          {
            id: 1,
            name: "Satyanarayan Puja",
            date: new Date(new Date().setDate(new Date().getDate() + 2)),
            icon: "🪔",
            color: "bg-amber-100 text-amber-800 border-amber-200"
          },
          {
            id: 2,
            name: "Ganesh Chaturthi",
            date: new Date(new Date().setDate(new Date().getDate() + 5)),
            icon: "🙏",
            color: "bg-orange-100 text-orange-800 border-orange-200"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingDates();
  }, []);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (eventDate) => {
    const diffTime = eventDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF7F00]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden border border-amber-200 shadow-xl">
      <div className="px-4 py-3 bg-gradient-to-r from-[#8B0000] to-[#FF7F00] text-white">
        <h3 className="font-bold text-xl flex items-center justify-center">
          <span className="mr-2">✨</span>
          Upcoming Auspicious Dates
        </h3>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {upcomingEvents.map(event => (
            <Link key={event.id} to="/puja-booking" className="block">
              <div className={`flex items-center p-3 rounded-lg border ${event.color} transition-transform hover:scale-[1.02]`}>
                <span className="text-2xl mr-3">{event.icon}</span>
                <div className="flex-grow text-left">
                  <h4 className="font-semibold">{event.name}</h4>
                  <p className="text-sm opacity-80">
                    {formatDate(event.date)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold">{getDaysRemaining(event.date)}</span>
                  <p className="text-xs">days left</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Link 
            to="/daily-horoscope" 
            className="inline-block px-4 py-2 bg-[#8B0000]/10 hover:bg-[#8B0000]/20 text-[#8B0000] font-medium rounded-full text-sm transition-colors"
          >
            View Daily Horoscope →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingDates; 