import { RAZORPAY_CONFIG } from '../config/razorpay';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

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

export const createPayment = async (amount, description, prefill = {}, onSuccess) => {
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
      handler: async function(response) {
        // Store payment info in Firestore
        await setDoc(doc(db, 'payments', response.razorpay_payment_id), {
          amount,
          name: prefill.name,
          email: prefill.email,
          phone: prefill.contact,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          status: 'success',
          createdAt: serverTimestamp()
        });

        console.log('Payment Success:', response);

        // ✅ Call success callback with payment ID
        if (onSuccess) {
          onSuccess(response.razorpay_payment_id);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Payment initialization failed:', error);
    throw error;
  }
};
