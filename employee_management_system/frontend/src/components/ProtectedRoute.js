import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../services/authService';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const currentUser = getCurrentUser();

  // Debug information
  useEffect(() => {
    console.log('ProtectedRoute - Auth State:', { 
      isAuthenticated, 
      loading,
      currentUser,
      localStorageUser: localStorage.getItem('current_user'),
      token: localStorage.getItem('auth_token')
    });
  }, [isAuthenticated, loading, currentUser]);

  // For demo purposes, consider any user with a token as authenticated
  const hasToken = !!localStorage.getItem('auth_token');
  const isDemo = currentUser && currentUser.email === 'admin@example.com';

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // In demo mode, always allow access if there's a token or demo user
  if (isDemo || hasToken) {
    console.log('ProtectedRoute - Access granted (Demo mode)');
    return <Outlet />;
  }

  // Normal authentication check
  if (!isAuthenticated) {
    console.log('ProtectedRoute - Access denied (Not authenticated)');
    toast.error('Please log in to access this page');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - Access granted (Authenticated)');
  return <Outlet />;
};

export default ProtectedRoute; 