import React, { useEffect, useState } from 'react';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import FeaturedPuja from '../components/FeaturedPuja';
import ProductsSection from '../components/ProductsSection';
import PanditSection from '../components/PanditSection';
import TestimonialSection from '../components/TestimonialSection';
import SEO from '../components/SEO';
import PromotionalBanner from '../components/PromotionalBanner';
import WhyChooseUs from '../components/WhyChooseUs';
import Statistics from '../components/Statistics';
import UpcomingDates from '../components/UpcomingDates';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Home = () => {
  const [homeLayout, setHomeLayout] = useState({
    sections: [
      { id: 'hero', name: 'Hero Section', enabled: true, order: 1 },
      { id: 'promotionalBanner', name: 'Promotional Banner', enabled: true, order: 2 },
      { id: 'statistics', name: 'Statistics', enabled: true, order: 3 },
      { id: 'upcomingDates', name: 'Upcoming Dates', enabled: true, order: 4 },
      { id: 'services', name: 'Services', enabled: true, order: 5 },
      { id: 'whyChooseUs', name: 'Why Choose Us', enabled: true, order: 6 },
      { id: 'featuredPuja', name: 'Featured Puja', enabled: true, order: 7 },
      { id: 'productsSection', name: 'Products Section', enabled: true, order: 8 },
      { id: 'testimonialSection', name: 'Testimonials', enabled: true, order: 9 },
      { id: 'panditSection', name: 'Pandit Section', enabled: true, order: 10 }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeLayout = async () => {
      try {
        setLoading(true);
        const layoutDoc = await getDoc(doc(db, 'siteContent', 'homeLayout'));
        if (layoutDoc.exists()) {
          setHomeLayout(layoutDoc.data());
        }
      } catch (error) {
        console.error('Error fetching home layout:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeLayout();
  }, []);

  // Define the JSON-LD schemas for the home page
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://pujakaro.com/#organization",
    "name": "PujaKaro",
    "url": "https://pujakaro.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pujakaro.com/images/logo.png",
      "width": 180,
      "height": 60
    },
    "description": "Your trusted platform for authentic puja services, religious products, and spiritual guidance",
    "sameAs": [
      "https://www.facebook.com/pujakaro",
      "https://www.instagram.com/pujakaro",
      "https://twitter.com/pujakaro"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400001",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9876543210",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://pujakaro.com/#website",
    "url": "https://pujakaro.com",
    "name": "PujaKaro",
    "description": "Your trusted platform for authentic puja services, religious products, and spiritual guidance",
    "publisher": {
      "@id": "https://pujakaro.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://pujakaro.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ReligiousOrganization",
    "@id": "https://pujakaro.com/#localbusiness",
    "name": "PujaKaro",
    "image": "https://pujakaro.com/images/store-front.jpg",
    "url": "https://pujakaro.com",
    "telephone": "+91-9876543210",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Temple Street",
      "addressLocality": "Mumbai",
      "addressRegion": "Maharashtra",
      "postalCode": "400001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "₹₹₹"
  };

  const aggregateOfferSchema = {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    "@id": "https://pujakaro.com/#aggregateoffer",
    "priceCurrency": "INR",
    "lowPrice": "500",
    "highPrice": "5000",
    "offerCount": "100+",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
  };

  // Combine all schemas into a single array for the SEO component
  const combinedSchema = [
    organizationSchema,
    websiteSchema,
    localBusinessSchema,
    aggregateOfferSchema
  ];

  // Add smooth scroll behavior
  useEffect(() => {
    // Add smooth scroll behavior to the entire page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      // Clean up when component unmounts
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Render section based on ID
  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'hero':
        return <HeroSection key="hero" />;
      case 'promotionalBanner':
        return (
          <div key="promotionalBanner" className="relative z-10 mt-1">
            <PromotionalBanner />
          </div>
        );
      case 'statistics':
        return (
          <div key="statistics" className="bg-gradient-to-r from-orange-50 to-blue-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <Statistics />
            </div>
          </div>
        );
      case 'upcomingDates':
        return (
          <div key="upcomingDates" className="bg-gradient-to-r from-orange-50 to-blue-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <UpcomingDates />
            </div>
          </div>
        );
      case 'services':
        return <Services key="services" />;
      case 'whyChooseUs':
        return <WhyChooseUs key="whyChooseUs" />;
      case 'featuredPuja':
        return <FeaturedPuja key="featuredPuja" />;
      case 'productsSection':
        return <ProductsSection key="productsSection" />;
      case 'testimonialSection':
        return <TestimonialSection key="testimonialSection" />;
      case 'panditSection':
        return <PanditSection key="panditSection" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <main className="overflow-hidden">
        <SEO
          title="PujaKaro - Your One-Stop Solution for Religious Needs"
          description="Book authentic pujas, purchase religious items, and connect with experienced pandits. PujaKaro offers traditional puja services, premium quality products, and spiritual guidance."
          canonicalUrl="https://pujakaro.com/"
          imageUrl="https://pujakaro.com/images/og-image.jpg"
          schema={combinedSchema}
          keywords={[
            "puja online booking", 
            "hindu rituals", 
            "religious ceremonies", 
            "pooja services", 
            "authentic pandits", 
            "religious items online", 
            "worship supplies", 
            "spiritual guidance",
            "satyanarayan puja",
            "griha pravesh puja",
            "ganesh puja"
          ]}
        />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fb9548]"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="overflow-hidden">
      <SEO
        title="PujaKaro - Your One-Stop Solution for Religious Needs"
        description="Book authentic pujas, purchase religious items, and connect with experienced pandits. PujaKaro offers traditional puja services, premium quality products, and spiritual guidance."
        canonicalUrl="https://pujakaro.com/"
        imageUrl="https://pujakaro.com/images/og-image.jpg"
        schema={combinedSchema}
        keywords={[
          "puja online booking", 
          "hindu rituals", 
          "religious ceremonies", 
          "pooja services", 
          "authentic pandits", 
          "religious items online", 
          "worship supplies", 
          "spiritual guidance",
          "satyanarayan puja",
          "griha pravesh puja",
          "ganesh puja"
        ]}
      />
      
      {/* Render sections based on layout configuration */}
      {homeLayout.sections
        .filter(section => section.enabled)
        .sort((a, b) => a.order - b.order)
        .map(section => renderSection(section.id))
      }
    </main>
  );
};

export default Home; 