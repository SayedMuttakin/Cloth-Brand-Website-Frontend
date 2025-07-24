import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Default categories with valid MongoDB ObjectIds
const DEFAULT_CATEGORIES = [
  { id: "507f1f77bcf86cd799439011", name: "Men's Fashion" },
  { id: "507f1f77bcf86cd799439012", name: "Women's Fashion" },
  { id: "507f1f77bcf86cd799439013", name: "Electronics" },
  { id: "507f1f77bcf86cd799439014", name: "Home & Living" },
  { id: "507f1f77bcf86cd799439015", name: "Sports & Outdoors" },
  { id: "507f1f77bcf86cd799439016", name: "Beauty & Health" },
  { id: "507f1f77bcf86cd799439017", name: "Books & Stationery" },
  { id: "507f1f77bcf86cd799439018", name: "Toys & Games" },
  { id: "507f1f77bcf86cd799439019", name: "Jewelry & Accessories" },
  { id: "507f1f77bcf86cd799439020", name: "Footwear" }
];

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('adminToken');

// Helper function to create headers with auth token
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (response.status === 401) {
    // Check if it's an admin authentication error
    if (data.message.includes('admin') || data.message.includes('Invalid token')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
      throw new Error('Your admin session has expired. Please login again.');
    }
  }
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Get all products (with filters)
export const getProducts = async (filters = {}) => {
  try {
    // Remove empty filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});

    const queryParams = new URLSearchParams(cleanFilters);
    const response = await fetch(`${API_URL}/api/products${queryParams.toString() ? `?${queryParams}` : ''}`, {
      headers: getHeaders()
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty products array on error
    return { data: { products: [] } };
  }
};

// Create new product
export const createProduct = async (productData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Get product categories
export const getCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/categories`, {
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    
    // If API returns categories, use them
    if (data.data.categories && data.data.categories.length > 0) {
      return {
        data: {
          categories: data.data.categories.map(cat => ({
            id: cat._id,
            name: cat.name
          }))
        }
      };
    }
    
    // If no categories from API, use default categories
    return {
      data: {
        categories: DEFAULT_CATEGORIES
      }
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default categories on error
    return {
      data: {
        categories: DEFAULT_CATEGORIES
      }
    };
  }
};

// Upload image
export const uploadImage = async (formData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    return await axios.post(`${API_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get all admins
export const getAllAdmins = async () => {
  try {
    const response = await fetch(`${API_URL}/admin/manage`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};

// Create a new admin
export const createAdmin = async (adminData) => {
  try {
    const response = await fetch(`${API_URL}/admin/manage`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(adminData)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};

// Update an admin
export const updateAdmin = async (adminId, adminData) => {
  try {
    const response = await fetch(`${API_URL}/admin/manage/${adminId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(adminData)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error updating admin:', error);
    throw error;
  }
};

// Delete an admin
export const deleteAdmin = async (adminId) => {
  try {
    const response = await fetch(`${API_URL}/admin/manage/${adminId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    // For 204 No Content response
    if (response.status === 204) {
      return { success: true };
    }
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
}; 