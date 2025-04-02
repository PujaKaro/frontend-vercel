import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on mount
    const checkAuthStatus = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (isAuthenticated === 'true') {
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        
        setCurrentUser({
          email: userEmail || '',
          name: userName || 'User',
          isAuthenticated: true
        });
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  // Sign in function
  const login = (email, name = '') => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    
    if (name) {
      localStorage.setItem('userName', name);
    }
    
    setCurrentUser({
      email,
      name: name || 'User',
      isAuthenticated: true
    });
    
    return true;
  };

  // Sign out function
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    setCurrentUser(null);
    
    return true;
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser?.isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 