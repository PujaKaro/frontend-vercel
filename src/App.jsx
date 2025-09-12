import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';


import Header from './components/Header';
import Footer from './components/Footer';
import AppRouter from './components/AppRouter';
import AnalyticsTracker from './components/AnalyticsTracker';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { CoinWalletProvider } from './contexts/CoinWalletContext';
import PopupModal from './components/PopupModal';
import LeadCaptureModal from './components/LeadCaptureModal';
import AnnouncementBar from './components/AnnouncementBar';
import UpdateNotification from './components/UpdateNotification';

import useFacebookPixel from './hooks/useFacebookPixel';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';


function AppWithTracking() {
  useFacebookPixel();

  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <CoinWalletProvider>
            <AnalyticsTracker />
            <PopupModal />
            <LeadCaptureModal />
            <AnnouncementBar />
            <Header />
            <main>
              <AppRouter />
            </main>
            <Footer />
            <UpdateNotification />
          </CoinWalletProvider>
        </CartProvider>
        <FloatingWhatsAppButton />
      </AuthProvider>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppWithTracking />
      </Router>
    </HelmetProvider>
  );
}


// Add ScrollToTop component to ensure pages start at the top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser's scroll restoration to prevent conflicts
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // Use instant instead of smooth to avoid conflicts
      });
    };

    // Use both setTimeout and requestAnimationFrame for better reliability
    const timer = setTimeout(() => {
      requestAnimationFrame(scrollToTop);
    }, 50);

    return () => {
      clearTimeout(timer);
      // Re-enable scroll restoration when component unmounts
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, [pathname]);

  // Also handle popstate events (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
      }, 100);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return null;
}

export default App;
