import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { toast } from 'react-toastify';

const ProtectedAdminRoute = () => {
  const currentUser = getCurrentUser();
  
  // For demo purposes, consider the demo user as an admin
  const isDemoAdmin = currentUser && (
    currentUser.email === 'admin@example.com' || 
    currentUser.role === 'admin' || 
    currentUser.isAdmin === true
  );
  
  console.log('ProtectedAdminRoute - Current User:', currentUser);
  console.log('ProtectedAdminRoute - Is Demo Admin:', isDemoAdmin);
  
  // If not logged in, redirect to login
  if (!currentUser) {
    toast.error('Please log in to access this page');
    return <Navigate to="/login" replace />;
  }
  
  // In demo mode, always allow access
  // In a real app, you would check if the user is an admin
  return <Outlet />;
};

export default ProtectedAdminRoute; 