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
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';
import ShippingAndDelivery from '../pages/ShippingAndDelivery';
import CancellationAndRefund from '../pages/CancellationAndRefund';
import Blog from '../pages/Blog';
import BlogPost from '../pages/BlogPost';
import CreateBlogPost from '../pages/CreateBlogPost';
import NotFound from '../pages/NotFound';
import AboutUs from '../pages/AboutUs';
import Services from '../pages/Services';
import Contact from '../pages/Contact';
import Careers from './Careers';
import SoftwareEngineerApplication from '../pages/SoftwareEngineerApplication';
import ProductManagerApplication from '../pages/ProductManagerApplication';
import MarketingSpecialistApplication from '../pages/MarketingSpecialistApplication';
import AdminDashboard from '../pages/AdminDashboard';
import DailyHoroscope from '../pages/DailyHoroscope';
import BirthChartAstrology from '../pages/BirthChartAstrology';
import HoroscopeAdmin from '../pages/HoroscopeAdmin';
  import PaymentPortal from '../pages/PaymentPortal';
// Import authentication pages
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import ProtectedRoute from './ProtectedRoute';


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/puja-booking" element={<PujaBooking />} />
      <Route path="/puja-booking/:id" element={<ProductDetail />} />
      <Route path="/booking-form/:id" element={<BookingForm />} />
      <Route path="/payment" element={<PaymentPortal />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/flowers-and-mala" element={<FlowersAndMala />} />
      <Route path="/prashad-services" element={<PrashadServices />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/blog/create" element={<CreateBlogPost />} />
      <Route path="/blog/edit/:id" element={<CreateBlogPost />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/shipping-and-delivery" element={<ShippingAndDelivery />} />
      <Route path="/cancellation-and-refund" element={<CancellationAndRefund />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/apply/software-engineer" element={<SoftwareEngineerApplication />} />
      <Route path="/apply/product-manager" element={<ProductManagerApplication />} />
      <Route path="/apply/marketing-specialist" element={<MarketingSpecialistApplication />} />
      <Route path="/daily-horoscope" element={<DailyHoroscope />} />
      <Route path="/birth-chart" element={<BirthChartAstrology />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/horoscope" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <HoroscopeAdmin />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
