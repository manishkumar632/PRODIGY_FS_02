import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  
  span {
    margin-left: 0.5rem;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(motion(Link))`
  margin-left: 2rem;
  color: var(--dark-color);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
  }
  
  &:hover:after, &.active:after {
    width: 100%;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginButton = styled(Link)`
  margin-left: 1rem;
  padding: 0.5rem 1.5rem;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
`;

const LogoutButton = styled.button`
  margin-left: 1rem;
  padding: 0.5rem 1.5rem;
  border: 1px solid var(--danger-color);
  border-radius: 4px;
  background: none;
  color: var(--danger-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--danger-color);
    color: white;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    width: 70%;
    max-width: 300px;
    height: 100vh;
    background-color: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    z-index: 1000;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
`;

const MobileNavLink = styled(Link)`
  padding: 1rem 0;
  color: var(--dark-color);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid var(--light-gray-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 0.5rem;
  }
  
  .user-name {
    font-weight: 500;
  }
`;

const Header = () => {
  const { isAuthenticated, currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <span role="img" aria-label="logo">👥</span>
          <span>EMS</span>
        </Logo>
        
        <NavLinks>
          <NavLink 
            to="/"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Home
          </NavLink>
          
          {!isAuthenticated && (
            <NavLink 
              to="/contact"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Contact
            </NavLink>
          )}
          
          {isAuthenticated && isAdmin && (
            <>
              <NavLink 
                to="/dashboard"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Dashboard
              </NavLink>
              
              <NavLink 
                to="/employees"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                Employees
              </NavLink>
            </>
          )}
          
          {isAuthenticated && !isAdmin && (
            <NavLink 
              to="/messages"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              Messages
            </NavLink>
          )}
        </NavLinks>
        
        <AuthButtons>
          {isAuthenticated ? (
            <>
              <UserInfo>
                <div className="avatar">
                  {getInitials(currentUser?.name)}
                </div>
                <span className="user-name">{currentUser?.name}</span>
              </UserInfo>
              <LogoutButton onClick={handleLogout}>
                Logout
              </LogoutButton>
            </>
          ) : (
            <LoginButton to="/login">
              Login
            </LoginButton>
          )}
        </AuthButtons>
        
        <MobileMenuButton onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </MobileMenuButton>
      </HeaderContent>
      
      {mobileMenuOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMobileMenu}
        />
      )}
      
      <MobileMenu
        initial={{ x: '100%' }}
        animate={{ x: mobileMenuOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <MobileNavLinks>
          <MobileNavLink to="/" onClick={closeMobileMenu}>
            Home
          </MobileNavLink>
          
          {!isAuthenticated && (
            <MobileNavLink to="/contact" onClick={closeMobileMenu}>
              Contact
            </MobileNavLink>
          )}
          
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <>
                  <MobileNavLink to="/dashboard" onClick={closeMobileMenu}>
                    Dashboard
                  </MobileNavLink>
                  
                  <MobileNavLink to="/employees" onClick={closeMobileMenu}>
                    Employees
                  </MobileNavLink>
                </>
              )}
              
              {!isAdmin && (
                <MobileNavLink to="/messages" onClick={closeMobileMenu}>
                  Messages
                </MobileNavLink>
              )}
              
              <LogoutButton onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}>
                Logout
              </LogoutButton>
            </>
          ) : (
            <MobileNavLink to="/login" onClick={closeMobileMenu}>
              Login
            </MobileNavLink>
          )}
        </MobileNavLinks>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header; 