import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

// Demo credentials
const DEMO_CREDENTIALS = {
  email: 'admin@example.com',
  password: 'admin123'
};

// Demo user with admin privileges
const DEMO_USER = {
  _id: 'demo123',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  role: 'admin',
  isAdmin: true
};

// Force admin status for demo user
const forceAdminStatus = (user) => {
  if (user && user.email === 'admin@example.com') {
    return {
      ...user,
      role: 'admin',
      isAdmin: true
    };
  }
  return user;
};

// Save user to localStorage with admin status check
const saveUserToLocalStorage = (user, token) => {
  // Ensure admin status for demo user
  const enhancedUser = forceAdminStatus(user);
  
  // Save to localStorage
  localStorage.setItem(USER_KEY, JSON.stringify(enhancedUser));
  localStorage.setItem(TOKEN_KEY, token);
  
  console.log('User saved to localStorage:', enhancedUser);
  console.log('Token saved to localStorage:', token);
  
  return enhancedUser;
};

export const registerUser = async (userData) => {
  try {
    console.log('Registering user with data:', userData);
    const response = await axios.post(`${API_URL}/register`, userData);
    
    if (response.data.success) {
      // Store token and user data
      saveUserToLocalStorage(response.data.user, response.data.token);
      console.log('User registered successfully:', response.data.user);
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    
    // If server is unavailable, simulate registration for demo
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend unavailable, simulating registration');
      
      // Create a demo user (non-admin)
      const demoUser = {
        _id: 'user' + Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: 'user',
        isAdmin: false
      };
      
      // Store demo user
      const token = 'demo_token_' + Date.now();
      saveUserToLocalStorage(demoUser, token);
      
      return {
        success: true,
        message: 'Registration successful (Demo Mode)',
        user: demoUser,
        token: token
      };
    }
    
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    console.log('Login attempt with:', credentials);
    
    // Check for demo credentials
    if (credentials.email === DEMO_CREDENTIALS.email && 
        credentials.password === DEMO_CREDENTIALS.password) {
      console.log('Using demo credentials');
      
      // Store demo user and token
      const token = 'demo_admin_token_' + Date.now();
      saveUserToLocalStorage(DEMO_USER, token);
      
      return {
        success: true,
        message: 'Login successful (Demo Mode)',
        user: DEMO_USER,
        token: token
      };
    }
    
    // Try regular login with backend
    const response = await axios.post(`${API_URL}/login`, credentials);
    
    if (response.data.success) {
      // Store token and user data with admin check
      const enhancedUser = saveUserToLocalStorage(response.data.user, response.data.token);
      console.log('User logged in successfully:', enhancedUser);
      
      return {
        ...response.data,
        user: enhancedUser
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    
    // If server is unavailable but using demo credentials
    if ((error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') && 
        credentials.email === DEMO_CREDENTIALS.email && 
        credentials.password === DEMO_CREDENTIALS.password) {
      
      console.log('Backend unavailable, using demo admin credentials');
      
      // Store demo admin user
      const token = 'demo_admin_token_' + Date.now();
      saveUserToLocalStorage(DEMO_USER, token);
      
      return {
        success: true,
        message: 'Login successful (Demo Mode)',
        user: DEMO_USER,
        token: token
      };
    }
    
    // If server is unavailable but not using demo credentials
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return {
        success: false,
        message: 'Server unavailable. Please use demo credentials: admin@example.com / admin123'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid credentials'
    };
  }
};

export const logoutUser = async () => {
  try {
    // Clear local storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Try to call logout endpoint if available
    try {
      await axios.post(`${API_URL}/logout`);
      console.log('User logged out successfully (server)');
    } catch (error) {
      console.log('Backend logout failed, but local logout successful');
    }
    
    return {
      success: true,
      message: 'Logout successful'
    };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Ensure local storage is cleared even if API call fails
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    return {
      success: true,
      message: 'Logged out (local only)'
    };
  }
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  
  try {
    const user = JSON.parse(userJson);
    // Always ensure admin status for demo user
    const enhancedUser = forceAdminStatus(user);
    
    // If user was enhanced, update localStorage
    if (user.email === 'admin@example.com' && 
        (!user.isAdmin || user.role !== 'admin')) {
      localStorage.setItem(USER_KEY, JSON.stringify(enhancedUser));
    }
    
    console.log('Current user from localStorage:', enhancedUser);
    return enhancedUser;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

export const getAuthToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  
  // If no token but user exists, create a demo token
  if (!token && getCurrentUser()) {
    const newToken = 'demo_token_' + Date.now();
    localStorage.setItem(TOKEN_KEY, newToken);
    console.log('Created new demo token:', newToken);
    return newToken;
  }
  
  return token;
};

// Add auth token to all axios requests
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); 