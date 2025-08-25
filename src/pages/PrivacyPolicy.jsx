import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Privacy Policy - Puja Services</title>
        <meta
          name="description"
          content="Privacy Policy for Puja Services - Learn how we protect your privacy and handle your data."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-600">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Payment information</li>
              <li>Service preferences</li>
              <li>Communication history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Provide and improve our services</li>
              <li>Process your payments</li>
              <li>Communicate with you</li>
              <li>Send service updates</li>
              <li>Protect against fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-600">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Service providers</li>
              <li>Payment processors</li>
              <li>Legal authorities when required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-600">
              We may share limited information with trusted third-party providers such as Google
              Firebase, Google Analytics, and payment gateways (Razorpay, Paytm, Stripe) for
              analytics, authentication, and payment processing. These third parties are obligated
              to protect your data and use it only for the services they provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information.
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Children’s Privacy</h2>
            <p className="text-gray-600">
              Our services are not directed to children under the age of 13. If we discover that we
              have collected personal information from a child, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies & Tracking</h2>
            <p className="text-gray-600">
              We may use cookies and similar technologies for analytics and improving user
              experience. You can disable cookies in your device or browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600">You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 text-gray-600">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm mb-3">
                <strong>Want to delete your account?</strong> We've made it easy for you to request account deletion.
              </p>
              <a 
                href="/delete-account" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                🗑️ Delete My Account
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: pujakaro.in@gmail.com
              <br />
              Phone: +91 88006 27513
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. The updated version will be
              indicated by an updated "Last Updated" date and will be effective as soon as it is
              accessible.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-6">Last Updated: 25 August 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
