import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';

const ProductsSection = () => {
  const glideRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProducts(productsData);
      setFilteredProducts(productsData);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(productsData.map(product => product.category))];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to static data if database fails
      setProducts([
        {
          id: '1',
          image: "/images/pujaThali.jpg",
          title: "Premium Brass Puja Thali Set",
          price: "₹1,299",
          category: "puja-items"
        },
        {
          id: '2',
          image: "/images/ganesh.jpg",
          title: "Ganesha Idol (Gold Plated)",
          price: "₹2,499",
          category: "idols"
        },
        {
          id: '3',
          image: "/images/pujaThali.jpg",
          title: "Wooden Prayer Stand",
          price: "₹799",
          category: "puja-items"
        },
        {
          id: '4',
          image: "/images/ganesh.jpg",
          title: "Complete Puja Accessories Kit",
          price: "₹3,999",
          category: "puja-items"
        },
        {
          id: '5',
          image: "/images/pujaThali.jpg",
          title: "Silver Plated Diya Set",
          price: "₹1,499",
          category: "puja-items"
        }
      ]);
      setFilteredProducts([
        {
          id: '1',
          image: "/images/pujaThali.jpg",
          title: "Premium Brass Puja Thali Set",
          price: "₹1,299",
          category: "puja-items"
        },
        {
          id: '2',
          image: "/images/ganesh.jpg",
          title: "Ganesha Idol (Gold Plated)",
          price: "₹2,499",
          category: "idols"
        },
        {
          id: '3',
          image: "/images/pujaThali.jpg",
          title: "Wooden Prayer Stand",
          price: "₹799",
          category: "puja-items"
        },
        {
          id: '4',
          image: "/images/ganesh.jpg",
          title: "Complete Puja Accessories Kit",
          price: "₹3,999",
          category: "puja-items"
        },
        {
          id: '5',
          image: "/images/pujaThali.jpg",
          title: "Silver Plated Diya Set",
          price: "₹1,499",
          category: "puja-items"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category
  const filterProducts = (category) => {
    setActiveFilter(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === category);
      setFilteredProducts(filtered);
    }
  };

  // Get category display name
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'puja-items': 'Puja Items',
      'idols': 'Idols',
      'books': 'Books',
      'incense': 'Incense',
      'clothing': 'Clothing'
    };
    return categoryMap[category] || category;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (filteredProducts.length > 0) {
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
    }
  }, [filteredProducts]);

  if (loading) {
    return (
      <section className="py-16 bg-[#ffeee7] relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-3xl font-bold mb-4 md:mb-0 text-center md:text-left">
              Popular Products
            </h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#ffeee7] relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-3xl font-bold mb-4 md:mb-0 text-center md:text-left">
            Popular Products
          </h2>
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            <button 
              onClick={() => filterProducts('all')}
              className={`px-6 py-2 font-medium rounded-button transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-[#317bea] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-custom/10 hover:text-custom'
              }`}
            >
              All
            </button>
            {categories.slice(0, 5).map((category) => (
              <button 
                key={category}
                onClick={() => filterProducts(category)}
                className={`px-6 py-2 font-medium rounded-button transition-colors ${
                  activeFilter === category 
                    ? 'bg-[#317bea] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-custom/10 hover:text-custom'
                }`}
              >
                {getCategoryDisplayName(category)}
              </button>
            ))}
          </div>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="glide" ref={glideRef}>
            <div className="glide__track" data-glide-el="track">
              <ul className="glide__slides">
                {filteredProducts.map((product) => (
                  <li key={product.id} className="glide__slide">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[300px] flex flex-col relative">
                      {/* Out of Stock Badge */}
                      {product.stock === 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Out of Stock</span>
                      )}
                      <div className="h-40 flex-shrink-0 flex items-center justify-center bg-gray-50">
                        <img 
                          src={product.image} 
                          className="w-auto h-full max-h-36 object-contain" 
                          alt={product.name || product.title} 
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                            {product.category}
                          </span>
                          {product.rating && (
                            <span className="text-xs text-yellow-600 font-semibold flex items-center">
                              <svg className="w-4 h-4 mr-1 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                              {product.rating}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold mb-1 line-clamp-1 text-base">{product.name || product.title}</h3>
                        {product.material && (
                          <div className="text-xs text-gray-500 mb-1">Material: {product.material}</div>
                        )}
                        {/* <div className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</div> */}
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-custom">₹{product.price}</span>
                            {product.discount > 0 && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">{product.discount}% OFF</span>
                            )}
                          </div>
                          <Link 
                            to={`/product/${product.id}`}
                            className="px-4 py-2 bg-[#317bea] text-white rounded-button text-sm hover:bg-[#2563eb] transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No products found in this category
            </div>
            <button 
              onClick={() => filterProducts('all')}
              className="px-6 py-2 bg-[#317bea] text-white rounded-button hover:bg-[#2563eb] transition-colors"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
