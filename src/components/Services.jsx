import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
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
  ];

  return (
    <section className="py-4 max-w-8xl mx-auto px-4 relative bg-[#ffeee7]">
      {/* Add pointer-events-none so this overlay doesn't block clicks */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"></div>
      <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-custom/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src={service.image} alt={service.title} className="w-full h-full object-contain rounded-full" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 mb-4">{service.description}</p>
            <Link 
              to={service.link} 
              className="inline-block px-4 py-2 bg-[#317bea] text-white font-medium rounded-button hover:bg-[#317bea]/90"
            >
              {service.buttonText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;