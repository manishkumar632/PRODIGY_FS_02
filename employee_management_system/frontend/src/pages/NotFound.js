import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
  background-color: #f5f7fa;
`;

const NotFoundContent = styled(motion.div)`
  max-width: 500px;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  line-height: 1;
  
  @media (max-width: 576px) {
    font-size: 6rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin: 1rem 0 2rem;
  color: var(--dark-color);
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1.125rem;
  color: var(--gray-color);
  margin-bottom: 2rem;
  
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--secondary-color);
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <NotFoundContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ErrorCode>404</ErrorCode>
        <ErrorTitle>Page Not Found</ErrorTitle>
        <ErrorMessage>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </ErrorMessage>
        <BackButton to="/dashboard">
          Back to Dashboard
        </BackButton>
      </NotFoundContent>
    </NotFoundContainer>
  );
};

export default NotFound; 