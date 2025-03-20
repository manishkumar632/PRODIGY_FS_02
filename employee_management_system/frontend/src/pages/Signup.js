import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { registerUser } from '../services/authService';

const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  padding: 1rem;
`;

const SignupCard = styled(motion.div)`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;
  
  @media (max-width: 500px) {
    padding: 2rem 1.5rem;
  }
`;

const SignupHeader = styled.div`
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
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

const LoginLink = styled.div`
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

const Signup = () => {
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState('');
  
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters'),
    lastName: Yup.string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSignupError('');
      const { confirmPassword, ...userData } = values;
      
      const response = await registerUser(userData);
      
      if (response.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        setSignupError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setSignupError(error.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <SignupContainer>
      <SignupCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SignupHeader>
          <h1>Create an Account</h1>
          <p>Join the Employee Management System</p>
        </SignupHeader>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                />
                <ErrorMessage name="firstName" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                />
                <ErrorMessage name="lastName" component={ErrorText} />
              </FormGroup>
              
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
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                  />
                  <ErrorMessage name="password" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage name="confirmPassword" component={ErrorText} />
                </FormGroup>
              </FormRow>
              
              {signupError && (
                <ErrorText style={{ marginBottom: '1rem' }}>
                  {signupError}
                </ErrorText>
              )}
              
              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </SubmitButton>
            </Form>
          )}
        </Formik>
        
        <LoginLink>
          Already have an account? <Link to="/login">Login</Link>
        </LoginLink>
      </SignupCard>
    </SignupContainer>
  );
};

export default Signup; 