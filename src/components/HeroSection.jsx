import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const HeroSection = () => {
  const [heroContent, setHeroContent] = useState({
    headline: "Connect with Divine through PujaKaro",
    description: "Your trusted platform for authentic puja services, religious products, and spiritual guidance",
    primaryButton: {
      text: "Book a Puja",
      link: "/puja-booking"
    },
    secondaryButton: {
      text: "Shop Now",
      link: "/shop"
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        const heroDoc = await getDoc(doc(db, 'siteContent', 'heroSection'));
        if (heroDoc.exists()) {
          setHeroContent(heroDoc.data());
        }
      } catch (error) {
        console.error('Error fetching hero content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  if (loading) {
    return (
      <section className="relative h-[600px]">
        <div className="relative max-w-8xl mx-auto px-4 h-full flex items-center">
          <img 
            src="/images/heroBanner.jpg" 
            className="absolute inset-0 w-full h-full object-cover" 
            alt="Hero Banner" 
          />
          <div className="max-w-2xl text-white relative z-10">
            <div className="animate-pulse h-12 bg-white/20 rounded mb-6"></div>
            <div className="animate-pulse h-6 bg-white/20 rounded mb-8"></div>
            <div className="flex gap-4">
              <div className="animate-pulse h-12 bg-white/20 rounded w-32"></div>
              <div className="animate-pulse h-12 bg-white/20 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[600px]">
      <div className="relative max-w-8xl mx-auto px-4 h-full flex items-center">

        <img 
          src="/images/heroBanner.jpg" 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Hero Banner" 
        />
        <div className="max-w-2xl text-white relative z-10">
          <h1 className="text-5xl font-bold mb-6">
            {heroContent.headline}
          </h1>
          <p className="text-xl mb-8">
            {heroContent.description}
          </p>
          <div className="flex gap-4">
            <Link 
              to={heroContent.primaryButton.link} 
              className="px-8 py-3 bg-[#fb9548] text-white font-semibold rounded-button hover:bg-[#fb9548]/90 transition-colors text-center"
            >
              {heroContent.primaryButton.text}
            </Link>
            <Link 
              to={heroContent.secondaryButton.link} 
              className="px-8 py-3 bg-[#317bea] text-white font-semibold rounded-button hover:bg-[#317bea]/90 transition-colors text-center"
            >
              {heroContent.secondaryButton.text}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 