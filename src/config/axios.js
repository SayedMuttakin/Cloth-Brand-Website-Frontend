import axios from 'axios';
import { getToken } from '../services/authService';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
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
