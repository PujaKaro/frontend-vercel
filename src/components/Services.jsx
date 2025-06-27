import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Services = () => {
  const [servicesContent, setServicesContent] = useState({
    heading: "Our Services",
    subheading: "Experience the divine through our comprehensive spiritual services",
    services: [
      {
        image: "images/puja_booking.svg",
        title: "Puja Booking",
        description: "Book authentic pujas performed by verified pandits",
        link: "/puja-booking",
        buttonText: "Book Now"
      },
      {
        image: "images/flower.svg",
        title: "Flowers & Mala",
        description: "Fresh flowers and garlands delivered to your doorstep",
        link: "/flowers-and-mala",
        buttonText: "Subscribe Now"
      },
      {
        image: "images/prashad.svg",
        title: "Prashad Services",
        description: "Sacred Prasad offerings prepared with pure devotion",
        link: "/prashad-services",
        buttonText: "Subscribe Now"
      }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicesContent = async () => {
      try {
        setLoading(true);
        const servicesDoc = await getDoc(doc(db, 'siteContent', 'services'));
        if (servicesDoc.exists()) {
          setServicesContent(servicesDoc.data());
        }
      } catch (error) {
        console.error('Error fetching services content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesContent();
  }, []);

  if (loading) {
    return (
      <section className="py-8 max-w-7xl mx-auto px-2 relative">
        <div className="text-center mb-6">
          <div className="animate-pulse h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
          <div className="animate-pulse h-4 bg-gray-300 rounded w-96 mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 max-w-7xl mx-auto px-2 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#ffeee7] to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#ffeee7] to-transparent"></div>
        <img src="/images/ornamental-border.svg" className="absolute top-8 left-8 w-16 h-16 opacity-30" alt="" />
        <img src="/images/ornamental-border.svg" className="absolute bottom-8 right-8 w-16 h-16 opacity-30 transform rotate-180" alt="" />
      </div>
      
      <div className="text-center mb-6 relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-[#8B0000]">{servicesContent.heading.split(' ')[0]}</span> <span className="text-[#fb9548]">{servicesContent.heading.split(' ').slice(1).join(' ')}</span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#fb9548] to-[#317bea] mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{servicesContent.subheading}</p>
      </div>
      
      <div className="relative p-8 rounded-lg"
      style={{
        backgroundImage: "url('/images/Section.png')", 
        backgroundSize: "cover", 
        backgroundPosition: "center",
        opacity: 0.85
      }}> 
      <div className="grid md:grid-cols-3 gap-8">
        {servicesContent.services.map((service, index) => (
          <div 
            key={index} 
            className="bg-white p-5 rounded-lg shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="w-10 h-10 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-[#ffeee7] rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src={service.image} alt={service.title} className="w-12 h-12 object-contain" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-1 text-[#8B0000] group-hover:text-[#fb9548] transition-colors duration-300">{service.title}</h3>
            <p className="text-gray-600 mb-6">{service.description}</p>
            
            <Link 
              to={service.link} 
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-[#317bea] to-[#317bea]/80 text-white font-medium rounded-full hover:shadow-md transition-all duration-300 group-hover:bg-[#fb9548]"
            >
              {service.buttonText}
            </Link>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default Services;