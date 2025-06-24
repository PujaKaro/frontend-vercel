import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const glideRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Query to get approved testimonials, ordered by rating
        const testimonialsQuery = query(
          collection(db, 'testimonials'),
          where('status', '==', 'approved'),
          orderBy('rating', 'desc'),
          limit(8)
        );

        const snapshot = await getDocs(testimonialsQuery);

        if (snapshot.empty) {
          console.log('No testimonials found');
          setLoading(false);
          return;
        }

        const testimonialsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setTestimonials(testimonialsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    // Initialize Glide carousel after testimonials are loaded
    if (!loading && testimonials.length > 0 && glideRef.current) {
      const glideCarousel = new Glide(glideRef.current, {
        type: 'carousel',
        perView: 3,
        gap: 30,
        autoplay: 5000,
        animationDuration: 1000,
        peek: { before: 50, after: 50 },
        breakpoints: {
          1024: {
            perView: 2
          },
          768: {
            perView: 1,
            peek: { before: 0, after: 0 }
          }
        }
      });

      glideCarousel.mount();

      return () => {
        glideCarousel.destroy();
      };
    }
  }, [loading, testimonials]);

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={i}
          icon={faStar} 
          className={i <= rating ? "text-yellow-400" : "text-gray-300"} 
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-[#ffeee7]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Devotees Say</h2>
            <div className="animate-pulse mx-auto h-4 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#fb9548]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't render the section if no testimonials
  }

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white to-[#ffeee7]/30">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#fb9548]/5 rounded-full blur-xl"></div>
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#317bea]/5 rounded-full blur-xl"></div>
      <img src="/images/ornamental-border.svg" className="absolute top-12 right-12 w-24 h-24 opacity-10 rotate-90" alt="" />
      <img src="/images/ornamental-border.svg" className="absolute bottom-12 left-12 w-24 h-24 opacity-10 -rotate-90" alt="" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#8B0000]">What Our Devotees Say</h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#fb9548] to-[#317bea] mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
            Hear from people who have experienced the divine journey with us
          </p>
        </div>

        <div className="glide testimonial-slider" ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {testimonials.map((testimonial) => (
                <li key={testimonial.id} className="glide__slide h-auto">
                  <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col border border-gray-100 hover:shadow-xl transition-shadow relative group transform transition-transform hover:-translate-y-1">
                    {/* Quote decoration */}
                    <FontAwesomeIcon 
                      icon={faQuoteLeft} 
                      className="absolute top-6 left-6 text-[#fb9548]/10 text-5xl group-hover:text-[#fb9548]/20 transition-colors"
                    />
                    <FontAwesomeIcon 
                      icon={faQuoteRight} 
                      className="absolute bottom-6 right-6 text-[#fb9548]/10 text-5xl group-hover:text-[#fb9548]/20 transition-colors"
                    />
                    
                    {/* Avatar and user info */}
                    <div className="flex items-center mb-6 relative z-10">
                      {testimonial.userImage ? (
                        <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-br from-[#fb9548] to-[#317bea]">
                          <img 
                            src={testimonial.userImage} 
                            alt={testimonial.userName} 
                            className="w-full h-full rounded-full object-cover border-2 border-white"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#fb9548] to-[#317bea] flex items-center justify-center">
                          <span className="text-white font-bold text-xl">
                            {testimonial.userName?.charAt(0)?.toUpperCase() || 'D'}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <h4 className="font-semibold text-lg text-[#8B0000]">{testimonial.userName || 'Anonymous Devotee'}</h4>
                        <div className="flex mt-1 gap-0.5">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Testimonial content */}
                    <div className="flex-grow relative z-10">
                      <p className="text-gray-600 leading-relaxed">
                        {testimonial.message.length > 150 
                          ? `${testimonial.message.substring(0, 150)}...` 
                          : testimonial.message
                        }
                      </p>
                    </div>
                    
                    {/* Service info */}
                    {testimonial.pujaName && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <p className="text-sm">
                          <span className="font-medium text-[#317bea]">Service:</span> 
                          <span className="text-gray-700"> {testimonial.pujaName}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Custom navigation arrows */}
          <div className="glide__arrows flex justify-center md:justify-between mt-8 md:absolute md:top-1/2 md:left-0 md:right-0 md:-translate-y-1/2 md:mt-0 md:px-2" data-glide-el="controls">
            <button 
              className="glide__arrow glide__arrow--left p-3 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors focus:outline-none group"
              data-glide-dir="<"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8B0000] group-hover:text-[#fb9548] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="glide__arrow glide__arrow--right p-3 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors focus:outline-none group ml-4 md:ml-0"
              data-glide-dir=">"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#8B0000] group-hover:text-[#fb9548] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Customized bullets */}
          <div className="glide__bullets mt-8 flex justify-center gap-2" data-glide-el="controls[nav]">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-[#fb9548] focus:outline-none transition-colors glide__bullet"
                data-glide-dir={`=${index}`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection; 