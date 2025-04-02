import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPray } from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  const services = [
    {
      icon: faPray,
      title: "Puja Booking",
      description: "Book authentic pujas performed by verified pandits",
      link: "/puja-booking"
    },
    {
      icon: faPray, // Using same icon as placeholder
      title: "Flowers & Mala",
      description: "Fresh flowers and garlands delivered to your doorstep",
      link: "/puja-booking"
    },
    {
      icon: faPray, // Using same icon as placeholder
      title: "Prashad Services",
      description: "Sacred offerings prepared with pure devotion",
      link: "/puja-booking"
    }
  ];

  return (
    <section className="py-4 max-w-8xl mx-auto px-4 relative bg-[#ffeee7]">
      <div className="absolute inset-0 opacity-10"></div>
      <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-custom/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={service.icon} className="text-2xl text-custom" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <a 
              href={service.link} 
              className="inline-block px-4 py-2 bg-[#317bea] text-white font-medium rounded-button hover:bg-[#317bea]/90"
            >
              Learn More
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services; 