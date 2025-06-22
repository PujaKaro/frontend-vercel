import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Devotees Say</h2>
            <div className="animate-pulse mx-auto h-4 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't render the section if no testimonials
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Devotees Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from people who have experienced the spiritual journey with us
          </p>
        </div>

        <div className="glide" ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {testimonials.map((testimonial) => (
                <li key={testimonial.id} className="glide__slide">
                  <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                    <div className="flex items-center mb-4">
                      {testimonial.userImage ? (
                        <img 
                          src={testimonial.userImage} 
                          alt={testimonial.userName} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-500 font-bold text-lg">
                            {testimonial.userName?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <h4 className="font-medium text-gray-900">{testimonial.userName || 'Anonymous'}</h4>
                        <div className="flex mt-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <FontAwesomeIcon icon={faQuoteLeft} className="text-orange-200 text-3xl mb-2" />
                      <p className="text-gray-600 italic">
                        {testimonial.message.length > 150 
                          ? `${testimonial.message.substring(0, 150)}...` 
                          : testimonial.message
                        }
                      </p>
                    </div>
                    
                    {testimonial.pujaName && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Service:</span> {testimonial.pujaName}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glide__bullets mt-8 flex justify-center" data-glide-el="controls[nav]">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                className="glide__bullet mx-1 w-3 h-3 rounded-full bg-gray-300 focus:outline-none"
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