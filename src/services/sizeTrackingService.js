import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generate a session ID for tracking
const getSessionId = () => {
  let sessionId = localStorage.getItem('sizeTrackingSessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sizeTrackingSessionId', sessionId);
  }
  return sessionId;
};

// Track size interaction
export const trackSizeInteraction = async (productId, sizeName, action) => {
  try {
    // Check if productId is a simple number (mock product)
    if (typeof productId === 'number' || (typeof productId === 'string' && /^\d+$/.test(productId))) {
      console.log('Mock product detected, simulating size tracking for productId:', productId, 'action:', action);
      // Return mock success response for mock products
      return {
        status: 'success',
        message: 'Size interaction tracked (demo mode)',
        data: {
          productId,
          sizeName,
          action,
          timestamp: new Date().toISOString()
        }
      };
    }

    const sessionId = getSessionId();
    
    const payload = {
      productId: String(productId), // Ensure productId is a string
      sizeName,
      action, // 'view', 'select', 'add_to_cart', 'purchase'
      sessionId
    };

    console.log('Tracking size interaction:', payload);
    
    const response = await axios.post(`${API_BASE_URL}/size-analytics/track`, payload);

    console.log('Size tracking response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error tracking size interaction:', error);
    console.error('Error details:', error.response?.data);
    // Don't throw error to avoid breaking user experience
    return null;
  }
};

// Track when user views a product with sizes
export const trackSizeView = (productId, sizes) => {
  if (!sizes || sizes.length === 0) return;
  
  sizes.forEach(size => {
    const sizeName = typeof size === 'string' ? size : size.name || size;
    trackSizeInteraction(productId, sizeName, 'view');
  });
};

// Track when user selects a specific size
export const trackSizeSelection = (productId, sizeName) => {
  trackSizeInteraction(productId, sizeName, 'select');
};

// Track when user adds product with specific size to cart
export const trackSizeAddToCart = (productId, sizeName) => {
  trackSizeInteraction(productId, sizeName, 'add_to_cart');
};

// Track when user purchases product with specific size
export const trackSizePurchase = (productId, sizeName) => {
  trackSizeInteraction(productId, sizeName, 'purchase');
};

// Track combined color and size selection for comprehensive analytics
export const trackColorSizeSelection = async (productId, colorName, colorHex, sizeName) => {
  try {
    // Check if productId is a simple number (mock product)
    if (typeof productId === 'number' || (typeof productId === 'string' && /^\d+$/.test(productId))) {
      console.log('Mock product detected, simulating color-size tracking for productId:', productId);
      return {
        status: 'success',
        message: 'Color-size combination tracked (demo mode)',
        data: {
          productId,
          colorName,
          colorHex,
          sizeName,
          timestamp: new Date().toISOString()
        }
      };
    }

    const sessionId = getSessionId();
    
    const payload = {
      productId: String(productId),
      colorName,
      colorHex,
      sizeName,
      action: 'color_size_combination',
      sessionId
    };

    console.log('Tracking color-size combination:', payload);
    
    const response = await axios.post(`${API_BASE_URL}/product-analytics/track-combination`, payload);

    console.log('Color-size tracking response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error tracking color-size combination:', error);
    // Don't throw error to avoid breaking user experience
    return null;
  }
};