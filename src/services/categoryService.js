import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const categoryAPI = axios.create({
  baseURL: `${API_URL}/api/categories`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await categoryAPI.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get featured categories
export const getFeaturedCategories = async () => {
  try {
    const response = await categoryAPI.get('/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    throw error;
  }
};

// Get single category
export const getCategory = async (id) => {
  try {
    const response = await categoryAPI.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  try {
    const response = await categoryAPI.get(`/slug/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    throw error;
  }
};

export default {
  getAllCategories,
  getFeaturedCategories,
  getCategory,
  getCategoryBySlug,
};