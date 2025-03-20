import axios from 'axios';
import { toast } from 'react-toastify';

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  // Increase timeout for slow connections
  timeout: 10000
});

// Helper function to get auth token from localStorage
const getTokenFromStorage = () => {
  return localStorage.getItem('auth_token');
};

// Add a request interceptor to include auth token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token directly from localStorage instead of importing from authService
    const token = getTokenFromStorage();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(`Adding auth token to request: ${config.method?.toUpperCase() || 'GET'} ${config.url}`);
    }
    
    // Log the request for debugging
    console.log(`API Request: ${config.method?.toUpperCase() || 'GET'} ${config.url}`, config.data || {});
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`API Response [${response.config.method?.toUpperCase() || 'GET'}] ${response.config.url}:`, 
      response.status, response.data);
    return response;
  },
  (error) => {
    // If the request was cancelled by axios, don't show an error
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
      return Promise.reject(error);
    }
    
    console.error('API Error:', error);
    
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Network error - backend may be unavailable');
      toast.info('Operating in offline mode. Backend server is unavailable.');
      
      // Create a mock successful response for demo mode
      const mockResponse = {
        data: {
          success: true,
          message: 'Operation successful (Demo Mode)',
          data: {}
        }
      };
      
      // Return the mock response to prevent errors
      return Promise.resolve(mockResponse);
    }
    
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access - token may be invalid');
      toast.error('Your session has expired. Please log in again.');
      // You could redirect to login or refresh token here
    }
    
    // Handle forbidden errors (403)
    if (error.response && error.response.status === 403) {
      console.log('Forbidden access - insufficient permissions');
      toast.error('You do not have permission to perform this action.');
    }
    
    return Promise.reject(error);
  }
);

// For debugging purposes, log the current token
console.log('Current auth token:', getTokenFromStorage());

export default axiosInstance; 