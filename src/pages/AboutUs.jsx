import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faHandshake, 
  faAward,
  faHeart,
  faPray,
  faStar
} from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  const features = [
    {
      icon: faUsers,
      title: "Expert Pandits",
      description: "Our team consists of highly qualified and experienced pandits who have been performing pujas for generations."
    },
    {
      icon: faHandshake,
      title: "Trusted Service",
      description: "We ensure every puja is performed with utmost sincerity and dedication, maintaining the highest standards of quality."
    },
    {
      icon: faAward,
      title: "Quality Assurance",
      description: "We use only the finest quality materials and follow traditional methods to ensure authentic puja experiences."
    },
    {
      icon: faHeart,
      title: "Customer First",
      description: "Your satisfaction is our priority. We go the extra mile to make your spiritual journey memorable."
    },
    {
      icon: faPray,
      title: "Spiritual Guidance",
      description: "Our pandits provide spiritual guidance and support throughout your puja journey."
    },
    {
      icon: faStar,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service, from booking to completion."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-[#FF8C00] text-white py-16">
        <div className="container mx-auto px-4">
<h1 className="text-4xl md:text-5xl font-bold text-center mb-6">About PujaKaro - Your Spiritual Partner</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Connecting devotees with authentic spiritual experiences through traditional pujas and rituals
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              At PujaKaro, we are dedicated to preserving and promoting India's rich spiritual heritage. 
              Our mission is to make authentic puja services accessible to everyone, ensuring that each 
              ritual is performed with the highest standards of authenticity and devotion.
            </p>
            <p className="text-lg text-gray-600">
              We believe in connecting people with their spiritual roots through traditional practices, 
              while embracing modern convenience to make these sacred rituals accessible to all.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-[#FF8C00] mb-4">
                  <FontAwesomeIcon icon={feature.icon} className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-600 mb-8">
              Our team consists of experienced pandits, spiritual guides, and customer service 
              professionals who work together to provide you with the best possible puja experience.
            </p>
            <p className="text-lg text-gray-600">
              Each member of our team brings years of experience and deep knowledge of traditional 
              practices, ensuring that every puja is performed with authenticity and devotion.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#FF8C00] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Authentic Pujas?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your puja today and embark on a spiritual journey with our expert pandits.
          </p>
          <a
            href="/puja-booking"
            className="inline-block bg-white text-[#FF8C00] px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
          >
            Book a Puja
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 