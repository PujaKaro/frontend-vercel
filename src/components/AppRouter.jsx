import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Shop from '../pages/Shop';
import PujaBooking from '../pages/PujaBooking';
import ProductDetail from '../pages/ProductDetail';
import BookingForm from '../pages/BookingForm';
import Cart from '../pages/Cart';
import FlowersAndMala from '../pages/FlowersAndMala';
import PrashadServices from '../pages/PrashadServices';
import OrderConfirmation from '../pages/OrderConfirmation';
import BookingConfirmation from '../pages/BookingConfirmation';
import NotFound from '../pages/NotFound';
  
// Import authentication pages
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/puja-booking" element={<PujaBooking />} />
      <Route path="/puja-booking/:id" element={<ProductDetail />} />
      <Route path="/booking-form/:id" element={<BookingForm />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/flowers-and-mala" element={<FlowersAndMala />} />
      <Route path="/prashad-services" element={<PrashadServices />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter; 
