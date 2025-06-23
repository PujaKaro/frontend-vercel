import { useState, useEffect } from 'react';

const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Announcements to rotate through
  const announcements = [
    "🛍️ Your One-Stop Destination for All Puja Needs! Call/WhatsApp: 8800627513",
    "🏠 We offer puja services at Temple, Home, Online & Yamuna Ghat",
    "✨ Expert Pandits, Complete Samagri, Beautiful Decor & More!"
  ];

  useEffect(() => {
    // Rotate announcements every 4 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="bg-gradient-to-r from-[#8B0000] to-[#FF9933] text-white py-2 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="relative h-6 overflow-hidden">
          {announcements.map((text, index) => (
            <div
              key={index}
              className={`absolute transition-transform duration-500 w-full ${
                index === currentIndex 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <p className="font-medium text-sm">{text}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-10 h-full bg-[url('/images/ornamental-border.svg')] opacity-20"></div>
      <div className="absolute top-0 right-0 w-10 h-full bg-[url('/images/ornamental-border.svg')] opacity-20 transform rotate-180"></div>
    </div>
  );
};

export default AnnouncementBar; 