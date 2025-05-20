import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, 
  faEnvelope, 
  faLocationDot,
  faClock,
  faPaperPlane
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import emailjs from 'emailjs-com';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useRef();

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Map form field names to state property names
    const fieldMapping = {
      'from_name': 'name',
      'from_email': 'email',
      'from_phone': 'phone',
      'subject': 'subject',
      'message': 'message'
    };
    
    const stateProperty = fieldMapping[name] || name;
    
    setFormData(prev => ({
      ...prev,
      [stateProperty]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      from_phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      to_email: 'pujakaro.in@gmail.com',
      // reply_to: 'ravindranathjha75@gmail.com'
    };

    // Send email using EmailJS with explicit parameters
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        toast.success('Your message has been sent successfully!');
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      })
      .catch((error) => {
        console.error('Failed to send email:', error.text || error.message);
        toast.error(`Failed to send message: ${error.text || 'Please try again later'}`);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-600 text-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Contact Us
          </h1>
          <p className="text-lg sm:text-xl text-center max-w-3xl mx-auto">
            Get in touch with us for any questions or assistance
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            {isSubmitted ? (
              <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
                Thank you for your message. We'll get back to you soon!
              </div>
            ) : (
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="from_name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="from_email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="from_phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  ></textarea>
                </div>
                
                {/* Hidden fields for email configuration */}
                <input type="hidden" name="to_email" value="pujakaro.in@gmail.com" />
                <input type="hidden" name="reply_to" value="pujakaro.in@gmail.com" />
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>+91 88006 27513</span>
                  <a 
                    href="https://wa.me/8800627513" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-green-500 hover:text-green-700"
                    aria-label="Chat on WhatsApp"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </a>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>pujakaro.in@gmail.com</span>
                </li>
                <li className="mt-4">
                  <p className="text-gray-400 mb-1">Office Address:</p>
                  <p className="text-gray-400">G-275 Molarband Extn,<br />New Delhi-110044</p>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <h4 className="text-lg font-semibold mb-4">Working Hours</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <FontAwesomeIcon icon={faClock} />
                  <span>Monday - Saturday: 9:00 AM - 7:00 PM</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <FontAwesomeIcon icon={faClock} />
                  <span>Sunday: 10:00 AM - 5:00 PM</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <h4 className="text-lg font-semibold mb-4">Location</h4>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.7129261970997!2d77.3159!3d28.5355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjgrMzInMDguOCJOIDc3wrAxOCc1Ny4yIkU!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-md"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 