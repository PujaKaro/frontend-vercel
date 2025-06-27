import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const FeaturedPuja = () => {
  const [featuredPujaContent, setFeaturedPujaContent] = useState({
    heading: "Featured Puja",
    pujaName: "Satyanarayan Puja",
    description: "Experience the divine blessings of Lord Vishnu through this auspicious puja performed by our expert pandits. This sacred ceremony brings prosperity and peace to your home.",
    price: "₹5,100",
    nextAvailable: "Tomorrow",
    duration: "2 hours",
    image: "/images/featuredPuja.jpg"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPujaContent = async () => {
      try {
        setLoading(true);
        const featuredPujaDoc = await getDoc(doc(db, 'siteContent', 'featuredPuja'));
        if (featuredPujaDoc.exists()) {
          setFeaturedPujaContent(featuredPujaDoc.data());
        }
      } catch (error) {
        console.error('Error fetching featured puja content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPujaContent();
  }, []);

  if (loading) {
    return (
      <section className="py-10 relative overflow-hidden">
        <div className="max-w-8xl mx-auto px-4 relative z-10">
          <div className="text-center mb-6">
            <div className="animate-pulse h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
          </div>
          <div className="animate-pulse bg-gray-200 h-96 rounded-xl"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 relative overflow-hidden">
      {/* Decorative background */}
      <div 
        className="absolute inset-0 bg-[#fb9548]/10" 
        style={{ 
          backgroundImage: "url('/images/Section.png')", 
          backgroundSize: "cover", 
          backgroundPosition: "center",
          opacity: 0.85
        }}
      ></div>
      
      {/* Content container */}
      <div className="max-w-8xl mx-auto px-4 relative z-10">
        <div className="text-center mb-6">
          <h2 className="inline-block text-3xl md:text-4xl font-bold mb-4 relative">
            {featuredPujaContent.heading}
            <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-[#fb9548] rounded-full transform scale-x-75"></div>
          </h2>
        </div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden relative border border-[#fb9548]/20">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 -translate-x-16 -translate-y-16 bg-[#fb9548]/10 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-32 translate-y-32 bg-[#317bea]/10 rounded-full"></div>
          
          <div className="grid md:grid-cols-2 relative">
            <div className="p-8 md:p-12 relative z-10">
              <span className="inline-block px-4 py-1 bg-[#ffeee7] text-[#fb9548] rounded-full text-sm font-medium mb-6 border border-[#fb9548]/20">
                Special Offer
              </span>
              
              <h3 className="text-3xl font-bold mb-4 text-[#8B0000]">{featuredPujaContent.pujaName}</h3>
              
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {featuredPujaContent.description}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-[#ffeee7] px-4 py-2 rounded-full">
                  <FontAwesomeIcon icon={faCalendar} className="text-[#fb9548]" />
                  <span>Next Available: {featuredPujaContent.nextAvailable}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#ffeee7] px-4 py-2 rounded-full">
                  <FontAwesomeIcon icon={faClock} className="text-[#fb9548]" />
                  <span>Duration: {featuredPujaContent.duration}</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link 
                  to="/puja-booking" 
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#fb9548] to-[#fb7a48] text-white font-bold rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  Book Now at {featuredPujaContent.price}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <span className="text-gray-500 text-sm">Includes complete samagri</span>
              </div>
            </div>
            
            <div className="relative h-full min-h-[400px] order-first md:order-last">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden z-10"></div>
              <img 
                src={featuredPujaContent.image} 
                className="absolute inset-0 w-full h-full object-cover" 
                alt={featuredPujaContent.pujaName} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPuja;
