import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import FeaturedPuja from '../components/FeaturedPuja';
import ProductsSection from '../components/ProductsSection';
import PanditSection from '../components/PanditSection';
import TestimonialSection from '../components/TestimonialSection';
import SEO from '../components/SEO';
import PromotionalBanner from '../components/PromotionalBanner';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
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
      
      {/* Hero Section with promotional banner underneath */}
      <div className="relative">
        <HeroSection />
        <div className="relative z-10 -mt-6">
          <PromotionalBanner />
        </div>
      </div>
      
      {/* Main sections with proper spacing */}
      <div className="space-y-4">

         {/* Services Section */}
         <Services />

        {/* Why Choose Us Section */}
        <WhyChooseUs />
        
        {/* Featured Puja Section */}
        <FeaturedPuja />
        
        {/* Products Section */}
        <ProductsSection />
        
        {/* Testimonial Section */}
        <TestimonialSection />
        
        {/* Pandit Section */}
        <PanditSection />
      </div>
    </main>
  );
};

export default Home; 