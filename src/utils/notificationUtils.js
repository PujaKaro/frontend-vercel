import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Send a notification to a user about their booking status change
 * @param {string} userId - The user ID to send the notification to
 * @param {string} bookingId - The ID of the booking
 * @param {string} status - The new status of the booking
 * @param {string} pujaName - The name of the puja service
 * @returns {Promise<string>} - The ID of the created notification
 */
export const sendBookingNotification = async (userId, bookingId, status, pujaName) => {
  try {
    let title, message;
    
    switch (status) {
      case 'approved':
        title = 'Booking Approved';
        message = `Your booking for ${pujaName} has been approved. We look forward to serving you.`;
        break;
      case 'rejected':
        title = 'Booking Rejected';
        message = `We're sorry, but your booking for ${pujaName} could not be approved at this time. Please contact customer support for more information.`;
        break;
      case 'completed':
        title = 'Booking Completed';
        message = `Your booking for ${pujaName} has been marked as completed. We hope the service met your expectations.`;
        break;
      case 'cancelled':
        title = 'Booking Cancelled';
        message = `Your booking for ${pujaName} has been cancelled as requested.`;
        break;
      default:
        title = 'Booking Update';
        message = `The status of your booking for ${pujaName} has been updated to ${status}.`;
    }
    
    const notificationData = {
      userId,
      title,
      message,
      type: 'booking_update',
      bookingId,
      pujaName,
      read: false,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    return docRef.id;
  } catch (error) {
    console.error('Error sending booking notification:', error);
    throw error;
  }
};

/**
 * Send a notification to a user about their order status change
 * @param {string} userId - The user ID to send the notification to
 * @param {string} orderId - The ID of the order
 * @param {string} status - The new status of the order
 * @param {string} orderName - The name or description of the order
 * @returns {Promise<string>} - The ID of the created notification
 */
export const sendOrderNotification = async (userId, orderId, status, orderName) => {
  try {
    let title, message;
    
    switch (status) {
      case 'processing':
        title = 'Order Processing';
        message = `Your order #${orderId.slice(0, 8)} is now being processed.`;
        break;
      case 'shipped':
        title = 'Order Shipped';
        message = `Your order #${orderId.slice(0, 8)} has been shipped and is on its way to you.`;
        break;
      case 'delivered':
        title = 'Order Delivered';
        message = `Your order #${orderId.slice(0, 8)} has been marked as delivered. We hope you enjoy your purchase.`;
        break;
      case 'cancelled':
        title = 'Order Cancelled';
        message = `Your order #${orderId.slice(0, 8)} has been cancelled as requested.`;
        break;
      default:
        title = 'Order Update';
        message = `The status of your order #${orderId.slice(0, 8)} has been updated to ${status}.`;
    }
    
    const notificationData = {
      userId,
      title,
      message,
      type: 'order_update',
      orderId,
      read: false,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    return docRef.id;
  } catch (error) {
    console.error('Error sending order notification:', error);
    throw error;
  }
};

/**
 * Send a notification to multiple users about a new coupon
 * @param {Array<string>} userIds - Array of user IDs to send the notification to
 * @param {string} couponCode - The coupon code
 * @param {number} discountPercentage - The discount percentage
 * @returns {Promise<Array<string>>} - Array of created notification IDs
 */
export const sendCouponNotification = async (userIds, couponCode, discountPercentage) => {
  try {
    const title = 'New Coupon Available';
    const message = `Use code ${couponCode} to get ${discountPercentage}% off on your next purchase!`;
    
    const notificationPromises = userIds.map(userId => {
      const notificationData = {
        userId,
        title,
        message,
        type: 'coupon',
        couponCode,
        read: false,
        createdAt: serverTimestamp()
      };
      
      return addDoc(collection(db, 'notifications'), notificationData);
    });
    
    const results = await Promise.all(notificationPromises);
    return results.map(docRef => docRef.id);
  } catch (error) {
    console.error('Error sending coupon notifications:', error);
    throw error;
  }
};

/**
 * Send a notification to a user requesting a review for a completed puja
 * @param {string} userId - The user ID to send the notification to
 * @param {string} bookingId - The ID of the booking
 * @param {string} pujaName - The name of the puja service
 * @returns {Promise<string>} - The ID of the created notification
 */
export const sendReviewRequestNotification = async (userId, bookingId, pujaName) => {
  try {
    const notificationData = {
      userId,
      title: 'Share Your Experience',
      message: `How was your experience with ${pujaName}? Please take a moment to share your feedback.`,
      type: 'review_request',
      bookingId,
      pujaName,
      read: false,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    return docRef.id;
  } catch (error) {
    console.error('Error sending review request notification:', error);
    throw error;
  }
};

/**
 * Send a notification to a user about their testimonial status
 * @param {string} userId - The user ID to send the notification to
 * @param {string} testimonialId - The ID of the testimonial
 * @param {string} status - The new status of the testimonial (approved/rejected)
 * @returns {Promise<string>} - The ID of the created notification
 */
export const sendTestimonialStatusNotification = async (userId, testimonialId, status) => {
  try {
    let title, message;
    
    if (status === 'approved') {
      title = 'Testimonial Approved';
      message = 'Your testimonial has been approved and is now visible on our website. Thank you for your feedback!';
    } else {
      title = 'Testimonial Update';
      message = 'Your testimonial has been reviewed. Please contact us for more information.';
    }
    
    const notificationData = {
      userId,
      title,
      message,
      type: 'testimonial_update',
      testimonialId,
      read: false,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'notifications'), notificationData);
    return docRef.id;
  } catch (error) {
    console.error('Error sending testimonial status notification:', error);
    throw error;
  }
}; 