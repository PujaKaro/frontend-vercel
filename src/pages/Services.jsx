import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPray, 
  faGift, 
  faHandHoldingHeart,
  faShieldAlt,
  faClock,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Puja Booking',
      icon: faPray,
      description: 'Book traditional pujas performed by experienced priests',
      features: [
        'Wide range of pujas',
        'Experienced priests',
        'Flexible scheduling',
        'Online booking'
      ],
      link: '/puja-booking'
    },
    {
      id: 2,
      title: 'Flowers & Mala',
      icon: faGift,
      description: 'Fresh flowers and traditional malas for your pujas',
      features: [
        'Fresh flowers',
        'Traditional designs',
        'Custom arrangements',
        'Same day delivery'
      ],
      link: '/flowers-and-mala'
    },
    {
      id: 3,
      title: 'Prashad Services',
      icon: faHandHoldingHeart,
      description: 'Traditional prashad and offerings for your pujas',
      features: [
        'Authentic recipes',
        'Quality ingredients',
        'Custom packaging',
        'Timely delivery'
      ],
      link: '/prashad-services'
    }
  ];

  const features = [
    {
      icon: faShieldAlt,
      title: 'Trusted Service',
      description: 'Experienced priests and authentic rituals'
    },
    {
      icon: faClock,
      title: 'Timely Delivery',
      description: 'On-time delivery of all services and materials'
    },
    {
      icon: faCheckCircle,
      title: 'Quality Assured',
      description: 'High-quality materials and professional service'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-600 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Our Services
          </h1>
          <p className="text-lg sm:text-xl text-center max-w-3xl mx-auto">
            Discover our range of spiritual services designed to enhance your spiritual journey
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-orange-600 mb-4">
                <FontAwesomeIcon icon={service.icon} className="text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-orange-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to={service.link}
                className="inline-block bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-100 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-orange-600 mb-4">
                  <FontAwesomeIcon icon={feature.icon} className="text-4xl" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="bg-orange-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg mb-6">
            Book your puja today and experience the divine blessings
          </p>
          <Link
            to="/puja-booking"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services; 