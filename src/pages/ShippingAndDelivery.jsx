import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faClock, faMapMarkerAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const ShippingAndDelivery = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Shipping and Delivery - Puja Services</title>
        <meta name="description" content="Learn about our shipping and delivery policies for Prasad and Puja items." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping and Delivery</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <FontAwesomeIcon icon={faTruck} className="text-orange-500 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-4">Delivery Areas</h2>
            </div>
            <p className="text-gray-600">
              We currently deliver to all major cities in India. Delivery to remote areas
              may take additional time. Check your pin code for serviceability.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <FontAwesomeIcon icon={faClock} className="text-orange-500 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-4">Delivery Time</h2>
            </div>
            <p className="text-gray-600">
              Standard delivery: 3-5 business days
              <br />
              Express delivery: 1-2 business days (select areas)
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Methods</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">Standard Delivery</h3>
                <p className="text-gray-600 mt-2">
                  - Delivery within 3-5 business days
                  <br />
                  - Free shipping on orders above ₹999
                  <br />
                  - Regular updates via SMS and email
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">Express Delivery</h3>
                <p className="text-gray-600 mt-2">
                  - Delivery within 1-2 business days
                  <br />
                  - Available in select cities
                  <br />
                  - Additional charges apply
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Same Day Delivery</h3>
                <p className="text-gray-600 mt-2">
                  - Available only in select areas
                  <br />
                  - Order before 12 PM
                  <br />
                  - Premium charges apply
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tracking Your Order</h2>
            <p className="text-gray-600">
              Track your order through:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Your account dashboard</li>
              <li>SMS updates</li>
              <li>Email notifications</li>
              <li>Customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Partners</h2>
            <p className="text-gray-600">
              We work with trusted courier partners to ensure safe and timely delivery:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>BlueDart</li>
              <li>DTDC</li>
              <li>Delhivery</li>
              <li>FedEx</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Special Handling</h2>
            <p className="text-gray-600">
              Sacred items and prasad are handled with utmost care and respect:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Temperature-controlled packaging</li>
              <li>Special protective covering</li>
              <li>Handled by trained staff</li>
              <li>Quality checks at every step</li>
            </ul>
          </section>

          <section className="bg-orange-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Notes</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-500 mt-1 mr-2" />
                <span>Delivery times may vary based on your location and local conditions.</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faShieldAlt} className="text-orange-500 mt-1 mr-2" />
                <span>All items are insured during transit for your peace of mind.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Support</h2>
            <p className="text-gray-600">
              For shipping related queries, contact us at:
              <br />
              Email: shipping@pujaservices.com
              <br />
              Phone: +91 XXXXXXXXXX
              <br />
              (Monday to Saturday, 9 AM - 6 PM)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingAndDelivery; 