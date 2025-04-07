import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faStar, faSearch, faHeart, faShoppingCart, faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { products } from '../data/data';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SEO from '../components/SEO';

const Shop = () => {
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
    // Set initial products from data file
    const productsWithWishlist = products.map(product => ({
      ...product,
      isWishlisted: false
    }));
    setProductList(productsWithWishlist);
    setFilteredProducts(productsWithWishlist);

    // Check for search query in URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(searchQuery);
      applyFilters(productsWithWishlist, { ...filters }, searchQuery);
    }
  }, [location.search]);

  const applyFilters = (products, currentFilters, search = searchTerm) => {
    let filtered = [...products];

    // Search filtering
    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filtering
    if (currentFilters.category !== 'all') {
      filtered = filtered.filter(product => product.category === currentFilters.category);
    }

    // Price filtering
    if (currentFilters.priceRange !== 'all') {
      switch (currentFilters.priceRange) {
        case 'under-500':
          filtered = filtered.filter(product => product.price < 500);
          break;
        case '500-1000':
          filtered = filtered.filter(product => product.price >= 500 && product.price <= 1000);
          break;
        case '1000-2000':
          filtered = filtered.filter(product => product.price > 1000 && product.price <= 2000);
          break;
        case 'above-2000':
          filtered = filtered.filter(product => product.price > 2000);
          break;
        default:
          break;
      }
    }

    // Sorting
    switch (currentFilters.sortBy) {
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    setFilteredProducts(filtered);
  };

  const toggleWishlist = (id) => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    const updatedProducts = productList.map(product =>
      product.id === id ? { ...product, isWishlisted: !product.isWishlisted } : product
    );
    setProductList(updatedProducts);
    applyFilters(updatedProducts, filters);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    applyFilters(productList, newFilters);
  };

  const addToCart = (event, product) => {
    event.preventDefault(); // Prevent navigation to product detail
    event.stopPropagation(); // Stop event propagation
    
    // Get existing cart from localStorage or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingProductIndex = existingCart.findIndex(item => 
      item.id === product.id && item.type === 'product'
    );
    
    if (existingProductIndex >= 0) {
      // Increment quantity if product already exists
      existingCart[existingProductIndex].quantity += 1;
    } else {
      // Add new product to cart
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        type: 'product'
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show success message
    toast.success(`${product.name} added to cart successfully!`);
    
    // Force a refresh on header component by updating sessionStorage
    sessionStorage.setItem('cartUpdated', Date.now().toString());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
    applyFilters(productList, filters, searchTerm);
  };

  // Create structured data for Shop page
  const createStructuredData = () => {
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "image": product.image.startsWith('/') ? `https://pujakaro.com${product.image}` : product.image,
          "description": product.description.substring(0, 150),
          "url": `https://pujakaro.com/product/${product.id}`,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "INR",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        }
      }))
    };

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://pujakaro.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Shop",
          "item": "https://pujakaro.com/shop"
        }
      ]
    };

    return [itemList, breadcrumb];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEO
        title="Shop Religious Products Online - PujaKaro"
        description="Browse and buy authentic religious products online. Wide selection of puja items, idols, and more for your spiritual needs."
        canonicalUrl="https://pujakaro.com/shop"
        schema={createStructuredData()}
        keywords={["religious products", "puja items", "idols", "spiritual products", "online religious store"]}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header */}
        <header className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Shop</h1>
          <form onSubmit={handleSearch} className="relative mb-4">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </header>
        
        {/* Desktop Header */}
        <div className="hidden md:flex md:justify-between md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
          <form onSubmit={handleSearch} className="w-1/3 relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden sticky top-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Toggle Filters"
                >
                  <FontAwesomeIcon icon={faFilter} size="lg" />
                </button>
              </div>
              <div className={`${showFilters ? 'block' : 'hidden'} lg:block p-4`}>
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'all', label: 'All Products', value: 'all' },
                      { id: 'puja-items', label: 'Puja Items', value: 'puja-items' },
                      { id: 'idols', label: 'Idols', value: 'idols' },
                      { id: 'books', label: 'Books', value: 'books' }
                    ].map(({ id, label, value }) => (
                      <div key={id} className="flex items-center">
                        <input
                          id={id}
                          type="radio"
                          name="category"
                          checked={filters.category === value}
                          onChange={() => handleFilterChange('category', value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor={id} className="ml-2 text-gray-700">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'all-prices', label: 'All Prices', value: 'all' },
                      { id: 'under-500', label: 'Under ₹500', value: 'under-500' },
                      { id: '500-1000', label: '₹500 - ₹1,000', value: '500-1000' },
                      { id: '1000-2000', label: '₹1,000 - ₹2,000', value: '1000-2000' },
                      { id: 'above-2000', label: 'Above ₹2,000', value: 'above-2000' }
                    ].map(({ id, label, value }) => (
                      <div key={id} className="flex items-center">
                        <input
                          id={id}
                          type="radio"
                          name="price"
                          checked={filters.priceRange === value}
                          onChange={() => handleFilterChange('priceRange', value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label htmlFor={id} className="ml-2 text-gray-700">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Sort Options */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Sort By</h3>
                  <select
                    id="sort"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.id}`}
                    className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow hover:bg-gray-100 transition-colors"
                        aria-label="Toggle Wishlist"
                      >
                        <FontAwesomeIcon 
                          icon={product.isWishlisted ? faHeart : farHeart} 
                          className={product.isWishlisted ? 'text-red-500' : 'text-gray-400'}
                        />
                      </button>
                      {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                      {product.stock <= 5 && (
                        <div className="absolute bottom-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                          Only {product.stock} left
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faStar} className="text-yellow-400 h-4 w-4" />
                          <span className="ml-1 text-sm text-gray-700">{product.rating}</span>
                        </div>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-sm text-gray-500">{product.reviews} reviews</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{product.price.toLocaleString()}
                          {product.discount > 0 && (
                            <span className="ml-2 text-xs text-gray-500 line-through">
                              ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => addToCart(e, product)}
                          className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                          <FontAwesomeIcon icon={faShoppingCart} />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-xl font-medium text-gray-500 mb-3">No products found</p>
                <p className="text-gray-500">
                  Try adjusting your filters or search term to find what you're looking for.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;