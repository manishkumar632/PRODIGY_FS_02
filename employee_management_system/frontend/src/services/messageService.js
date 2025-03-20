import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

const API_URL = 'http://localhost:5000/api/messages';

// Send a message from contact form
export const sendMessage = async (messageData) => {
  try {
    const response = await axios.post(API_URL, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    
    // If server is unavailable, simulate message sending for demo
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.log('Backend unavailable, simulating message sending');
      
      // Create a demo message response
      return {
        success: true,
        message: 'Message sent successfully (Demo Mode)',
        data: {
          ...messageData,
          _id: 'demo_' + Date.now(),
          status: 'unread',
          createdAt: new Date().toISOString(),
          replies: []
        }
      };
    }
    
    throw error.response?.data || error;
  }
};

// Get all messages (admin only)
export const getAllMessages = async (status = '') => {
  try {
    const config = getAuthHeader();
    const response = await axios.get(`${API_URL}${status ? `?status=${status}` : ''}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get messages for a specific user
export const getUserMessages = async (userId) => {
  try {
    const config = getAuthHeader();
    const response = await axios.get(`${API_URL}/user/${userId}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get a single message by ID
export const getMessageById = async (id) => {
  try {
    const config = getAuthHeader();
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create a new message
export const createMessage = async (messageData) => {
  try {
    const response = await axios.post(API_URL, messageData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update message status (mark as read/unread)
export const updateMessageStatus = async (id, status) => {
  try {
    const config = getAuthHeader();
    const response = await axios.put(`${API_URL}/${id}/status`, { status }, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Add a reply to a message
export const addReply = async (id, replyData) => {
  try {
    const config = getAuthHeader();
    const response = await axios.post(`${API_URL}/${id}/reply`, replyData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Mark replies as read
export const markRepliesAsRead = async (id) => {
  try {
    const config = getAuthHeader();
    const response = await axios.put(`${API_URL}/${id}/mark-replies-read`, {}, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete a message (admin only)
export const deleteMessage = async (id) => {
  try {
    const config = getAuthHeader();
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete all messages for a user (admin only)
export const deleteAllUserMessages = async (userId) => {
  try {
    const config = getAuthHeader();
    const response = await axios.delete(`${API_URL}/user/${userId}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}; 