// Utility functions for cart calculations

export const calculateDeliveryCharges = (subtotal) => {
  // If subtotal is less than ₹99, apply delivery charges
  // If subtotal is ₹99 or more, delivery is free
  return subtotal < 99 ? 99 : 0;
};

export const calculateOrderSummary = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // const tax = subtotal * 0.18; // 18% GST - Commented out
  const tax = 0; // GST removed
  const deliveryCharges = calculateDeliveryCharges(subtotal);
  const total = subtotal + tax + deliveryCharges;

  return {
    subtotal,
    tax,
    deliveryCharges,
    total
  };
}; 