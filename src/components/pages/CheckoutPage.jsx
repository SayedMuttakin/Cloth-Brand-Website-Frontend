import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import StripePaymentForm from '../payment/StripePaymentForm';
import { paymentService } from '../../services/paymentService';
import toast from 'react-hot-toast';
import { getToken, isAuthenticated } from '../../services/authService';
import api from '../../config/axios';

const paymentMethods = [
  { value: 'cod', label: 'Cash on Delivery' },
  { value: 'stripe', label: 'Credit/Debit Card' },
];

// Utility function to check for valid MongoDB ObjectId
function isValidObjectId(id) {
  return typeof id === 'string' && id.length === 24 && /^[a-fA-F0-9]+$/.test(id);
}

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    email: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Calculate totals from actual cart data
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10.00; // Free shipping over $100
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  // Check if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.address.trim()) newErrors.address = 'Address is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrder = async (paymentMethodType = 'cash_on_delivery', paymentStatus = 'pending') => {
    const orderData = {
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      },
      items: cartItems.map(item => ({
        product: item._id || item.id,
        quantity: item.quantity,
        price: item.price,
        ...(item.color && { color: item.color }),
        ...(item.size && { size: item.size })
      })),
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        state: formData.city,
        zipCode: formData.zip,
        country: 'US'
      },
      paymentMethod: paymentMethodType,
      paymentStatus: paymentStatus,
      totalAmount: total,
      shippingCost: shipping,
      tax: tax
    };

    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to create order');
      }
      throw error;
    }
  };

  const createPaymentIntent = async (orderId) => {
    try {
      const response = await paymentService.createPaymentIntent(total, 'usd', orderId);
      setClientSecret(response.clientSecret);
      setPaymentIntentId(response.paymentIntentId);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to create payment intent');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (paymentIntentId && currentOrder) {
        await paymentService.confirmPayment(paymentIntentId, currentOrder.data.order._id);
        toast.success('🎉 Payment Successful! Your order has been confirmed and will be processed shortly.', {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        clearCart();
        navigate('/order-confirmation');
      }
    } catch (error) {
      toast.error('Payment confirmation failed');
      console.error('Payment confirmation error:', error);
    }
  };

  const handlePaymentError = (error) => {
    setError(error.message || 'Payment failed');
    console.error('Payment error:', error);
  };

  useEffect(() => {
    const processStripePayment = async () => {
      if (paymentMethod === 'stripe' && validateForm()) {
        setIsLoading(true);
        setError(null);
        try {
          // Only create order and payment intent if they don't exist yet
          if (!currentOrder || !clientSecret) {
            const orderResult = await createOrder('stripe', 'pending');
            setCurrentOrder(orderResult);
            await createPaymentIntent(orderResult.data.order._id);
            // toast.success('✅ Order created! Please enter your card details below to complete payment.', {
            //   duration: 3000,
            // });
          }
        } catch (err) {
          const errorMessage = err.message || 'Order failed. Please try again.';
          setError(errorMessage);
          toast.error(errorMessage);
          console.error('Order error:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    processStripePayment();
  }, [paymentMethod, formData]); // Add formData to dependency array so it re-runs if form data changes and payment method is stripe

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Prevent order if any cart item is not a valid ObjectId (i.e., mock/hardcoded product)
    const hasInvalidProduct = cartItems.some(
      item => !isValidObjectId(item._id || item.id)
    );
    if (hasInvalidProduct) {
      toast.error('Some products in your cart cannot be ordered.');
      setError('Some products in your cart cannot be ordered.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (paymentMethod === 'cod') {
        // Handle Cash on Delivery
        const result = await createOrder('cash_on_delivery', 'pending');
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/order-confirmation');
      } else if (paymentMethod === 'stripe') {
        // If Stripe is selected, the useEffect above should have already created the order and payment intent.
        // Here, we just ensure the form is valid and the Stripe form is displayed.
        // The actual payment submission will happen within StripePaymentForm.
        // If clientSecret is not yet available, it means the useEffect is still running or failed.
        if (!clientSecret) {
          toast.error('Please wait while we prepare the payment form, or try again.');
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Order failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Order error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading if cart is being checked
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Checking cart...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen mt-2 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Checkout</h1>
          <p className="text-indigo-200/60 max-w-2xl mx-auto text-lg">Complete your purchase securely and efficiently</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8 space-x-4">
          <div className="flex items-center">
            <CheckCircleIcon className="h-6 w-6 text-indigo-500" />
            <span className="ml-2 text-indigo-200/60">Shipping</span>
          </div>
          <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
          <div className="flex items-center">
            <CreditCardIcon className="h-6 w-6 text-indigo-500" />
            <span className="ml-2 text-indigo-200/60">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form Section */}
          <div className="space-y-6">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TruckIcon className="h-6 w-6 text-indigo-500" />
                Shipping Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 text-sm">
                    {error}
                  </div>
                )}
                <div>
                  <label className="flex items-center text-indigo-200/60 mb-1">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-indigo-200/60 focus:border-indigo-500 transition-colors ${
                      errors.name ? 'border-red-500' : 'border-indigo-500/20'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="flex items-center text-indigo-200/60 mb-1">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-indigo-200/60 focus:border-indigo-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-indigo-500/20'
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="flex items-center text-indigo-200/60 mb-1">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-indigo-200/60 focus:border-indigo-500 transition-colors ${
                      errors.phone ? 'border-red-500' : 'border-indigo-500/20'
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="flex items-center text-indigo-200/60 mb-1">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-indigo-200/60 focus:border-indigo-500 transition-colors ${
                      errors.address ? 'border-red-500' : 'border-indigo-500/20'
                    }`}
                    placeholder="Enter your address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="flex items-center text-indigo-200/60 mb-1">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-indigo-200/60 focus:border-indigo-500 transition-colors ${
                      errors.city ? 'border-red-500' : 'border-indigo-500/20'
                    }`}
                    placeholder="Enter your city"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="flex items-center text-indigo-200/60 mb-1">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-lg text-white placeholder-indigo-200/60 focus:border-indigo-500 transition-colors ${
                      errors.zip ? 'border-red-500' : 'border-indigo-500/20'
                    }`}
                    placeholder="Enter your ZIP code"
                  />
                  {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                </div>
                <div>
                  <label className="flex items-center text-indigo-200/60 mb-1">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Payment Method
                  </label>
                  <div className="flex gap-6 mt-2">
                    {paymentMethods.map((method) => (
                      <label key={method.value} className="flex items-center gap-2 text-indigo-200/60">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={() => setPaymentMethod(method.value)}
                          className="accent-indigo-500"
                        />
                        {method.label}
                      </label>
                    ))}
                  </div>
                </div>
                {paymentMethod === 'cod' && (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative inline-flex items-center justify-center w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 font-medium mt-4 disabled:opacity-50"
                  >
                    <span className="relative flex items-center justify-center w-full h-full px-6 py-3 bg-gray-900 rounded-[0.7rem] group-hover:bg-opacity-0 transition-all duration-300">
                      {isLoading ? 'Placing Order...' : 'Place Order'}
                    </span>
                  </button>
                )}
              </form>
            </div>

            {/* Stripe Payment Form */}
            {paymentMethod === 'stripe' && clientSecret && currentOrder && (
              <StripePaymentForm
                clientSecret={clientSecret}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                orderData={{
                  customerInfo: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                  },
                  shippingAddress: {
                    street: formData.address,
                    city: formData.city,
                    state: formData.city,
                    zipCode: formData.zip,
                    country: 'US'
                  }
                }}
              />
            )}

            <Link
              to="/cart"
              className="inline-flex items-center text-indigo-200/60 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Cart
            </Link>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10 shadow-lg sticky top-20">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="flex justify-between text-indigo-200/60">
                  <div className="flex-1">
                    <span className="block">{item.name}</span>
                    <span className="text-sm text-indigo-200/40">
                      Qty: {item.quantity}
                      {item.size && ` • Size: ${item.size}`}
                      {item.color && ` • Color: ${item.color}`}
                    </span>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20 my-4"></div>
            <div className="space-y-2">
              <div className="flex justify-between text-indigo-200/60">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-indigo-200/60">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-indigo-200/60">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20 my-2"></div>
              <div className="flex justify-between text-white font-bold text-xl">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;