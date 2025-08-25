import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const DeleteAccount = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    reason: '',
    confirmDelete: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call)
    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        email: '',
        phone: '',
        reason: '',
        confirmDelete: false
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.email && formData.phone && formData.confirmDelete;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Helmet>
        <title>Delete Account - PujaKaro</title>
        <meta
          name="description"
          content="Request account deletion from PujaKaro - Complete account removal process"
        />
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Delete Your Account</h1>
          <p className="text-lg text-gray-600">
            We're sorry to see you go. Please read the information below before proceeding.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Important Information */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <h2 className="font-semibold text-red-900 mb-2">⚠️ Important Information</h2>
            <p className="text-red-800 text-sm">
              Account deletion is permanent and cannot be undone. All your data, including booking history, 
              preferences, and account information will be permanently removed.
            </p>
          </div>

          {/* What Happens When You Delete */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happens When You Delete Your Account?</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 text-green-700">Data That Will Be Deleted:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Personal profile information</li>
                  <li>• Account credentials</li>
                  <li>• Booking history</li>
                  <li>• Service preferences</li>
                  <li>• Communication history</li>
                  <li>• User reviews and content</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 text-orange-700">Data That May Be Retained:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Financial records (7 years for tax compliance)</li>
                  <li>• Transaction records (payment processor requirements)</li>
                  <li>• Anonymized analytics data</li>
                  <li>• Fraud prevention information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Deletion Request Form */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Account Deletion</h2>
            
            {submitStatus === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-green-600 text-5xl mb-4">✓</div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Request Submitted Successfully!</h3>
                <p className="text-green-700">
                  We have received your account deletion request. Our team will process it within 30 days 
                  and send you a confirmation email once completed.
                </p>
                <button
                  onClick={() => setSubmitStatus(null)}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your registered email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Registered Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your registered phone number"
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Deletion (Optional)
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please let us know why you're leaving (optional)"
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="confirmDelete"
                    name="confirmDelete"
                    checked={formData.confirmDelete}
                    onChange={handleInputChange}
                    required
                    className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="confirmDelete" className="text-sm text-gray-700">
                    I understand that this action is permanent and cannot be undone. I confirm that I want to delete my PujaKaro account and all associated data.
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                      isFormValid && !isSubmitting
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500'
                        : 'bg-gray-400 cursor-not-allowed'
                    } transition-colors duration-200`}
                  >
                    {isSubmitting ? 'Submitting Request...' : 'Submit Deletion Request'}
                  </button>
                </div>

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">
                      An error occurred while submitting your request. Please try again or contact us directly at{' '}
                      <a href="mailto:pujakaro.in@gmail.com" className="underline">pujakaro.in@gmail.com</a>
                    </p>
                  </div>
                )}
              </form>
            )}
          </section>

          {/* Alternative Contact Methods */}
          <section className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <p className="text-blue-800 text-sm mb-3">
              If you have any questions about account deletion or need assistance, you can also contact us directly:
            </p>
            <div className="space-y-1 text-blue-800 text-sm">
              <p>📧 Email: <a href="mailto:pujakaro.in@gmail.com" className="underline">pujakaro.in@gmail.com</a></p>
              <p>📱 Phone: <a href="tel:+918800627513" className="underline">+91 88006 27513</a></p>
            </div>
          </section>

          {/* Processing Timeline */}
          <section className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Processing Timeline</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Step 1:</strong> Submit your deletion request (immediate)</p>
              <p><strong>Step 2:</strong> We verify your identity (1-2 business days)</p>
              <p><strong>Step 3:</strong> Process your request (within 30 days)</p>
              <p><strong>Step 4:</strong> Send confirmation email once completed</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
