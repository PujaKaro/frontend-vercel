import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Glide from '@glidejs/glide';

const PanditSection = () => {
  const glideRef = useRef(null);

  useEffect(() => {
    // Initialize Glide
    const glide = new Glide('.glide-pandits', {
      type: 'carousel',
      perView: 4,
      gap: 32,
      breakpoints: {
        1024: {
          perView: 3
        },
        768: {
          perView: 2
        },
        480: {
          perView: 1
        }
      }
    });

    glide.mount();

    // Cleanup function
    return () => {
      glide.destroy();
    };
  }, []);

  const pandits = [
    {
      name: "Pandit Ramesh Sharma",
      experience: "15+ years experience",
      image: "/images/rameshJi.jpg"
    },
    {
      name: "Pandit Suresh Verma",
      experience: "10+ years experience",
      image: "/images/rameshJi.jpg"
    },
    {
      name: "Pandit Mahesh Gupta",
      experience: "20+ years experience",
      image: "/images/rameshJi.jpg"
    },
    {
      name: "Pandit Rajesh Kumar",
      experience: "8+ years experience",
      image: "/images/rameshJi.jpg"
    }
  ];

  return (
    <section 
      className="py-16 bg-[#fb9548] relative" 
      style={{ backgroundImage: "url('/images/Section.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 opacity-10"></div>
      <div className="max-w-8xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Our Verified Pandits</h2>
        <div className="glide-pandits" ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {pandits.map((pandit, index) => (
                <li key={index} className="glide__slide">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="relative aspect-w-1 aspect-h-1">
                      <img 
                        src={pandit.image} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        alt={pandit.name} 
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{pandit.name}</h3>
                        <span className="flex items-center gap-1 text-green-500">
                          <FontAwesomeIcon icon={faCheckCircle} />
                          <span className="text-sm">Verified</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{pandit.experience}</p>
                      <button className="w-full py-2 bg-[#317bea] text-white font-medium rounded-button hover:bg-[#317bea]/90">
                        Book Now
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="glide__bullets mt-6 flex justify-center" data-glide-el="controls[nav]">
            {pandits.map((_, index) => (
              <button 
                key={index} 
                className="glide__bullet mx-1 w-3 h-3 rounded-full bg-gray-300 hover:bg-custom" 
                data-glide-dir={`=${index}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PanditSection; 