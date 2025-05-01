import React, { useState, useEffect } from 'react';
import './PopupModal.css'; // Import CSS for styling

const PopupModal = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    const modal = document.getElementById('popup-modal');
    modal.classList.add('fade-out');
    setTimeout(() => setIsVisible(false), 300); // Match fade-out duration
  };

  useEffect(() => {
    // Automatically show the modal on page load
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div id="popup-modal" className="popup-modal">
      <div className="popup-content">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        <img
          src="/images/value-props.png"
          alt="Value Props"
          className="popup-image"
        />
      </div>
    </div>
  );
};

export default PopupModal;