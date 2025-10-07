import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faClock, faMoneyBillWave, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const CancellationAndRefund = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Cancellation and Refund Policy - Puja Services</title>
        <meta name="description" content="Learn about our cancellation and refund policies for Puja Services." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cancellation and Refund Policy</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <FontAwesomeIcon icon={faUndo} className="text-orange-500 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-4">Easy Cancellation</h2>
            </div>
            <p className="text-gray-600">
              Cancel your order up to 24 hours before the scheduled service time for a full refund.
              Late cancellations may be subject to charges.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-orange-500 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 ml-4">Quick Refunds</h2>
            </div>
            <p className="text-gray-600">
              Refunds are processed within 5-7 business days. The amount will be credited
              to your original payment method.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancellation Policy</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">Before 24 Hours</h3>
                <p className="text-gray-600 mt-2">
                  - Full refund
                  <br />
                  - No cancellation charges
                  <br />
                  - Instant cancellation processing
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-900">Within 24 Hours</h3>
                <p className="text-gray-600 mt-2">
                  - 50% refund
                  <br />
                  - Cancellation charges apply
                  <br />
                  - Subject to approval
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">After Service Begins</h3>
                <p className="text-gray-600 mt-2">
                  - No refund available
                  <br />
                  - Special cases considered
                  <br />
                  - Contact support
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Process</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="p-2 bg-orange-50 rounded-lg mr-4">
                  <span className="text-orange-500 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Request Submission</h3>
                  <p className="text-gray-600 mt-1">
                    Submit your cancellation request through your account or contact support.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-orange-50 rounded-lg mr-4">
                  <span className="text-orange-500 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Review</h3>
                  <p className="text-gray-600 mt-1">
                    Our team reviews your request within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-orange-50 rounded-lg mr-4">
                  <span className="text-orange-500 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Refund Initiation</h3>
                  <p className="text-gray-600 mt-1">
                    Once approved, refund is initiated to your original payment method.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 bg-orange-50 rounded-lg mr-4">
                  <span className="text-orange-500 font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Confirmation</h3>
                  <p className="text-gray-600 mt-1">
                    You'll receive a confirmation email with refund details.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Non-Refundable Items</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Customized puja items</li>
              <li>Used or damaged items</li>
              <li>Digital content already accessed</li>
              <li>Special order items</li>
            </ul>
          </section>

          <section className="bg-orange-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Notes</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <FontAwesomeIcon icon={faClock} className="text-orange-500 mt-1 mr-2" />
                <span>Refund processing time may vary based on your payment method and bank.</span>
              </li>
              <li className="flex items-start">
                <FontAwesomeIcon icon={faShieldAlt} className="text-orange-500 mt-1 mr-2" />
                <span>All refunds are subject to verification and our terms of service.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Support</h2>
            <p className="text-gray-600">
              For refund related queries, contact us at:
              <br />
              Email: info@pujakaro.in
              <br />
              Phone: +91 8800627513
              <br />
              (Monday to Saturday, 9 AM - 6 PM)
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CancellationAndRefund; 