import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    try {
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Error storing auth data:', error);
      toast.error('Error saving login data');
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const isAuthenticated = () => {
    return !!user && !!getToken();
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  const isHospital = () => {
    return hasRole('hospital') || hasRole('superadmin');
  };

  const isManufacturer = () => {
    return hasRole('manufacturer');
  };

  const isSuperAdmin = () => {
    return hasRole('superadmin');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    getToken,
    isAuthenticated,
    hasRole,
    isHospital,
    isManufacturer,
    isSuperAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};