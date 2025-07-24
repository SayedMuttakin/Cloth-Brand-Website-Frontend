import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generate a session ID for tracking
const getSessionId = () => {
  let sessionId = localStorage.getItem('colorTrackingSessionId');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('colorTrackingSessionId', sessionId);
  }
  return sessionId;
};

// Track color interaction
export const trackColorInteraction = async (productId, colorName, colorHex, action) => {
  try {
    // Check if productId is a simple number (mock product)
    if (typeof productId === 'number' || (typeof productId === 'string' && /^\d+$/.test(productId))) {
      console.log('Mock product detected, simulating color tracking for productId:', productId, 'action:', action);
      // Return mock success response for mock products
      return {
        status: 'success',
        message: 'Color interaction tracked (demo mode)',
        data: {
          productId,
          colorName,
          colorHex,
          action,
          timestamp: new Date().toISOString()
        }
      };
    }

    const sessionId = getSessionId();
    
    const payload = {
      productId: String(productId), // Ensure productId is a string
      colorName,
      colorHex,
      action, // 'view', 'select', 'add_to_cart', 'purchase'
      sessionId
    };

    console.log('Tracking color interaction:', payload);
    
    const response = await axios.post(`${API_BASE_URL}/color-analytics/track`, payload);

    console.log('Color tracking response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error tracking color interaction:', error);
    console.error('Error details:', error.response?.data);
    // Don't throw error to avoid breaking user experience
    return null;
  }
};

// Track when user views a product with colors
export const trackColorView = (productId, colors) => {
  if (!colors || colors.length === 0) return;
  
  colors.forEach(color => {
    const colorName = typeof color === 'string' ? color : color.name;
    const colorHex = typeof color === 'string' ? getColorHex(color) : color.hex;
    
    trackColorInteraction(productId, colorName, colorHex, 'view');
  });
};

// Track when user selects a specific color
export const trackColorSelection = (productId, colorName, colorHex) => {
  trackColorInteraction(productId, colorName, colorHex, 'select');
};

// Track when user adds product with specific color to cart
export const trackColorAddToCart = (productId, colorName, colorHex) => {
  trackColorInteraction(productId, colorName, colorHex, 'add_to_cart');
};

// Track when user purchases product with specific color
export const trackColorPurchase = (productId, colorName, colorHex) => {
  trackColorInteraction(productId, colorName, colorHex, 'purchase');
};

// Helper function to get hex color from color name
const getColorHex = (colorName) => {
  const colorMap = {
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#008000',
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'brown': '#A52A2A',
    'black': '#000000',
    'white': '#FFFFFF',
    'gray': '#808080',
    'grey': '#808080',
    'navy': '#000080',
    'tan': '#D2B48C',
    'beige': '#F5F5DC',
    'maroon': '#800000',
    'olive': '#808000',
    'lime': '#00FF00',
    'aqua': '#00FFFF',
    'teal': '#008080',
    'silver': '#C0C0C0',
    'gold': '#FFD700'
  };
  
  return colorMap[colorName.toLowerCase()] || '#000000';
};