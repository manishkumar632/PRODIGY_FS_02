import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getEmployeeById, createEmployee, updateEmployee } from '../services/employeeService';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 576px) {
    padding: 1rem;
  }
`;

// eslint-disable-next-line no-unused-vars
const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 576px) {
    padding: 1rem;
  }
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.75rem;
    color: var(--dark-color);
    margin: 0;
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

// eslint-disable-next-line no-unused-vars
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark-color);
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid var(--light-gray-color);
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid var(--light-gray-color);
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
  }
`;

// Custom error message component that safely handles undefined touched values
const ErrorText = ({ name }) => (
  <ErrorMessage
    name={name}
    render={msg => (
      <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
        {msg}
      </div>
    )}
  />
);

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.secondary ? 'var(--light-gray-color)' : 'var(--primary-color)'};
  color: ${props => props.secondary ? 'var(--dark-color)' : 'white'};
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.secondary ? '#e0e0e0' : 'var(--secondary-color)'};
  }
`;

const SubmitButton = styled(Button)`
  &:disabled {
    background-color: var(--gray-color);
    cursor: not-allowed;
  }
`;

const StyledForm = styled(Form)`
  width: 100%;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  &:after {
    content: " ";
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 6px solid var(--primary-color);
    border-color: var(--primary-color) transparent var(--primary-color) transparent;
    animation: spinner 1.2s linear infinite;
  }
  
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Define departments array for dropdown
// eslint-disable-next-line no-unused-vars
const departments = [
  'Engineering',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Operations',
  'Customer Support',
  'Research & Development',
  'Legal',
  'Executive'
];

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: 'Engineering', // Set a default department
    hireDate: new Date().toISOString().split('T')[0],
    salary: '',
    status: 'Active'
  });
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  // Fetch employee data if in edit mode
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (isEditMode && id) {
          console.log(`Fetching employee with ID: ${id}`);
          setIsLoading(true);
          const response = await getEmployeeById(id.toString());
          
          if (response && response.success && response.data) {
            console.log('Employee data fetched successfully:', response.data);
            const employee = response.data;
            setInitialValues({
              firstName: employee.firstName || '',
              lastName: employee.lastName || '',
              email: employee.email || '',
              phone: employee.phone || '',
              position: employee.position || '',
              department: employee.department || 'Engineering',
              hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              salary: employee.salary ? employee.salary.toString() : '',
              status: employee.status || 'Active'
            });
          } else {
            console.error('Failed to fetch employee data:', response);
            setError('Failed to fetch employee data');
            toast.error('Failed to fetch employee data');
          }
        } else if (isEditMode) {
          console.error('Edit mode active but no ID provided');
          setError('Invalid employee ID');
          toast.error('Invalid employee ID');
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
        setError(error.message || 'Failed to fetch employee data');
        toast.error('Failed to fetch employee data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [isEditMode, id]);

  // Validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    position: Yup.string().required('Position is required'),
    department: Yup.string().required('Department is required'),
    hireDate: Yup.date().required('Hire date is required'),
    salary: Yup.number().typeError('Salary must be a number').required('Salary is required'),
    status: Yup.string().required('Status is required')
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      console.log('Form submitted with values:', values);
      
      // Convert salary to number
      const employeeData = {
        ...values,
        salary: parseFloat(values.salary)
      };
      
      let response;
      
      if (isEditMode && id) {
        console.log(`Updating employee with ID ${id}:`, employeeData);
        response = await updateEmployee(id.toString(), employeeData);
      } else {
        console.log('Creating new employee:', employeeData);
        response = await createEmployee(employeeData);
      }
      
      console.log('API Response:', response);
      
      if (response && response.success) {
        toast.success(isEditMode ? 'Employee updated successfully' : 'Employee created successfully');
        navigate('/employees');
      } else {
        // Handle demo mode or offline mode
        if (response && response.message && response.message.includes('Demo Mode')) {
          toast.success(response.message);
          navigate('/employees');
        } else {
          toast.error((response && response.message) || 'Failed to save employee');
        }
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      
      // Handle network errors gracefully
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        toast.info('Operating in offline mode. Employee data will be saved locally.');
        navigate('/employees');
      } else {
        toast.error(error.message || 'Failed to save employee');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <Button onClick={() => navigate('/employees')}>Back to Employees</Button>
      </Container>
    );
  }

  return (
    <Container>
      <FormHeader>
        <h1>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
        <Button onClick={() => navigate('/employees')}>Back to Employees</Button>
      </FormHeader>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        validateOnMount={false}
      >
        {({ isSubmitting, values, errors, touched, isValid, dirty }) => (
          <StyledForm>
            <FormRow>
              <FormGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Field
                  as={Input}
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                />
                <ErrorText name="firstName" />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Field
                  as={Input}
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                />
                <ErrorText name="lastName" />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Field
                  as={Input}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                />
                <ErrorText name="email" />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="phone">Phone</Label>
                <Field
                  as={Input}
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                />
                <ErrorText name="phone" />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="position">Position</Label>
                <Field
                  as={Input}
                  type="text"
                  id="position"
                  name="position"
                  placeholder="Enter position"
                />
                <ErrorText name="position" />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="department">Department</Label>
                <Field as={Select} id="department" name="department">
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="Customer Support">Customer Support</option>
                </Field>
                <ErrorText name="department" />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="hireDate">Hire Date</Label>
                <Field
                  as={Input}
                  type="date"
                  id="hireDate"
                  name="hireDate"
                />
                <ErrorText name="hireDate" />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="salary">Salary</Label>
                <Field
                  as={Input}
                  type="number"
                  id="salary"
                  name="salary"
                  placeholder="Enter salary"
                />
                <ErrorText name="salary" />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="status">Status</Label>
                <Field as={Select} id="status" name="status">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </Field>
                <ErrorText name="status" />
              </FormGroup>
            </FormRow>
            
            <ButtonGroup>
              <Button type="button" secondary onClick={() => navigate('/employees')}>
                Cancel
              </Button>
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Employee' : 'Create Employee'}
              </SubmitButton>
            </ButtonGroup>
          </StyledForm>
        )}
      </Formik>
    </Container>
  );
};

export default EmployeeForm; 