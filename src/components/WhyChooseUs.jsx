import React from 'react';
import { Link } from 'react-router-dom';

const WhyChooseUs = () => {
  // Features highlighting why users should choose PujaKaro
  const features = [
    {
      icon: "🕉️",
      title: "Expert Pandits",
      description: "Experienced and knowledgeable pandits who perform authentic rituals with precision"
    },
    {
      icon: "🛍️",
      title: "Complete Samagri",
      description: "Premium quality puja materials sourced directly from religious suppliers"
    },
    {
      icon: "🏠",
      title: "Beautiful Decor",
      description: "Elegant and traditional decorations to create a divine ambience for your ceremony"
    },
    {
      icon: "🔥",
      title: "All Essentials",
      description: "Hawan kund, kalash, and all other ritual necessities provided with care"
    },
    {
      icon: "✅",
      title: "One Booking",
      description: "We handle everything from start to finish - just relax and focus on the spiritual experience"
    },
    {
      icon: "📍",
      title: "Multiple Locations",
      description: "Choose from temple, home, online or yamuna ghat for your puja ceremony"
    }
  ];

  return (
    <section className="py-12 relative overflow-hidden bg-gradient-to-r from-[#fcf4e9] to-[#fff9f0]">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        {/* We'll use a repeating pattern here */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#8B0000]"></div>
        <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-[#8B0000]"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-[#8B0000]"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#8B0000]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#8B0000] mb-4 inline-block relative">
            Why Choose PujaKaro
            <span className="block h-1 w-full bg-[#FFD700] mt-2 rounded"></span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-700">
            Your one-stop destination for all puja needs, offering an unmatched spiritual experience
          </p>
        </div>
        
        {/* Mobile scrollable cards */}
        <div className="relative">
          {/* Shadow indicators to show scrollable content */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#fcf4e9] to-transparent z-10 pointer-events-none md:hidden"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#fcf4e9] to-transparent z-10 pointer-events-none md:hidden"></div>
          
          <div className="overflow-x-auto pb-4 -mx-4 px-4 md:overflow-visible md:pb-0 md:mx-0 md:px-0 hide-scrollbar">
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-[270px] sm:w-[320px] md:w-auto bg-white p-6 rounded-lg shadow-sm border border-[#FFD700]/20 hover:shadow-md transition group"
                >
                  <div className="flex items-start">
                    <div className="mr-4 text-4xl">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2 text-[#8B0000] group-hover:text-[#D4AF37] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile scroll indicator */}
        <div className="flex justify-center gap-1 mt-4 md:hidden">
          <span className="block w-8 h-1 rounded-full bg-[#D4AF37]/30"></span>
          <span className="block w-2 h-1 rounded-full bg-[#D4AF37]/70"></span>
          <span className="block w-2 h-1 rounded-full bg-[#D4AF37]/70"></span>
        </div>
        
        <div className="mt-8 md:mt-10 text-center">
          <Link 
            to="/puja-booking" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#fb9548] text-[#8B0000] font-bold rounded-full hover:opacity-90 transition-opacity shadow-md"
          >
            Book Your Puja Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;     /* Firefox */
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;             /* Chrome, Safari and Opera */
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs; 