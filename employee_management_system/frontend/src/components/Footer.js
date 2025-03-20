import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--dark-color);
  color: white;
  padding: 3rem 2rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  h3 {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: var(--primary-color);
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 0.75rem;
  }
  
  a {
    color: #f8f9fa;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      background-color: var(--primary-color);
      transform: translateY(-3px);
    }
  }
`;

const BottomBar = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #f8f9fa;
  font-size: 0.875rem;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  
  a {
    color: #f8f9fa;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--primary-color);
    }
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterColumn>
          <h3>Employee Management</h3>
          <p>A comprehensive solution for managing your organization's workforce efficiently and effectively.</p>
          <SocialLinks>
            <a href="/" aria-label="Facebook">
              <span role="img" aria-label="facebook">📘</span>
            </a>
            <a href="/" aria-label="Twitter">
              <span role="img" aria-label="twitter">🐦</span>
            </a>
            <a href="/" aria-label="LinkedIn">
              <span role="img" aria-label="linkedin">💼</span>
            </a>
            <a href="/" aria-label="Instagram">
              <span role="img" aria-label="instagram">📷</span>
            </a>
          </SocialLinks>
        </FooterColumn>
        
        <FooterColumn>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/employees">Employees</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </FooterColumn>
        
        <FooterColumn>
          <h3>Resources</h3>
          <ul>
            <li><a href="/">Documentation</a></li>
            <li><a href="/">API Reference</a></li>
            <li><a href="/">Support Center</a></li>
            <li><a href="/">FAQs</a></li>
          </ul>
        </FooterColumn>
        
        <FooterColumn>
          <h3>Contact Us</h3>
          <ul>
            <li>Email: info@ems.com</li>
            <li>Phone: +1 (123) 456-7890</li>
            <li>Address: 123 Business Ave, Suite 100, San Francisco, CA 94107</li>
          </ul>
        </FooterColumn>
      </FooterContent>
      
      <BottomBar>
        <Copyright>
          &copy; {currentYear} Employee Management System. All rights reserved.
        </Copyright>
        
        <FooterLinks>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
          <a href="/">Cookie Policy</a>
        </FooterLinks>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer; 