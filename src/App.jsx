import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRouter from './components/AppRouter';
import AnalyticsTracker from './components/AnalyticsTracker';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AnalyticsTracker />
          <Header />
          <main>
            <AppRouter />
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;