import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles, requireEmailVerification = true, requirePhoneVerification = true }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  // Check email verification first
  if (requireEmailVerification && !currentUser.emailVerified) {
    return <Navigate to="/email-verification" />;
  }

  // Check phone verification second
  if (requirePhoneVerification && !currentUser.phoneVerified) {
    return <Navigate to="/phone-verification" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;