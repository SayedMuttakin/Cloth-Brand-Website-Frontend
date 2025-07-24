const API_URL = '/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('userToken');

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (response.status === 401) {
    // Check if it's a user authentication error
    if (data.message.includes('user') || data.message.includes('Invalid token')) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      // Optionally redirect to login page for users
      // window.location.href = '/login';
      throw new Error('Your user session has expired. Please login again.');
    }
  }
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Get all products
export const getProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filter params
    if (params.category) queryParams.append('category', params.category);
    if (params.colors && params.colors.length) queryParams.append('colors', params.colors.join(','));
    if (params.sizes && params.sizes.length) queryParams.append('sizes', params.sizes.join(','));
    if (params.brand) queryParams.append('brand', params.brand);
    if (params.priceRange) queryParams.append('priceRange', params.priceRange);
    
    // Add pagination and sorting params
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);

    console.log('Fetching products with URL:', `${API_URL}/products?${queryParams}`);
    
    const response = await fetch(`${API_URL}/products?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'Failed to fetch products');
    }

    const data = await response.json();
    console.log('Products API Response:', data);

    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      status: 'fail',
      results: 0,
      data: { products: [] },
      total: 0
    };
  }
};

// Get product filters
export const getProductFilters = async () => {
  try {
    const response = await fetch(`${API_URL}/products/filters`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch product filters');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product filters:', error);
    return {
      status: 'fail',
      data: {
        categories: [],
        colors: [],
        sizes: [],
        brands: [],
        priceRanges: []
      }
    };
  }
};

// Get single product by ID
export const getProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching product in productService:', error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products/featured`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return {
      status: 'fail',
      data: { products: [] }
    };
  }
};

// Get new arrivals
export const getNewArrivals = async () => {
  try {
    const response = await fetch(`${API_URL}/products/new-arrivals`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch new arrivals');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return {
      status: 'fail',
      data: { products: [] }
    };
  }
};

export const getPopularProducts = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/popular`);
  return response.json();
};

// Get products by category
export const getProductsByCategory = async (categorySlug) => {
  try {
    const response = await fetch(`${API_URL}/products?category=${categorySlug}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return {
      status: 'fail',
      data: { products: [] }
    };
  }
};

// Search products
export const searchProducts = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return {
        status: 'success',
        results: 0,
        data: { products: [] }
      };
    }

    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      status: 'fail',
      results: 0,
      data: { products: [] }
    };
  }
};