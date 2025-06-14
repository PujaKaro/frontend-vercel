// src/components/FloatingWhatsAppButton.jsx
import React from 'react';

const FloatingWhatsAppButton = () => {
  const handleClick = () => {
    if (window.fbq) {
      window.fbq('trackCustom', 'WhatsAppClick');
    }
  };

  return (
    <a
      href="https://wa.me/918800627513"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Chat on WhatsApp"
      onClick={handleClick}
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
};

export default FloatingWhatsAppButton;
