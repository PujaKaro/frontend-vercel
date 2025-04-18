import React from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Join Our Team</h1>
          <p className="mt-2">Explore exciting career opportunities with us!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Current Openings</h2>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold">Software Engineer</h3>
          <p className="text-gray-700">We are looking for a passionate Software Engineer to join our team.</p>
          <Link to="/apply/software-engineer" className="text-orange-500 hover:underline">Apply Now</Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold">Product Manager</h3>
          <p className="text-gray-700">Join us as a Product Manager and help shape our product strategy.</p>
          <Link to="/apply/product-manager" className="text-orange-500 hover:underline">Apply Now</Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold">Marketing Specialist</h3>
          <p className="text-gray-700">We are seeking a creative Marketing Specialist to enhance our brand presence.</p>
          <Link to="/apply/marketing-specialist" className="text-orange-500 hover:underline">Apply Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Careers;