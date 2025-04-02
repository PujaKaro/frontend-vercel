import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';

const FeaturedPuja = () => {
  return (
    <section 
      className="py-16 bg-[#fb9548]" 
      style={{ backgroundImage: "url('/images/Section.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="max-w-8xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Featured Puja</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-cover bg-center"></div>
          <div className="grid md:grid-cols-2 relative">
            <div className="p-8">
              <span className="inline-block px-4 py-1 bg-custom/10 text-custom rounded-full text-sm font-medium mb-4 bg-[#ffeee7]">
                Special Offer
              </span>
              <h3 className="text-2xl font-bold mb-4">Satyanarayan Puja</h3>
              <p className="text-gray-600 mb-6">
                Experience the divine blessings of Lord Vishnu through this auspicious puja performed by our expert pandits.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-custom" />
                  <span>Next Available: Tomorrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-custom" />
                  <span>Duration: 2 hours</span>
                </div>
              </div>
              <Link 
                to="/puja-booking" 
                className="px-8 py-3 bg-[#317bea] text-white font-semibold rounded-button hover:bg-[#317bea]/90"
              >
                Book Now at ₹2,100
              </Link>
            </div>
            <div className="relative h-full min-h-[300px]">
              <img 
                src="/images/featuredPuja.jpg" 
                className="absolute inset-0 w-full h-full object-cover" 
                alt="Satyanarayan Puja"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPuja;
