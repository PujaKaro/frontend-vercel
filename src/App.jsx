import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Shop from './pages/Shop';
import PujaBooking from './pages/PujaBooking';
import FlowersAndMala from './pages/FlowersAndMala';
import PrashadServices from './pages/PrashadServices';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';
import ProductDetail from './pages/ProductDetail';
import BookingForm from './pages/BookingForm';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/puja-booking" element={<PujaBooking />} />
                <Route path="/puja-booking/:id" element={<ProductDetail />} />
                <Route path="/booking-form/:id" element={<BookingForm />} />
                <Route path="/flowers-and-mala" element={<FlowersAndMala />} />
                <Route path="/prashad-services" element={<PrashadServices />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;