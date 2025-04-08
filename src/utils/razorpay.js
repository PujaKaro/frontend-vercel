import { RAZORPAY_CONFIG } from '../config/razorpay';

export const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay'));
    };
    document.body.appendChild(script);
  });
};

export const createPayment = async (amount, description, prefill = {}) => {
  try {
    await loadRazorpay();
    
    const options = {
      key: RAZORPAY_CONFIG.key_id,
      amount: amount * 100, // amount in paise
      currency: RAZORPAY_CONFIG.currency,
      name: RAZORPAY_CONFIG.name,
      description: description,
      prefill: {
        name: prefill.name || '',
        email: prefill.email || '',
        contact: prefill.contact || ''
      },
      theme: RAZORPAY_CONFIG.theme,
      handler: function(response) {
        return response;
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Payment initialization failed:', error);
    throw error;
  }
}; 