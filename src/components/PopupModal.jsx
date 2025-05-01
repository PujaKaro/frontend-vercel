import React, { useState, useEffect } from 'react';
import './PopupModal.css'; // Import CSS for styling

const PopupModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const handleClose = () => {
    const modal = document.getElementById('popup-modal');
    modal.classList.add('fade-out');
    setTimeout(() => setIsVisible(false), 300); // Match fade-out duration
  };

  useEffect(() => {
    // Function to check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div id="popup-modal" className="popup-modal">
      <div className="popup-content">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <img
          src={isMobile ? "/images/value-props_mobile.png" : "/images/value-props.png"}
          alt="Value Props"
          className="popup-image"
        />
      </div>
    </div>
  );
};

export default PopupModal;