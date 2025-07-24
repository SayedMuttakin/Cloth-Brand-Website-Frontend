import axios from 'axios';
import { getAdminToken } from '../services/adminAuthService';

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Attach admin token to every request
adminApi.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default adminApi;
