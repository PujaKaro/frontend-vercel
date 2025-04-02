import { useEffect, useRef } from 'react';
import Glide from '@glidejs/glide';

const ProductsSection = () => {
  const glideRef = useRef(null);

  useEffect(() => {
    // Initialize Glide
    const glide = new Glide('.glide', {
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
    <section className="py-16 max-w-8xl mx-auto px-4 bg-[#ffeee7] relative">
      <div className="absolute inset-0 opacity-10"></div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Popular Products</h2>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-[#317bea] text-white font-medium rounded-button">All</button>
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
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-w-4 aspect-h-3">
                    <img 
                      src={product.image} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      alt={product.title} 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-custom">{product.price}</span>
                      <button className="px-4 py-2 bg-[#317bea] text-white rounded-button text-sm">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="glide__bullets mt-6 flex justify-center" data-glide-el="controls[nav]">
          {products.map((_, index) => (
            <button 
              key={index} 
              className="glide__bullet mx-1 w-3 h-3 rounded-full bg-gray-300 hover:bg-custom" 
              data-glide-dir={`=${index}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection; 