import axios from 'axios';
import { getToken } from '../services/authService';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log('SENT AUTH TOKEN:', token); // 🔍 Debug token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
