import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Create a custom event for auth state changes
const authStateChanged = new EventTarget();

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      // Dispatch auth state change event
      authStateChanged.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: response.data.data.user
      }));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

// Login function
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      // Dispatch auth state change event
      authStateChanged.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: response.data.data.user
      }));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

// Check if user is logged in
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // You might want to redirect to login page here
  window.location.href = '/auth/login';
};

// For testing/development - Set a temporary token
export const setTempAuthToken = () => {
  const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.4Vx2Zf6RKEQVbJ8zeNPavQXESZnHIbqzDgn9wZzqEw0';
  localStorage.setItem('token', tempToken);
  localStorage.setItem('user', JSON.stringify({
    id: '1',
    name: 'Admin User',
    role: 'admin'
  }));
  return tempToken;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Subscribe to auth state changes
export const onAuthStateChanged = (callback) => {
  const handler = (event) => callback(event.detail);
  authStateChanged.addEventListener('authStateChanged', handler);
  return () => authStateChanged.removeEventListener('authStateChanged', handler);
};

export const isAdmin = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.isAdmin === true;
  } catch (error) {
    return false;
  }
}; 