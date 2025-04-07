/**
 * Utility functions for Google Analytics event tracking
 */

/**
 * Track a page view in Google Analytics
 * @param {string} path - The page path to track
 * @param {string} title - The page title
 */
export const trackPageView = (path, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-C4T23TJGS5', {
      page_path: path,
      page_title: title,
    });
  }
};

/**
 * Track an event in Google Analytics
 * @param {string} action - The event action (e.g., "click", "submit")
 * @param {string} category - The event category (e.g., "product", "form")
 * @param {string} label - The event label (e.g., "add to cart button", "signup form")
 * @param {object} additionalParams - Any additional parameters to track
 */
export const trackEvent = (action, category, label, additionalParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      ...additionalParams,
    });
  }
};

/**
 * Track ecommerce events in Google Analytics
 * @param {string} action - The ecommerce action (e.g., "add_to_cart", "purchase")
 * @param {object} params - The ecommerce event parameters
 */
export const trackEcommerce = (action, params) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};

/**
 * Track a product view in Google Analytics
 * @param {object} product - The product data
 */
export const trackProductView = (product) => {
  trackEcommerce('view_item', {
    currency: 'INR',
    value: product.price,
    items: [
      {
        item_id: `P${product.id}`,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  });
};

/**
 * Track adding a product to cart in Google Analytics
 * @param {object} product - The product data
 * @param {number} quantity - The quantity added
 */
export const trackAddToCart = (product, quantity = 1) => {
  trackEcommerce('add_to_cart', {
    currency: 'INR',
    value: product.price * quantity,
    items: [
      {
        item_id: `P${product.id}`,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: quantity,
      },
    ],
  });
};

/**
 * Track a puja service booking in Google Analytics
 * @param {object} puja - The puja service data
 */
export const trackPujaBooking = (puja) => {
  trackEcommerce('begin_checkout', {
    currency: 'INR',
    value: puja.price,
    items: [
      {
        item_id: `S${puja.id}`,
        item_name: puja.name,
        item_category: 'puja-service',
        price: puja.price,
        quantity: 1,
      },
    ],
  });
};

/**
 * Track a purchase completion in Google Analytics
 * @param {string} transactionId - The transaction ID
 * @param {number} value - The total transaction value
 * @param {Array} items - The items purchased
 */
export const trackPurchase = (transactionId, value, items) => {
  trackEcommerce('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'INR',
    tax: 0,
    shipping: 0,
    items: items.map(item => ({
      item_id: `${item.type === 'product' ? 'P' : 'S'}${item.id}`,
      item_name: item.name,
      item_category: item.category || 'puja-service',
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
};

export default {
  trackPageView,
  trackEvent,
  trackEcommerce,
  trackProductView,
  trackAddToCart,
  trackPujaBooking,
  trackPurchase,
}; 