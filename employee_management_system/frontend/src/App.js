import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import NewsManagement from './pages/NewsManagement';
import Contact from './pages/Contact';
import Messages from './pages/Messages';
import AdminMessages from './pages/AdminMessages';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, currentUser } = useAuth();
  
  // Check if user is admin
  const isAdmin = currentUser && (
    currentUser.role === 'admin' || 
    currentUser.isAdmin === true || 
    currentUser.email === 'admin@example.com'
  );

  // Debug information
  useEffect(() => {
    console.log('App.js - Auth State:', { 
      isAuthenticated, 
      currentUser, 
      isAdmin,
      userEmail: currentUser?.email,
      userRole: currentUser?.role,
      userIsAdmin: currentUser?.isAdmin
    });
  }, [isAuthenticated, currentUser, isAdmin]);

  return (
    <>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to={isAdmin ? "/dashboard" : "/messages"} />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <Signup /> : <Navigate to={isAdmin ? "/dashboard" : "/messages"} />} 
        />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Dashboard accessible to all authenticated users */}
            <Route path="/dashboard" element={isAdmin ? <Dashboard /> : <Navigate to="/messages" replace />} />
            
            {/* Messages Routes */}
            <Route path="/messages" element={<Messages />} />
            
            {/* Admin Messages Route */}
            {isAdmin ? (
              <Route path="/admin/messages" element={<AdminMessages />} />
            ) : (
              <Route path="/admin/messages" element={<Navigate to="/messages" replace />} />
            )}
            
            {/* Employee Routes - Admin Only */}
            {isAdmin ? (
              <Route path="/employees">
                <Route index element={<EmployeeList />} />
                <Route path="add" element={<EmployeeForm />} />
                <Route path="edit/:id" element={<EmployeeForm />} />
              </Route>
            ) : (
              <Route path="/employees/*" element={<Navigate to="/dashboard" replace />} />
            )}
            
            {/* News Routes - Admin Only */}
            {isAdmin ? (
              <Route path="/news">
                <Route index element={<NewsManagement />} />
              </Route>
            ) : (
              <Route path="/news/*" element={<Navigate to="/dashboard" replace />} />
            )}
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App; 