import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Main Pages
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import Services from '../pages/Services';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

// Product & Shopping Pages
import Shop from '../pages/Shop';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import OrderConfirmation from '../pages/OrderConfirmation';
import FlowersAndMala from '../pages/FlowersAndMala';
import PrashadServices from '../pages/PrashadServices';

// Puja Booking Pages
import PujaBooking from '../pages/PujaBooking';
import BookingForm from '../pages/BookingForm';
import BookingConfirmation from '../pages/BookingConfirmation';

// Authentication Pages
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Profile from '../pages/Profile';
import ProtectedRoute from './ProtectedRoute';
import ForgotPassword from './ForgotPassword';
import EmailVerification from './EmailVerification';
import PhoneVerification from './PhoneVerification';
import AuthPage from './AuthPage';
import AuthTestComponent from './AuthTestComponent';

// Blog Pages
import Blog from '../pages/Blog';
import BlogPost from '../pages/BlogPost';
import CreateBlogPost from '../pages/CreateBlogPost';

// Legal Pages
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsAndConditions from '../pages/TermsAndConditions';
import ShippingAndDelivery from '../pages/ShippingAndDelivery';
import CancellationAndRefund from '../pages/CancellationAndRefund';

// Career Pages
import Careers from './Careers';
import SoftwareEngineerApplication from '../pages/SoftwareEngineerApplication';
import ProductManagerApplication from '../pages/ProductManagerApplication';
import MarketingSpecialistApplication from '../pages/MarketingSpecialistApplication';

// Horoscope Pages
import DailyHoroscope from '../pages/DailyHoroscope';
import BirthChartAstrology from '../pages/BirthChartAstrology';

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard';
import HoroscopeAdmin from '../pages/HoroscopeAdmin';

const AppRouter = () => {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Shop & Products */}
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/flowers-and-mala" element={<FlowersAndMala />} />
      <Route path="/prashad-services" element={<PrashadServices />} />
      
      {/* Puja Booking */}
      <Route path="/puja-booking" element={<PujaBooking />} />
      <Route path="/puja-booking/:id" element={<ProductDetail />} />
      <Route path="/booking-form/:id" element={<BookingForm />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      
      {/* Authentication */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/email-verification" element={<EmailVerification />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/phone-verification" element={<PhoneVerification />} />
      <Route path="/auth-test" element={<AuthTestComponent />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Blog */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/blog/create" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CreateBlogPost />
        </ProtectedRoute>
      } />
      <Route path="/blog/edit/:id" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <CreateBlogPost />
        </ProtectedRoute>
      } />
      
      {/* Legal Pages */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/shipping-and-delivery" element={<ShippingAndDelivery />} />
      <Route path="/cancellation-and-refund" element={<CancellationAndRefund />} />
      
      {/* Careers */}
      <Route path="/careers" element={<Careers />} />
      <Route path="/apply/software-engineer" element={<SoftwareEngineerApplication />} />
      <Route path="/apply/product-manager" element={<ProductManagerApplication />} />
      <Route path="/apply/marketing-specialist" element={<MarketingSpecialistApplication />} />
      
      {/* Horoscope */}
      <Route path="/daily-horoscope" element={<DailyHoroscope />} />
      <Route path="/birth-chart" element={<BirthChartAstrology />} />
      
      {/* Admin Routes */}
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
      
      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
