import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Terms and Conditions - Puja Services</title>
        <meta name="description" content="Terms and Conditions for using Puja Services - Read our terms of service." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using our services, you accept and agree to be bound by these
              Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Description</h2>
            <p className="text-gray-600">
              We provide online puja services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Online puja booking</li>
              <li>Religious consultations</li>
              <li>Sacred items delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
            <p className="text-gray-600">
              Users must:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Provide accurate information</li>
              <li>Maintain account security</li>
              <li>Comply with payment terms</li>
              <li>Respect religious practices</li>
              <li>Follow service guidelines</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Terms</h2>
            <p className="text-gray-600">
              Payment terms include:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>All fees are in Indian Rupees</li>
              <li>Payment is required before service delivery</li>
              <li>We use secure payment processors</li>
              <li>Refunds are subject to our refund policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Modifications</h2>
            <p className="text-gray-600">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Modify or discontinue services</li>
              <li>Update pricing</li>
              <li>Change service providers</li>
              <li>Adjust delivery schedules</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600">
              We strive to provide the best service possible, but we cannot guarantee:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Specific outcomes from pujas</li>
              <li>Exact delivery times</li>
              <li>Availability of all services</li>
              <li>Third-party service quality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-600">
              All content on our platform is protected by copyright and other intellectual
              property rights. Users may not copy, reproduce, or distribute our content
              without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-600">
              These terms are governed by the laws of India. Any disputes shall be subject
              to the exclusive jurisdiction of the courts in Delhi NCR, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-600">
              For questions about these Terms and Conditions, please contact us at:
              <br />
              Email: info@pujakaro.in
              <br />
              Phone: +91 8800627513
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 