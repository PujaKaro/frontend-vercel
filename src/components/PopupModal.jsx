import React, { useState, useEffect } from 'react';
import './PopupModal.css'; // Import CSS for styling

const PopupModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Handle mobile detection with better breakpoint management
  useEffect(() => {
    const checkMobile = () => {
      // Using a more comprehensive mobile detection
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Auto-close after 1 minute
  useEffect(() => {
    if (isVisible) {
      const autoCloseTimer = setTimeout(() => {
        handleClose();
      }, 60000); // 60 seconds = 1 minute

      return () => clearTimeout(autoCloseTimer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300); // Match the fade-out duration
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      id="popup-modal" 
      className={`popup-modal ${isClosing ? 'fade-out' : 'fade-in'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div className="popup-content">
        <button 
          className="close-button" 
          onClick={handleClose}
          aria-label="Close popup"
        >
          &times;
        </button>
        <img
          src={isMobile ? "/images/value-props_mobile.png" : "/images/value-props.png"}
          alt="Value Props"
          className="popup-image"
          loading="eager" // Load image immediately
        />
        <div className="popup-overlay" onClick={handleClose} />
      </div>
    </div>
  );
};

export default PopupModal;