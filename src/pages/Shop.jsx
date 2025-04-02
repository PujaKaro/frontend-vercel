import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faStar, faSearch, faArrowUp, faArrowDown, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const Shop = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Premium Brass Puja Thali Set',
      price: 1299,
      rating: 4.5,
      reviews: 123,
      category: 'puja-items',
      image: '/images/pujaThali.jpg',
      isWishlisted: false
    },
    {
      id: 2,
      name: 'Lord Ganesha Idol (Gold Plated)',
      price: 2499,
      rating: 4.8,
      reviews: 89,
      category: 'idols',
      image: '/images/ganesh.jpg',
      isWishlisted: false
    },
    {
      id: 3,
      name: 'Wooden Prayer Stand',
      price: 799,
      rating: 4.0,
      reviews: 45,
      category: 'puja-items',
      image: '/images/pujaThali.jpg',
      isWishlisted: false
    },
    {
      id: 4,
      name: 'Complete Puja Accessories Kit',
      price: 3999,
      rating: 4.6,
      reviews: 67,
      category: 'puja-items',
      image: '/images/ganesh.jpg',
      isWishlisted: false
    },
    {
      id: 5,
      name: 'Silver Plated Diya Set',
      price: 1499,
      rating: 4.2,
      reviews: 38,
      category: 'puja-items',
      image: '/images/pujaThali.jpg',
      isWishlisted: false
    },
    {
      id: 6,
      name: 'Lord Krishna Idol',
      price: 1899,
      rating: 4.7,
      reviews: 74,
      category: 'idols',
      image: '/images/ganesh.jpg',
      isWishlisted: false
    },
    {
      id: 7,
      name: 'Bhagavad Gita (Hardcover)',
      price: 499,
      rating: 4.9,
      reviews: 112,
      category: 'books',
      image: '/images/pujaThali.jpg',
      isWishlisted: false
    },
    {
      id: 8,
      name: 'Incense Sticks (Premium Pack of 100)',
      price: 299,
      rating: 4.1,
      reviews: 92,
      category: 'puja-items',
      image: '/images/ganesh.jpg',
      isWishlisted: false
    }
  ]);
  
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    sortBy: 'popularity'
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Check if there's a search query in the URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);
  
  const filterProducts = () => {
    let filteredProducts = [...products];
    
    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === filters.category
      );
    }
    
    // Filter by price range
    if (filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under-500':
          filteredProducts = filteredProducts.filter(product => product.price < 500);
          break;
        case '500-1000':
          filteredProducts = filteredProducts.filter(product => product.price >= 500 && product.price <= 1000);
          break;
        case '1000-2000':
          filteredProducts = filteredProducts.filter(product => product.price > 1000 && product.price <= 2000);
          break;
        case 'above-2000':
          filteredProducts = filteredProducts.filter(product => product.price > 2000);
          break;
        default:
          break;
      }
    }
    
    // Sort products
    switch (filters.sortBy) {
      case 'price-low-high':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        filteredProducts.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    
    return filteredProducts;
  };
  
  const toggleWishlist = (id) => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id 
          ? { ...product, isWishlisted: !product.isWishlisted } 
          : product
      )
    );
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const filteredProducts = filterProducts();
  
  const addToCart = (product) => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    // In a real app, you would handle adding to cart here
    alert(`${product.name} added to cart!`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with search term
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Shop</h1>
        
        <div className="flex flex-col lg:flex-row mb-8">
          <div className="w-full lg:w-64 flex-shrink-0 mb-6 lg:mb-0 lg:mr-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faFilter} />
                </button>
              </div>
              
              <div className={`p-4 lg:block ${showFilters ? 'block' : 'hidden'}`}>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="all"
                        name="category"
                        type="radio"
                        checked={filters.category === 'all'}
                        onChange={() => handleFilterChange('category', 'all')}
                        className="h-4 w-4 text-custom focus:ring-custom border-gray-300"
                      />
                      <label htmlFor="all" className="ml-2 text-gray-700">All Products</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="puja-items"
                        name="category"
                        type="radio"
                        checked={filters.category === 'puja-items'}
                        onChange={() => handleFilterChange('category', 'puja-items')}
                        className="h-4 w-4 text-custom focus:ring-custom border-gray-300"
                      />
                      <label htmlFor="puja-items" className="ml-2 text-gray-700">Puja Items</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="idols"
                        name="category"
                        type="radio"
                        checked={filters.category === 'idols'}
                        onChange={() => handleFilterChange('category', 'idols')}
                        className="h-4 w-4 text-custom focus:ring-custom border-gray-300"
                      />
                      <label htmlFor="idols" className="ml-2 text-gray-700">Idols</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="books"
                        name="category"
                        type="radio"
                        checked={filters.category === 'books'}
                        onChange={() => handleFilterChange('category', 'books')}
                        className="h-4 w-4 text-custom focus:ring-custom border-gray-300"
                      />
                      <label htmlFor="books" className="ml-2 text-gray-700">Books</label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="all-prices"
                        name="price"
                        type="radio"
                        checked={filters.priceRange === 'all'}
                        onChange={() => handleFilterChange('priceRange', 'all')}
                        className="h-4 w-4 text-custom focus:ring-custom border-gray-300"
                      />
                      <label htmlFor="all-prices" className="ml-2 text-gray-700">All Prices</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="under-500"
                        name="price"
                        type="radio"
                        checked={filters.priceRange === 'under-500'}
                        onChange={() => handleFilterChange('priceRange', 'under-500')}
                        className="h-4 w-4 text-custom focus:ring-custom border-gray-300"
                      />
                      <label htmlFor="under-500" className="ml-2 text-gray-700">Under ₹500</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="500-1000"
                        name="price"
                        type="radio"
                        checked={filters.priceRange === '500-1000'}
                        onChange={() => handleFilterChange('priceRange', '500-1000')}
                        className="h-4 w-4 text-custom focus:ring-custom border-gray-300"
                      />
                      <label htmlFor="500-1000" className="ml-2 text-gray-700">₹500 - ₹1,000</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="1000-2000"
                        name="price"
                        type="radio"
                        checked={filters.priceRange === '1000-2000'}
                        onChange={() => handleFilterChange('priceRange', '1000-2000')}
                        className="h-4 w-4 text-custom focus:ring-custom border-gray-300"
                      />
                      <label htmlFor="1000-2000" className="ml-2 text-gray-700">₹1,000 - ₹2,000</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="above-2000"
                        name="price"
                        type="radio"
                        checked={filters.priceRange === 'above-2000'}
                        onChange={() => handleFilterChange('priceRange', 'above-2000')}
                        className="h-4 w-4 text-custom focus:ring-custom border-gray-300"
                      />
                      <label htmlFor="above-2000" className="ml-2 text-gray-700">Above ₹2,000</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between">
                <form onSubmit={handleSearch} className="relative mb-4 md:mb-0 md:w-64">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                  />
                  <button type="submit" className="absolute left-0 top-0 mt-2 ml-3 text-gray-400">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </form>
                
                <div className="flex items-center">
                  <label htmlFor="sort" className="text-sm text-gray-700 mr-2">Sort by:</label>
                  <select
                    id="sort"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="border border-gray-300 rounded-md text-gray-700 py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-[#317bea] focus:border-[#317bea]"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-48 object-cover"
                        />
                        <button 
                          onClick={() => toggleWishlist(product.id)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-100"
                        >
                          <FontAwesomeIcon 
                            icon={product.isWishlisted ? faHeart : farHeart} 
                            className={product.isWishlisted ? 'text-red-500' : 'text-gray-400'}
                          />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <FontAwesomeIcon 
                                key={index}
                                icon={faStar} 
                                className={`${
                                  index < Math.floor(product.rating) 
                                    ? 'text-yellow-400' 
                                    : index < product.rating 
                                      ? 'text-yellow-400' 
                                      : 'text-gray-300'
                                } h-4 w-4`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                          <button
                            onClick={() => addToCart(product)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#317bea] hover:bg-[#317bea]/90 focus:outline-none"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop; 