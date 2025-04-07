import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';

const PanditSection = () => {
  const glideRef = useRef(null);

  useEffect(() => {
    // Initialize Glide
    const glide = new Glide('.glide-pandits', {
      type: 'carousel',
      perView: 4,
      gap: 32,
      focusAt: 'center',
      bound: true,
      breakpoints: {
        1024: { perView: 3 },
        768: { perView: 2 },
        480: { perView: 1 }
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
      name: "Pandit Shiv Mishra",
      experience: "15+ years experience",
      image: "/images/rameshJi.jpg"
    },
    {
      name: "Pandit Gajendra Shastri",
      experience: "10+ years experience",
      image: "/images/rameshJi.jpg"
    },
    {
      name: "Pandit Awdhesh Tiwari",
      experience: "20+ years experience",
      image: "/images/rameshJi.jpg"
    },
    {
      name: "Pandit Hariom Pathak",
      experience: "8+ years experience",
      image: "/images/rameshJi.jpg"
    }
  ];

  return (
    <section 
      className="py-16 bg-[#fb9548] relative" 
      style={{ backgroundImage: "url('/images/Section.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Our Verified Pandits</h2>
        <div className="glide-pandits" ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {pandits.map((pandit, index) => (
                <li key={index} className="glide__slide">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[150px] flex flex-col">
                    {/* <div className="h-48 flex-shrink-0">
                      <img 
                        src={pandit.image} 
                        className="w-full h-full object-cover" 
                        alt={pandit.name} 
                      />
                    </div> */}
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold line-clamp-1">{pandit.name}</h3>
                        <span className="flex items-center gap-1 text-green-500">
                          <FontAwesomeIcon icon={faCheckCircle} />
                          <span className="text-sm">Verified</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pandit.experience}</p>
                      <Link 
                        to="/puja-booking" 
                        className="mt-auto w-full py-2 bg-[#317bea] text-white font-medium rounded-button hover:bg-[#317bea]/90 text-center block"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="glide__bullets" data-glide-el="controls[nav]">
            {pandits.map((_, index) => (
              <button 
                key={index} 
                className="glide__bullet" 
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
