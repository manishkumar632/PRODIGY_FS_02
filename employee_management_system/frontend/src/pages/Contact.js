import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { sendMessage } from '../services/messageService';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  .textarea-field {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--light-gray-color);
    border-radius: 4px;
    font-size: 1rem;
    min-height: 150px;
    resize: vertical;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
    }
  }
`;

const FormHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  
  h1 {
    font-size: 2rem;
    color: var(--dark-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--gray-color);
    font-size: 1.1rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark-color);
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--light-gray-color);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const TextArea = styled(Field)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--light-gray-color);
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  }
`;

const ErrorText = styled.div`
  color: var(--danger-color);
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 1rem;
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

const SuccessMessage = styled(motion.div)`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

const Contact = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [messageSent, setMessageSent] = useState(false);
  
  // Initial form values with default name if not provided
  const initialValues = {
    name: currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : '',
    email: currentUser ? currentUser.email || '' : '',
    subject: '',
    message: ''
  };
  
  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    subject: Yup.string().required('Subject is required'),
    message: Yup.string().required('Message is required').min(1, 'Message cannot be empty')
  });
  
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Ensure name has a default value if empty
      const messageData = {
        ...values,
        name: values.name.trim() || 'Anonymous User',
        userId: currentUser?.id || null
      };
      
      console.log('Sending message data:', messageData);
      
      // Send message
      const response = await sendMessage(messageData);
      
      if (response && response.success) {
        setMessageSent(true);
        resetForm();
        toast.success('Your message has been sent successfully!');
      } else {
        toast.error(response?.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Container>
      <FormContainer>
        <FormHeader>
          <h1>Contact Us</h1>
          <p>Have a question or feedback? Send us a message and we'll get back to you as soon as possible.</p>
        </FormHeader>
        
        {messageSent && (
          <SuccessMessage
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your message has been sent successfully! We'll get back to you soon.
          </SuccessMessage>
        )}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnChange={true}
          validateOnBlur={true}
          validateOnSubmit={true}
        >
          {({ isSubmitting, errors, touched, values, handleChange }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  disabled={isAuthenticated}
                />
                <ErrorMessage name="name" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your email address"
                  disabled={isAuthenticated}
                />
                <ErrorMessage name="email" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Message subject"
                />
                <ErrorMessage name="subject" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="message">Message</Label>
                <Field
                  as="textarea"
                  id="message"
                  name="message"
                  placeholder="Type your message here..."
                  className="textarea-field"
                />
                <ErrorMessage name="message" component={ErrorText} />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </FormContainer>
    </Container>
  );
};

export default Contact; 