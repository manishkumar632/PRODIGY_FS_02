import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
`;

const Sidebar = styled.aside`
  width: 250px;
  background-color: var(--dark-color);
  color: var(--white-color);
  padding: 1.5rem 0;
  transition: all 0.3s ease;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    position: fixed;
    z-index: 1000;
    width: 240px;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
`;

const NavItem = styled(motion.div)`
  padding: 0.75rem 1.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background-color: var(--primary-color);
  }
  
  a {
    color: var(--white-color);
    text-decoration: none;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.75rem;
    }
  }
`;

const NavSection = styled.div`
  margin-bottom: 1.5rem;
  
  .section-title {
    padding: 0.5rem 1.5rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 1px;
  }
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--light-gray-color);
  margin-bottom: 2rem;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--dark-color);
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
  }
`;

const Overlay = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const UserInfo = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
  
  .user-name {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .user-role {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    text-transform: capitalize;
  }
  
  .logout-button {
    margin-top: 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const Layout = () => {
  const { logout, currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if user is admin
  const isAdmin = currentUser && (
    currentUser.role === 'admin' || 
    currentUser.isAdmin === true || 
    currentUser.email === 'admin@example.com'
  );
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };
  
  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/employees') return 'Employee Management';
    if (location.pathname === '/employees/add') return 'Add Employee';
    if (location.pathname.includes('/employees/edit')) return 'Edit Employee';
    if (location.pathname === '/news') return 'News Management';
    if (location.pathname === '/messages') return 'My Messages';
    if (location.pathname === '/admin/messages') return 'Message Management';
    if (location.pathname === '/contact') return 'Contact Us';
    return '';
  };
  
  return (
    <LayoutContainer>
      <Header />
      
      <MainContent>
        {sidebarOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebarOnMobile}
          />
        )}
        
        <MobileMenuButton onClick={toggleSidebar}>
          {sidebarOpen ? '✕' : '☰'}
        </MobileMenuButton>
        
        <Sidebar isOpen={sidebarOpen}>
          <Logo>{isAdmin ? 'Admin Dashboard' : 'User Portal'}</Logo>
          
          <nav>
            {isAuthenticated && (
            <NavSection>
              <div className="section-title">Main</div>
              {isAdmin && (
                <NavItem
                  className={location.pathname === '/dashboard' ? 'active' : ''}
                  whileHover={{ x: 5 }}
                  onClick={closeSidebarOnMobile}
                >
                  <Link to="/dashboard">
                    <span role="img" aria-label="dashboard">📊</span> Dashboard
                  </Link>
                </NavItem>
              )}
              
              {!isAdmin && (
                <NavItem
                  className={location.pathname === '/messages' ? 'active' : ''}
                  whileHover={{ x: 5 }}
                  onClick={closeSidebarOnMobile}
                >
                  <Link to="/messages">
                    <span role="img" aria-label="messages">✉️</span> My Messages
                  </Link>
                </NavItem>
              )}
            </NavSection>
            )}
            
            {isAdmin && (
              <NavSection>
                <div className="section-title">Admin</div>
                <NavItem
                  className={location.pathname.includes('/employees') ? 'active' : ''}
                  whileHover={{ x: 5 }}
                  onClick={closeSidebarOnMobile}
                >
                  <Link to="/employees">
                    <span role="img" aria-label="employees">👥</span> Employees
                  </Link>
                </NavItem>
                
                <NavItem
                  className={location.pathname.includes('/news') ? 'active' : ''}
                  whileHover={{ x: 5 }}
                  onClick={closeSidebarOnMobile}
                >
                  <Link to="/news">
                    <span role="img" aria-label="news">📰</span> News Management
                  </Link>
                </NavItem>
                
                <NavItem
                  className={location.pathname.includes('/admin/messages') ? 'active' : ''}
                  whileHover={{ x: 5 }}
                  onClick={closeSidebarOnMobile}
                >
                  <Link to="/admin/messages">
                    <span role="img" aria-label="messages">✉️</span> Messages
                  </Link>
                </NavItem>
              </NavSection>
            )}
            
            <NavSection>
              <div className="section-title">General</div>
              <NavItem
                className={location.pathname === '/' ? 'active' : ''}
                whileHover={{ x: 5 }}
                onClick={closeSidebarOnMobile}
              >
                <Link to="/">
                  <span role="img" aria-label="home">🏠</span> Home
                </Link>
              </NavItem>
              
              {!isAuthenticated && (
                <NavItem
                  className={location.pathname === '/contact' ? 'active' : ''}
                  whileHover={{ x: 5 }}
                  onClick={closeSidebarOnMobile}
                >
                  <Link to="/contact">
                    <span role="img" aria-label="contact">📝</span> Contact
                  </Link>
                </NavItem>
              )}
            </NavSection>
          </nav>
          
          <UserInfo>
            <div className="user-name">
              {currentUser?.firstName || ''} {currentUser?.lastName || ''}
            </div>
            <div className="user-role">
              {isAdmin ? 'Administrator' : 'Regular User'}
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </UserInfo>
        </Sidebar>
        
        <ContentArea>
          <PageHeader>
            <h1 className="page-title">
              {getPageTitle()}
            </h1>
          </PageHeader>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </ContentArea>
      </MainContent>
      
      <Footer />
    </LayoutContainer>
  );
};

export default Layout; 