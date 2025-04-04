import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-8xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-6">
            <div>
              <Link to="/" className="text-2xl font-bold text-custom mb-6 block">PujaKaro</Link>
              <p className="text-gray-400">Your trusted platform for authentic puja services and religious products.</p>
              <div className="flex space-x-4 mt-6">
              <a href="https://www.facebook.com/your-facebook-profile" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebook} className="text-xl" />
                </a>
                <a href="https://www.instagram.com/pujakaro.in" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faInstagram} className="text-xl" />
                </a>
                <a href="https://twitter.com/your-twitter-profile" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitter} className="text-xl" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/shop" className="text-gray-400 hover:text-white">Shop</Link></li>
                <li><Link to="/pujaBooking" className="text-gray-400 hover:text-white">Book a Puja</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white">My Account</Link></li>
                <li><Link to="/cart" className="text-gray-400 hover:text-white">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-400">
                  <FontAwesomeIcon icon={faPhone} />
                  <span>+91 79825 45360</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>pujakaro.in@gmail.com</span>
                </li>
                <li className="mt-4">
                  <p className="text-gray-400 mb-1">Office Address:</p>
                  <p className="text-gray-400">1160/13 Govindpuri, Kalka Ji<br />Delhi - 110019</p>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates on pujas, offers, and spiritual insights.</p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full pl-4 pr-12 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-button placeholder-gray-500" 
                />
                <button className="absolute right-2 top-2 p-1 bg-custom text-white rounded-button">
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2024 PujaKaro. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <a 
        href="https://wa.me/919876543210" 
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
      </a>
    </>
  );
};

export default Footer; 