import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Admin Login function
export const adminLogin = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Admin login failed');
    }

    const data = await response.json();
    
    // Store the admin token in localStorage
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', JSON.stringify(data.admin));
    
    return data;
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// Check if admin is logged in
export const isAdminAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

// Get current admin user
export const getCurrentAdmin = () => {
  const admin = localStorage.getItem('adminUser');
  return admin ? JSON.parse(admin) : null;
};

// Admin Logout function
export const adminLogout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  window.location.href = '/admin/login';
};

// Get admin auth token
export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

// Forgot Password for Admin
export const adminForgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/forgotPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Forgot password request failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Admin forgot password error:', error);
    throw error;
  }
};

// Reset Password for Admin
export const adminResetPassword = async (token, password, passwordConfirm) => {
  try {
    const response = await fetch(`${API_URL}/api/admin/resetPassword/${token}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, passwordConfirm }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Reset password failed');
    }

    const data = await response.json();
    // Optionally, log in the admin after successful password reset
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', JSON.stringify(data.admin));
    return data;
  } catch (error) {
    console.error('Admin reset password error:', error);
    throw error;
  }
}; 