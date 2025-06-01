import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import './LeadCaptureModal.css';

const LeadCaptureModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // For inactivity timer
  const inactivityTimer = useRef(null);
  const modalShownRef = useRef(false);

  // Show modal (and set sessionStorage)
  const showModal = () => {
    if (modalShownRef.current || sessionStorage.getItem('leadModalShown')) return;
    setIsVisible(true);
    sessionStorage.setItem('leadModalShown', '1');
    modalShownRef.current = true;
  };

  // 1. Show after 3 seconds of page stay (always)
  useEffect(() => {
    if (sessionStorage.getItem('leadModalShown')) return;
    const timer = setTimeout(showModal, 30000);
    return () => clearTimeout(timer);
  }, []);

  // 2. Show after 30 seconds of inactivity
  useEffect(() => {
    if (sessionStorage.getItem('leadModalShown')) return;

    const resetInactivityTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => {
        showModal();
      }, 30000);
    };
    // Listen for user activity
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetInactivityTimer));
    resetInactivityTimer();

    return () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      events.forEach(event => window.removeEventListener(event, resetInactivityTimer));
    };
    // eslint-disable-next-line
  }, []);


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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const validate = () => {
    if (!name.trim()) return 'Name is required';
    if (!/^\d{10}$/.test(phone.trim())) return 'Enter a valid 10-digit phone number';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    try {
      await addDoc(collection(db, 'NEW_LEADS'), {
        name,
        phone,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(handleClose, 2000);
    } catch (e) {
      setError('Failed to submit. Please try again.');
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="lead-modal-backdrop"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`lead-modal-content${isClosing ? ' fade-out' : ''}`}
      >
        <button
          className="lead-modal-close"
          onClick={handleClose}
          aria-label="Close popup"
        >
          ×
        </button>
        <h2 className="lead-modal-title">
          Need help booking your puja?
        </h2>
        {success ? (
          <div className="lead-modal-success">
            Thank you! We will contact you soon.
          </div>
        ) : (
          <>
            <p className="lead-modal-desc">
              Share your number and we will call you right away!
            </p>
            <form onSubmit={handleSubmit} className="lead-modal-form">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="lead-modal-input"
                autoFocus
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="lead-modal-input"
                maxLength={10}
              />
              {error && <div className="lead-modal-error">{error}</div>}
              <button
                type="submit"
                className="lead-modal-submit"
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureModal;