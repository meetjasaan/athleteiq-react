import React, { createContext, useState, useEffect } from 'react';
import { saveUserSession as saveToFirebase, getUserSession } from '../services/firebaseService';
import { getCurrentUser, clearUserSession } from '../utils/authUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from sessionStorage first (for current session)
    const sessionUser = getCurrentUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      // Save to Firebase
      await saveToFirebase(userData);
      // Save to sessionStorage for current session
      sessionStorage.setItem('athleteiq_session', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to sessionStorage if Firebase fails
      sessionStorage.setItem('athleteiq_session', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    clearUserSession();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
