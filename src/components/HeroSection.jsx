import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const HeroSection = () => {
  // State for upcoming events/pujas
  const [currentDate] = useState(new Date());
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [heroStats, setHeroStats] = useState({
    pujasToday: "238",
    happyDevotees: "1,500+",
    expertPandits: "50+"
  });
  const [loading, setLoading] = useState(true);

  // Fetch upcoming events and stats from Firebase
  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        setLoading(true);
        
        // Fetch hero stats
        const statsDoc = await getDoc(doc(db, 'siteContent', 'heroStats'));
        if (statsDoc.exists()) {
          setHeroStats(statsDoc.data());
        }
        
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
        console.error('Error fetching home page content:', error);
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

    fetchHomePageContent();
  }, [currentDate]);

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

  return (
    <section className="relative py-8 md:py-0 md:h-[600px] overflow-hidden bg-[#fcf7f1]">
      {/* Background image with light overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="/images/heroBanner.jpg" 
          className="w-full h-full object-cover" 
          alt="Hero Banner" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF6E5]/60 to-[#FFF6E5]/40"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FFF6E5]/40 to-transparent"></div>
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full border-4 border-[#fb9548]/30 animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 rounded-full border-2 border-[#317bea]/30 animate-pulse hidden lg:block"></div>
      
      {/* Sacred symbols floating in background with better visibility */}
      <div className="absolute top-1/4 right-1/6 w-10 h-10 text-3xl animate-float-slow text-[#FF7F00]/40">🕉️</div>
      <div className="absolute bottom-1/3 right-1/3 w-10 h-10 text-3xl animate-float-medium text-[#FF7F00]/40">🪔</div>
      <div className="absolute top-1/2 right-1/4 w-10 h-10 text-3xl animate-float-fast text-[#FF7F00]/40">🙏</div>
      
      {/* Content */}
      <div className="relative max-w-8xl mx-auto px-4 md:h-full flex flex-col md:flex-row items-center justify-between py-8 md:py-0">
        {/* Left side - Main content with enhanced design (mobile responsive + lighter theme) */}
        <div className="w-full md:max-w-2xl text-center md:text-left mb-8 md:mb-0 relative z-10">
          {/* Decorative Om symbol */}
          <div className="hidden md:block absolute -top-8 -left-8 text-8xl text-[#FF7F00]/20 rotate-12">
            🕉️
          </div>
          
          {/* Content container with saffron border */}
          <div className="relative p-0.5 rounded-lg overflow-hidden">
            {/* Animated gradient border - using saffron colors */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7F00] via-[#FFB347] to-[#FF7F00] opacity-60 rounded-lg animate-pulse"></div>
            
            {/* Main content - lighter background */}
            <div className="relative bg-[#FFF8ED] p-6 md:p-8 rounded-lg border border-amber-100/50 shadow-lg">
              {/* Decorative floral corner elements */}
              <img src="/images/ornamental-border.svg" className="absolute top-2 right-2 w-10 md:w-14 h-10 md:h-14 opacity-30" alt="" />
              <img src="/images/ornamental-border.svg" className="absolute bottom-2 left-2 w-10 md:w-14 h-10 md:h-14 opacity-30 rotate-180" alt="" />
              
              {/* Headline with highlighted text - Enhanced mobile responsiveness */}
              <div className="mb-4 md:mb-6 relative">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-[#8B0000]">
                  <span className="inline">Experience Sacred</span>
                  <span className="relative inline-block mx-1">
                    <span className="relative z-10">Traditions</span>
                    <span className="absolute bottom-1 left-0 w-full h-[10%] bg-[#FF7F00]/30 -rotate-1"></span>
                  </span>
                  <span className="inline">with PujaKaro</span>
                </h1>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#FF7F00] to-transparent mt-3 mx-auto md:mx-0"></div>
              </div>
              
              {/* Description with icon */}
              <div className="flex flex-col md:flex-row items-center md:items-start md:justify-start mb-6 md:mb-8">
                <span className="text-2xl text-[#FF7F00] mr-0 md:mr-3 mb-2 md:mb-0">🪔</span>
                <p className="text-base md:text-lg text-[#5F4B32]">
                  Your trusted platform for authentic puja services, religious products, and spiritual guidance delivered with devotion
                </p>
              </div>
              
              {/* Featured services summary */}
              <div className="grid grid-cols-2 gap-3 mb-6 md:mb-8 max-w-md mx-auto md:mx-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FFE8CC] flex items-center justify-center mr-2">
                    <span className="text-sm">🙏</span>
                  </div>
                  <span className="text-sm font-medium text-[#5F4B32]">Expert Pandits</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FFE8CC] flex items-center justify-center mr-2">
                    <span className="text-sm">🌺</span>
                  </div>
                  <span className="text-sm font-medium text-[#5F4B32]">Fresh Flowers</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FFE8CC] flex items-center justify-center mr-2">
                    <span className="text-sm">✨</span>
                  </div>
                  <span className="text-sm font-medium text-[#5F4B32]">Sacred Rituals</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FFE8CC] flex items-center justify-center mr-2">
                    <span className="text-sm">🏮</span>
                  </div>
                  <span className="text-sm font-medium text-[#5F4B32]">Divine Prashad</span>
                </div>
              </div>
              
              {/* Call to action buttons with enhanced design - smaller size and always in one row */}
              <div className="flex flex-row justify-center md:justify-start gap-2 sm:gap-4 max-w-md mx-auto md:mx-0">
                <Link 
                  to="/puja-booking" 
                  className="px-3 sm:px-5 py-2 bg-gradient-to-r from-[#FF7F00] to-[#FFB347] text-white font-medium rounded-full hover:shadow-lg hover:shadow-[#FFB347]/20 transition-all transform hover:translate-y-[-2px] flex items-center justify-center group text-xs sm:text-sm"
                >
                  <span className="text-base sm:text-lg mr-1 group-hover:rotate-12 transition-transform">🪔</span>
                  <span>Book a Puja</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link 
                  to="/shop" 
                  className="px-3 sm:px-5 py-2 bg-[#8B0000] text-white font-medium rounded-full hover:bg-[#a50000] transition-all flex items-center justify-center group text-xs sm:text-sm"
                >
                  <span className="text-base mr-1">🛍️</span>
                  <span>Shop Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - Auspicious Calendar */}
        <div className="w-full md:max-w-md text-center md:text-left relative z-10">
          {loading ? (
            <div className="bg-white/90 rounded-lg overflow-hidden border border-amber-200 shadow-xl p-12 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF7F00]"></div>
            </div>
          ) : (
            <>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden border border-amber-200 shadow-xl">
                <div className="px-4 py-3 bg-gradient-to-r from-[#8B0000] to-[#FF7F00] text-white">
                  <h3 className="font-bold text-xl flex items-center justify-center md:justify-start">
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
              
              {/* Live Counter */}
              <div className="mt-4 bg-white/80 p-3 rounded-lg border border-amber-200 flex justify-between items-center shadow-md">
                <div className="text-center">
                  <div className="font-bold text-amber-600 text-xl animate-pulse">{heroStats.pujasToday}</div>
                  <div className="text-xs text-amber-900">Pujas Today</div>
                </div>
                <div className="h-8 w-px bg-amber-200"></div>
                <div className="text-center">
                  <div className="font-bold text-[#FF7F00] text-xl">{heroStats.happyDevotees}</div>
                  <div className="text-xs text-amber-900">Happy Devotees</div>
                </div>
                <div className="h-8 w-px bg-amber-200"></div>
                <div className="text-center">
                  <div className="font-bold text-[#8B0000] text-xl">{heroStats.expertPandits}</div>
                  <div className="text-xs text-amber-900">Expert Pandits</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 