import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <SEO 
        title="Page Not Found | PujaKaro"
        description="The page you are looking for does not exist."
        canonicalUrl="https://pujakaro.com/404"
        noindex={true}
      />
      <div className="text-center max-w-md">
        <h1 className="text-orange-500 text-9xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Return to Home
          </Link>
          <Link to="/shop" className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 