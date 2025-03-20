import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { loginUser, logoutUser, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Force admin status for demo purposes
  const forceAdminStatus = (user) => {
    if (user && user.email === 'admin@example.com') {
      return {
        ...user,
        role: 'admin',
        isAdmin: true
      };
    }
    return user;
  };

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      // Ensure admin status for demo user
      const enhancedUser = forceAdminStatus(user);
      setCurrentUser(enhancedUser);
      setIsAuthenticated(true);
      
      // Update localStorage with enhanced user if needed
      if (user.email === 'admin@example.com' && (!user.isAdmin || user.role !== 'admin')) {
        localStorage.setItem('current_user', JSON.stringify(enhancedUser));
      }
      
      console.log('AuthContext - User loaded from localStorage:', enhancedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginUser(credentials);
      
      if (response.success) {
        // Ensure admin status for demo user
        const enhancedUser = forceAdminStatus(response.user);
        setCurrentUser(enhancedUser);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        console.log('AuthContext - User logged in:', enhancedUser);
        return true;
      } else {
        toast.error(response.message || 'Login failed. Please try again.');
        return false;
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setCurrentUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    isAdmin: currentUser && (currentUser.role === 'admin' || currentUser.isAdmin === true || currentUser.email === 'admin@example.com')
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 