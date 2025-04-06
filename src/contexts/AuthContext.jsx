import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage (for demo purposes)
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Sign in function
  const signIn = (email, password) => {
    // In a real app, you would validate credentials with an API
    // This is just a mock implementation
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: email,
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
    return Promise.resolve(mockUser);
  };

  // Sign out function
  const signOut = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    return Promise.resolve();
  };

  // Sign up function
  const signUp = (name, email, password) => {
    // In a real app, you would register the user with an API
    // This is just a mock implementation
    const mockUser = {
      id: '1',
      name: name,
      email: email,
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
    return Promise.resolve(mockUser);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    signIn,
    signOut,
    signUp
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;