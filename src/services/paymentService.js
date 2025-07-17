import api from '../config/axios';

export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (amount, currency = 'usd', orderId = null) => {
    try {
      const response = await api.post('/payment/create-payment-intent', {
        amount,
        currency,
        orderId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment intent');
    }
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, orderId) => {
    try {
      const response = await api.post('/payment/confirm-payment', {
        paymentIntentId,
        orderId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to confirm payment');
    }
  },

  // Create Stripe customer
  createCustomer: async (email, name) => {
    try {
      const response = await api.post('/payment/create-customer', {
        email,
        name
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create customer');
    }
  },

  // Get payment methods
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payment/payment-methods');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get payment methods');
    }
  },

  // Save payment method
  savePaymentMethod: async (paymentMethodId) => {
    try {
      const response = await api.post('/payment/save-payment-method', {
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save payment method');
    }
  },

  // Process refund
  processRefund: async (paymentIntentId, amount = null, reason = 'requested_by_customer') => {
    try {
      const response = await api.post('/payment/refund', {
        paymentIntentId,
        amount,
        reason
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to process refund');
    }
  }
};

export default paymentService;