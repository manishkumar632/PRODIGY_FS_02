import axiosInstance from './axiosConfig';

const API_ENDPOINT = '/employees';

// Sample employee data for fallback when backend is unavailable
const SAMPLE_EMPLOYEES = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    position: 'Software Developer',
    department: 'Engineering',
    hireDate: '2022-01-15',
    salary: 85000,
    status: 'Active'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    position: 'HR Manager',
    department: 'Human Resources',
    hireDate: '2021-08-10',
    salary: 75000,
    status: 'Active'
  },
  {
    id: 3,
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@example.com',
    phone: '555-123-4567',
    position: 'Marketing Specialist',
    department: 'Marketing',
    hireDate: '2022-03-22',
    salary: 65000,
    status: 'Active'
  }
];

// Store employees in memory for demo mode
let inMemoryEmployees = [...SAMPLE_EMPLOYEES];

// Get all employees
export const getEmployees = async () => {
  try {
    console.log('Fetching employees...');
    const response = await axiosInstance.get(API_ENDPOINT);
    console.log('Employees fetched successfully:', response.data);
    
    // Ensure we return an array of employees
    if (response.data && response.data.success) {
      return {
        success: true,
        count: Array.isArray(response.data.data) ? response.data.data.length : 0,
        data: Array.isArray(response.data.data) ? response.data.data : []
      };
    }
    
    // If response format is unexpected, return empty array
    return {
      success: false,
      count: 0,
      data: [],
      message: 'Invalid response format from server'
    };
  } catch (error) {
    console.error('Error fetching employees:', error);
    
    // If backend is unavailable, return in-memory data
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend unavailable, using in-memory employee data');
      return {
        success: true,
        count: inMemoryEmployees.length,
        data: inMemoryEmployees
      };
    }
    
    // Return empty array with success false to prevent UI errors
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch employees',
      data: [],
      count: 0
    };
  }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  try {
    if (!id) {
      console.error('Invalid employee ID:', id);
      return {
        success: false,
        message: 'Invalid employee ID',
        data: null
      };
    }

    console.log(`Fetching employee with ID ${id}...`);
    const response = await axiosInstance.get(`${API_ENDPOINT}/${id}`);
    console.log('Employee fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    
    // If backend is unavailable, return from in-memory data
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      const employee = inMemoryEmployees.find(emp => 
        emp.id === parseInt(id) || 
        emp._id === id || 
        emp.id === id
      );
      
      if (employee) {
        console.log('Using in-memory employee data for ID:', id);
        return {
          success: true,
          data: employee
        };
      }
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch employee',
      data: null
    };
  }
};

// Create new employee
export const createEmployee = async (employeeData) => {
  try {
    console.log('Creating employee with data:', employeeData);
    const response = await axiosInstance.post(API_ENDPOINT, employeeData);
    console.log('Employee created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    
    // If backend is unavailable, simulate successful creation
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend unavailable, simulating employee creation');
      const newId = Math.floor(Math.random() * 1000) + 10;
      const newEmployee = {
        id: newId,
        ...employeeData,
        status: employeeData.status || 'Active',
        createdAt: new Date().toISOString()
      };
      
      // Add to in-memory data
      inMemoryEmployees.unshift(newEmployee);
      
      return {
        success: true,
        data: newEmployee,
        message: 'Employee created successfully (Demo Mode)'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create employee'
    };
  }
};

// Update employee
export const updateEmployee = async (id, employeeData) => {
  try {
    console.log(`Updating employee with ID ${id}:`, employeeData);
    
    // Ensure we have a valid ID
    if (!id) {
      console.error('Invalid employee ID for update:', id);
      return {
        success: false,
        message: 'Invalid employee ID'
      };
    }
    
    // Make API call
    const response = await axiosInstance.put(`${API_ENDPOINT}/${id}`, employeeData);
    console.log('Employee updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee with ID ${id}:`, error);
    
    // If backend is unavailable, simulate successful update
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend unavailable, simulating employee update');
      
      // Find and update in in-memory data
      const index = inMemoryEmployees.findIndex(emp => 
        emp.id === parseInt(id) || 
        emp._id === id || 
        emp.id === id
      );
      
      if (index !== -1) {
        console.log(`Found employee at index ${index}, updating...`);
        const updatedEmployee = {
          ...inMemoryEmployees[index],
          ...employeeData,
          id: inMemoryEmployees[index].id,
          _id: inMemoryEmployees[index]._id,
          updatedAt: new Date().toISOString()
        };
        
        inMemoryEmployees[index] = updatedEmployee;
        
        return {
          success: true,
          data: updatedEmployee,
          message: 'Employee updated successfully (Demo Mode)'
        };
      } else {
        console.log(`Employee with ID ${id} not found, creating new...`);
        // If not found, create new
        return createEmployee(employeeData);
      }
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update employee'
    };
  }
};

// Delete employee
export const deleteEmployee = async (id) => {
  try {
    console.log(`Deleting employee with ID ${id}...`);
    
    // Ensure we have a valid ID
    if (!id) {
      console.error('Invalid employee ID for deletion:', id);
      return {
        success: false,
        message: 'Invalid employee ID'
      };
    }
    
    // Make API call
    const response = await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
    console.log('Employee deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee with ID ${id}:`, error);
    
    // If backend is unavailable, simulate successful deletion
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend unavailable, simulating employee deletion');
      
      // Remove from in-memory data
      const initialLength = inMemoryEmployees.length;
      inMemoryEmployees = inMemoryEmployees.filter(emp => 
        emp.id !== parseInt(id) && 
        emp._id !== id && 
        emp.id !== id
      );
      
      const wasDeleted = initialLength > inMemoryEmployees.length;
      
      if (wasDeleted) {
        console.log(`Employee with ID ${id} was deleted from in-memory data`);
        return {
          success: true,
          message: 'Employee deleted successfully (Demo Mode)'
        };
      } else {
        console.log(`Employee with ID ${id} not found in in-memory data`);
        return {
          success: false,
          message: 'Employee not found'
        };
      }
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete employee'
    };
  }
}; 