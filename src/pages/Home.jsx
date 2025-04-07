import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import Services from '../components/Services';
import FeaturedPuja from '../components/FeaturedPuja';
import ProductsSection from '../components/ProductsSection';
import PanditSection from '../components/PanditSection';
import SEO from '../components/SEO';

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

  return (
    <main className="mt-2">
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
      <HeroSection />
      <Services />
      <FeaturedPuja />
      <ProductsSection />
      <PanditSection />
    </main>
  );
};

export default Home; 