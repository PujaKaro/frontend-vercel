import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';

const ProductsSection = () => {
  const glideRef = useRef(null);

  useEffect(() => {
    // Initialize Glide
    const glide = new Glide('.glide', {
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

  const products = [
    {
      image: "/images/pujaThali.jpg",
      title: "Premium Brass Puja Thali Set",
      price: "₹1,299"
    },
    {
      image: "/images/ganesh.jpg",
      title: "Ganesha Idol (Gold Plated)",
      price: "₹2,499"
    },
    {
      image: "/images/pujaThali.jpg",
      title: "Wooden Prayer Stand",
      price: "₹799"
    },
    {
      image: "/images/ganesh.jpg",
      title: "Complete Puja Accessories Kit",
      price: "₹3,999"
    },
    {
      image: "/images/pujaThali.jpg",
      title: "Silver Plated Diya Set",
      price: "₹1,499"
    }
  ];

  return (
    <section className="py-16 bg-[#ffeee7] relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-3xl font-bold mb-4 md:mb-0 text-center md:text-left">
            Popular Products
          </h2>
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            <button className="px-6 py-2 bg-[#317bea] text-white font-medium rounded-button">
              All
            </button>
            <button className="px-6 py-2 bg-gray-100 text-gray-600 font-medium rounded-button hover:bg-custom/10 hover:text-custom">
              Puja Items
            </button>
            <button className="px-6 py-2 bg-gray-100 text-gray-600 font-medium rounded-button hover:bg-custom/10 hover:text-custom">
              Idols
            </button>
            <button className="px-6 py-2 bg-gray-100 text-gray-600 font-medium rounded-button hover:bg-custom/10 hover:text-custom">
              Books
            </button>
          </div>
        </div>
        
        <div className="glide" ref={glideRef}>
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {products.map((product, index) => (
                <li key={index} className="glide__slide">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[300px] flex flex-col">
                    <div className="h-48 flex-shrink-0">
                      <img 
                        src={product.image} 
                        className="w-full h-full object-cover" 
                        alt={product.title} 
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-lg font-bold text-custom">{product.price}</span>
                        <Link 
                          to="/shop" 
                          className="px-4 py-2 bg-[#317bea] text-white rounded-button text-sm"
                        >
                          Add to Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* <div className="glide__bullets" data-glide-el="controls[nav]">
            {products.map((_, index) => (
              <button 
                key={index} 
                className="glide__bullet" 
                data-glide-dir={`=${index}`}
              ></button>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
