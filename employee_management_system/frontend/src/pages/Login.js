import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  padding: 1rem;
`;

const LoginCard = styled(motion.div)`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  
  @media (max-width: 500px) {
    padding: 2rem 1.5rem;
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: var(--dark-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--gray-color);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--light-gray-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
    outline: none;
  }
`;

const ErrorText = styled.div`
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--secondary-color);
  }
  
  &:disabled {
    background-color: var(--gray-color);
    cursor: not-allowed;
  }
`;

const DemoCredentials = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 0.875rem;
  border: 1px solid var(--primary-color);
  
  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
    font-weight: 600;
  }
  
  p {
    margin: 0.25rem 0;
  }
  
  strong {
    font-weight: 600;
  }
`;

const SignupLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  
  a {
    color: var(--primary-color);
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  
  const initialValues = {
    email: '',
    password: ''
  };
  
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoginError('');
      const success = await login(values);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginHeader>
          <h1>Employee Management System</h1>
          <p>Login to access your dashboard</p>
        </LoginHeader>
      
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component={ErrorText} />
              </FormGroup>
              
              {loginError && (
                <ErrorText style={{ marginBottom: '1rem' }}>
                  {loginError}
                </ErrorText>
              )}
              
              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </SubmitButton>
              
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--primary-color)', 
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => {
                    setFieldValue('email', 'admin@example.com');
                    setFieldValue('password', 'admin123');
                  }}
                >
                  Fill with demo credentials
                </button>
              </div>
            </Form>
          )}
        </Formik>
        
        <SignupLink>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 