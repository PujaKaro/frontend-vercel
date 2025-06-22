import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';


import Header from './components/Header';
import Footer from './components/Footer';
import AppRouter from './components/AppRouter';
import AnalyticsTracker from './components/AnalyticsTracker';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import PopupModal from './components/PopupModal';
import LeadCaptureModal from './components/LeadCaptureModal';

<<<<<<< HEAD
=======
import useFacebookPixel from './hooks/useFacebookPixel';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';


function AppWithTracking() {
  useFacebookPixel();

  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <AnalyticsTracker />
          <PopupModal />
          <LeadCaptureModal />
          <Header />
          <main>
            <AppRouter />
          </main>
          <Footer />
        </CartProvider>
        <FloatingWhatsAppButton />
      </AuthProvider>
    </>
  );
}
>>>>>>> 1308bdc34c4244fa9fd65eadde2f188da6ccb39d

function App() {
  return (
    <HelmetProvider>
      <Router>
<<<<<<< HEAD
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <AnalyticsTracker />
            <PopupModal />
       
            <LeadCaptureModal />
            <Header />
            <main>
              <AppRouter />
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
=======
        <AppWithTracking />
>>>>>>> 1308bdc34c4244fa9fd65eadde2f188da6ccb39d
      </Router>
    </HelmetProvider>
  );
}


// Add ScrollToTop component to ensure pages start at the top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default App;
