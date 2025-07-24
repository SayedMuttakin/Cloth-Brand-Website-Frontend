import axios from 'axios';

const API_URL = '/api';

// Create axios instance with default config
const reviewAPI = axios.create({
  baseURL: `${API_URL}/reviews`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
reviewAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
reviewAPI.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Get reviews for a product
export const getProductReviews = async (productId, params = {}) => {
  try {
    // Check if productId is a simple number (mock product)
    if (typeof productId === 'number' || (typeof productId === 'string' && /^\d+$/.test(productId))) {
      console.log('Mock product detected, returning mock reviews for productId:', productId);
      
      // Import mock reviews dynamically
      const { mockReviews } = await import('../data/mockReviews');
      const reviews = mockReviews[productId] || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;
      
      return {
        status: 'success',
        data: {
          reviews,
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10
        }
      };
    }

    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params.rating) queryParams.append('rating', params.rating);

    const queryString = queryParams.toString();
    const url = `/product/${productId}${queryString ? `?${queryString}` : ''}`;
    
    return await reviewAPI.get(url);
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    // Return empty reviews on error instead of throwing
    return {
      status: 'success',
      data: {
        reviews: [],
        totalReviews: 0,
        averageRating: 0
      }
    };
  }
};

// Create a new review
export const createReview = async (productId, reviewData) => {
  try {
    // Check if productId is a simple number (mock product)
    if (typeof productId === 'number' || (typeof productId === 'string' && /^\d+$/.test(productId))) {
      console.log('Mock product detected, simulating review creation for productId:', productId);
      
      // Simulate successful review creation for mock products
      const newReview = {
        _id: 'mock_review_' + Date.now(),
        rating: reviewData.rating,
        comment: reviewData.comment,
        title: reviewData.title || '',
        user: { name: 'Demo User' },
        createdAt: new Date().toISOString()
      };
      
      return {
        status: 'success',
        message: 'Review submitted successfully! (Demo mode)',
        data: {
          review: newReview
        }
      };
    }

    return await reviewAPI.post(`/product/${productId}`, reviewData);
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
  try {
    return await reviewAPI.put(`/${reviewId}`, reviewData);
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    return await reviewAPI.delete(`/${reviewId}`);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Mark review as helpful
export const markReviewHelpful = async (reviewId) => {
  try {
    return await reviewAPI.post(`/${reviewId}/helpful`);
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    throw error;
  }
};

export default {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful
};