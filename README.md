# E-Commerce and Puja Booking Application

This project is a React-based e-commerce and puja booking application with the following features:

## Features

- Product browsing with filtering and search capabilities
- Puja service booking system with pandit selection
- Cart functionality for purchasing products
- Detailed product pages with related item suggestions
- Wishlist functionality (Add to favorites)
- Razorpay payment integration
- Responsive design for all device sizes

## Project Structure

- `src/data/data.js`: Contains all the product and puja service data
- `src/contexts/AuthContext.jsx`: Authentication context provider
- `src/components/AppRouter.jsx`: Main router for the application

### Pages

- `src/pages/Shop.jsx`: Product listing page with filtering and search
- `src/pages/PujaBooking.jsx`: Puja service booking listing page
- `src/pages/ProductDetail.jsx`: Detailed view for both products and puja services
- `src/pages/BookingForm.jsx`: Form for collecting user details for puja bookings
- `src/pages/Cart.jsx`: Shopping cart with Razorpay integration

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

## Implementation Details

### Data Management
- Products, puja services, and pandit information are stored in `data.js`
- Each component imports the data it needs
- Helper functions in `data.js` provide suggested items based on the current item

### Navigation Flow
1. Users browse products or pujas on the respective pages
2. Clicking on an item navigates to the detail page
3. From the detail page, users can:
   - Add products to cart
   - Book a puja service
4. The cart page leads to Razorpay checkout
5. The booking form collects user details for puja services

### Razorpay Integration
- Integration is handled in the Cart component
- For testing purposes, use the test keys provided by Razorpay

## Future Improvements

- Add user registration and authentication with a backend service
- Implement a real database instead of the mock data
- Add order history and user profile pages
- Improve the booking confirmation process
- Add admin dashboard for managing products and puja services

## License

MIT