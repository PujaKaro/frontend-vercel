import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPayment } from '../utils/razorpay';
import './PaymentPortal.css';

const PaymentPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    amount,
    pujaName,
    name,
    email,
    phone,
    date,
    time,
    address,
    city,
    state,
    pincode
  } = location.state || {};

  if (!amount || !pujaName) {
    return (
      <div className="payment-bg">
        <div className="text-center" style={{ color: '#e53e3e', fontWeight: 600, fontSize: '1.2rem' }}>
          Booking details not found. Please go back and fill the form again.
        </div>
      </div>
    );
  }

  const handleEditDetails = () => {
    navigate(-1);
  };

  const handleProceedPayment = () => {
    createPayment(
      amount,
      `Payment for ${pujaName}`,
      { name, email, contact: phone },
      (paymentId) => {
        // On successful payment, redirect to booking confirmation page
        navigate('/booking-confirmation', {
          state: {
            bookingDetails: {
              puja: { name: pujaName },
              price: Number(amount),
              finalPrice: Number(amount),
              date,
              timeSlot: time,
              paymentId,
              customerDetails: {
                name,
                email,
                phone,
                address,
                city,
                state,
                pincode
              }
            }
          }
        });
      }
    );
  };

  return (
    <div className="payment-bg">
      <div className="payment-card">
        <h1 className="payment-title">Payment Portal</h1>
        <div className="summary-section">
          <h2 className="summary-title">Booking Summary</h2>
          <div className="summary-list">
            <div><span className="summary-label">Puja Name:</span> {pujaName}</div>
            <div><span className="summary-label">Amount:</span> <span className="summary-amount">₹{Number(amount).toLocaleString()}</span></div>
            <div><span className="summary-label">Name:</span> {name}</div>
            <div><span className="summary-label">Email:</span> {email}</div>
            <div><span className="summary-label">Phone:</span> {phone}</div>
            {date && <div><span className="summary-label">Date:</span> {date}</div>}
            {time && <div><span className="summary-label">Time:</span> {time}</div>}
            {address && (
              <div>
                <span className="summary-label">Address:</span>{' '}
                <span>{address}, {city}, {state} - {pincode}</span>
              </div>
            )}
          </div>
          <div className="payment-actions">
            <button
              onClick={handleEditDetails}
              className="edit-btn"
              type="button"
            >
              ← Edit Details
            </button>
            <button
              onClick={handleProceedPayment}
              className="pay-btn"
              type="button"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPortal;
