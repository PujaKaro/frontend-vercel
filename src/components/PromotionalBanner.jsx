import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const PromotionalBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default banners as fallback
  const defaultBanners = [
    {
      icon: "✨",
      title: "Your One-Stop Destination for All Puja Needs!",
      highlights: ["Experienced Pandit Ji", "Puja Samagri (complete)", "Home Decor", "Ritual Essentials"],
      cta: "Book Now with Pujakaro.in • Call/WhatsApp: 8800627513"
    },
    {
      icon: "🛕",
      title: "Where would you like your Puja?",
      highlights: ["At Kalka Ji Temple", "At Your Home", "Online Puja", "At Yamuna Ghat"],
      cta: "Complete Puja Services at Your Chosen Location"
    },
    {
      icon: "🔥",
      title: "Everything You Need for a Perfect Puja — Hassle-Free!",
      highlights: ["Expert Pandit Ji ", "Complete Puja Samagri", "Beautiful Home Decor", "All Ritual Essentials"],
      cta: "One Booking — We Handle Everything!"
    }
  ];

  // Fetch banners from Firestore
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannerDoc = await getDoc(doc(db, 'siteContent', 'promotionalBanner'));
        if (bannerDoc.exists() && bannerDoc.data().banners) {
          setBanners(bannerDoc.data().banners);
        } else {
          setBanners(defaultBanners);
        }
      } catch (error) {
        console.error('Error fetching promotional banners:', error);
        setBanners(defaultBanners);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    if (banners.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);

  // Show loading state
  if (loading) {
    return (
      <section className="py-3 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#ffbe55] to-[#ffd68f] rounded-md shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-white/20 rounded mb-4"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-4 bg-white/20 rounded mb-4"></div>
              <div className="h-8 bg-white/20 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no banners
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="py-3 relative overflow-hidden">
      {/* Background decorative pattern */}
      <div className="absolute inset-0 bg-opacity-5 pointer-events-none" 
        style={{backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Decorative top border with gradient and pattern */}
        <div className="h-2 bg-gradient-to-r from-[#fb9548] via-[#FFD700] to-[#8B0000] rounded-t-md relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" 
            style={{backgroundImage: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)', animation: 'shimmer 2s infinite'}}></div>
        </div>
        
        <div className="bg-gradient-to-r from-[#ffbe55] to-[#ffd68f] rounded-b-md shadow-lg overflow-hidden border-b-4 border-[#D4AF37]/40">
          {/* Gold ornamental corners with decorative patterns */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#D4AF37] rounded-tl-sm" style={{
            backgroundImage: "radial-gradient(circle at top left, #D4AF37 2px, transparent 2px)",
            backgroundSize: "8px 8px"
          }}></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#D4AF37] rounded-tr-sm" style={{
            backgroundImage: "radial-gradient(circle at top right, #D4AF37 2px, transparent 2px)",
            backgroundSize: "8px 8px"
          }}></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-[#D4AF37] rounded-bl-sm" style={{
            backgroundImage: "radial-gradient(circle at bottom left, #D4AF37 2px, transparent 2px)",
            backgroundSize: "8px 8px"
          }}></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#D4AF37] rounded-br-sm" style={{
            backgroundImage: "radial-gradient(circle at bottom right, #D4AF37 2px, transparent 2px)",
            backgroundSize: "8px 8px"
          }}></div>
          
          <div className="relative px-4 py-5">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FFD700]/15 to-transparent rounded-full -translate-y-1/2 translate-x-1/4 blur-sm"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-radial from-[#8B0000]/10 to-transparent rounded-full translate-y-1/3 -translate-x-1/3 blur-sm"></div>
            
            {/* Subtle Om symbol */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#8B0000]/5 text-[200px] font-serif select-none pointer-events-none">ॐ</div>
            
            <div className="relative z-10">
              {/* Carousel content - increased height on mobile devices */}
              <div className="relative h-[210px] sm:h-[180px] md:h-[130px]">
                {banners.map((banner, index) => (
                  <div 
                    key={index} 
                    className={`absolute w-full transition-all duration-700 transform ${
                      activeIndex === index 
                        ? 'opacity-100 translate-x-0' 
                        : index < activeIndex 
                          ? 'opacity-0 -translate-x-full' 
                          : 'opacity-0 translate-x-full'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-shrink-0 hidden md:flex">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD700] to-[#fb9548] flex items-center justify-center shadow-md border border-[#D4AF37]/30">
                          <span className="text-3xl">{banner.icon}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold mb-2 text-[#8B0000]">
                          {banner.title}
                          <div className="h-0.5 w-24 bg-gradient-to-r from-[#D4AF37] to-transparent mt-1"></div>
                        </h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-sm md:text-base">
                          {banner.highlights.map((item, i) => (
                            <div key={i} className="flex items-center group">
                              <span className="w-2 h-2 bg-gradient-to-r from-[#8B0000] to-[#D4AF37] rounded-full mr-2 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                              <span className="line-clamp-1 group-hover:text-[#8B0000] transition-colors">{item}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2.5 text-sm font-medium text-[#8B0000]">{banner.cta}</div>
                      </div>
                      <div className="md:self-center flex-shrink-0">
                        <Link 
                          to="/puja-booking" 
                          className="px-5 py-2.5 bg-gradient-to-r from-[#8B0000] to-[#fb9548] text-white font-semibold rounded-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md inline-flex items-center gap-1 border border-[#D4AF37]/30"
                        >
                          Book a Puja
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Enhanced indicator dots */}
              <div className="flex justify-center mt-3 gap-1.5">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeIndex === index 
                        ? 'bg-gradient-to-r from-[#8B0000] to-[#D4AF37] w-8' 
                        : 'bg-[#8B0000]/20 w-2 hover:bg-[#8B0000]/30'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
      `}</style>
    </section>
  );
};

export default PromotionalBanner; 