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
import GeoLocationTracker from './components/GeoLocationTracker';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <AnalyticsTracker />
            <PopupModal />
            <GeoLocationTracker />
            <LeadCaptureModal />
            <Header />
            <main>
              <AppRouter />
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
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
