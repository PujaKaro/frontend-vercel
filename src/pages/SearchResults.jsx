import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPrayingHands, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { getAllProducts } from '../utils/dataUtils';
import { getAllPujas } from '../utils/dataUtils';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [pujas, setPujas] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredPujas, setFilteredPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsData, pujasData] = await Promise.all([
          getAllProducts(),
          getAllPujas()
        ]);
        setProducts(productsData);
        setPujas(pujasData);
      } catch (error) {
        console.error('Error loading search data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter results based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts([]);
      setFilteredPujas([]);
      return;
    }

    const term = query.toLowerCase().trim();

    // Filter products
    const filteredProds = products.filter(product => {
      const nameMatch = product.name?.toLowerCase().includes(term);
      const descMatch = product.description?.toLowerCase().includes(term);
      const categoryMatch = product.category?.toLowerCase().includes(term);
      const materialMatch = product.material?.toLowerCase().includes(term);
      return nameMatch || descMatch || categoryMatch || materialMatch;
    });

    // Filter pujas
    const filteredPujasList = pujas.filter(puja => {
      const nameMatch = puja.name?.toLowerCase().includes(term);
      const descMatch = puja.description?.toLowerCase().includes(term);
      const categoryMatch = puja.category?.toLowerCase().includes(term);
      const benefitsMatch = puja.benefits?.toLowerCase().includes(term);
      return nameMatch || descMatch || categoryMatch || benefitsMatch;
    });

    setFilteredProducts(filteredProds);
    setFilteredPujas(filteredPujasList);
  }, [query, products, pujas]);

  const totalResults = filteredProducts.length + filteredPujas.length;

  const renderProductCard = (product) => (
    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-1 aspect-h-1 w-full">
        <img
          src={product.image || '/images/placeholder.jpg'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-orange-600">₹{product.price?.toLocaleString()}</span>
          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="mt-3 w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  const renderPujaCard = (puja) => (
    <div key={puja.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-w-1 aspect-h-1 w-full">
        <img
          src={puja.image || '/images/placeholder.jpg'}
          alt={puja.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{puja.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{puja.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-orange-600">₹{puja.price?.toLocaleString()}</span>
          <span className="text-sm text-gray-500 capitalize">{puja.category}</span>
        </div>
        <Link
          to={`/puja-booking/${puja.id}`}
          className="mt-3 w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors text-center block"
        >
          Book Puja
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FontAwesomeIcon icon={faSearch} className="animate-spin text-4xl text-orange-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Loading search results...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({totalResults})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Products ({filteredProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('pujas')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pujas'
                ? 'bg-orange-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pujas ({filteredPujas.length})
          </button>
        </div>

        {/* Results */}
        {totalResults === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faSearch} className="text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any results for "{query}". Try different keywords or browse our categories.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/shop"
                className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
              >
                Browse Products
              </Link>
              <Link
                to="/puja-booking"
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
              >
                Browse Pujas
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTab === 'all' && (
              <>
                {filteredProducts.map(renderProductCard)}
                {filteredPujas.map(renderPujaCard)}
              </>
            )}
            {activeTab === 'products' && filteredProducts.map(renderProductCard)}
            {activeTab === 'pujas' && filteredPujas.map(renderPujaCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 