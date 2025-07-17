import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowLeftIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import adminApi from '../../config/adminAxios';
import toast from 'react-hot-toast';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await adminApi.get(`/admin/orders/${orderId}`);
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      await adminApi.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'delivered':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/4"></div>
          <div className="h-96 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Order #{order._id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-gray-400">
              Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy at h:mm a')}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Order Status</h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2 capitalize">{order.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Customer Selections Summary */}
            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl border border-indigo-500/20 p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                🎨 Customer Product Selections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-indigo-500/30">
                  <h3 className="text-indigo-300 font-medium mb-3 flex items-center gap-2">
                    📏 Size Selections
                  </h3>
                  <div className="space-y-3">
                    {order.items.filter(item => item.size).length > 0 ? (
                      order.items.filter(item => item.size).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                          <span className="text-gray-300 font-medium">Item #{order.items.indexOf(item) + 1}</span>
                          <span className="bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full text-sm font-bold">
                            {item.size}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">No size selections made</p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/30">
                  <h3 className="text-purple-300 font-medium mb-3 flex items-center gap-2">
                    🎨 Color Selections
                  </h3>
                  <div className="space-y-3">
                    {order.items.filter(item => item.color).length > 0 ? (
                      order.items.filter(item => item.color).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <span className="text-gray-300 font-medium">Item #{order.items.indexOf(item) + 1}</span>
                          <span className="bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-sm font-bold">
                            {item.color}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm italic">No color selections made</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quick Overview */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <h4 className="text-white font-medium mb-3">📋 Quick Selection Overview:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                      <div className="text-white font-medium text-sm mb-2">Item #{index + 1}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">Qty:</span>
                          <span className="text-white text-sm font-medium">{item.quantity}</span>
                        </div>
                        {item.size && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">Size:</span>
                            <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-xs font-medium">
                              {item.size}
                            </span>
                          </div>
                        )}
                        {item.color && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">Color:</span>
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs font-medium">
                              {item.color}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingBagIcon className="h-5 w-5" />
                Order Items ({order.items.length})
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="p-6 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-indigo-500/20">
                        <ShoppingBagIcon className="h-10 w-10 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-white font-semibold text-lg">
                              {item.product?.name || `Product Item #${index + 1}`}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                              Product ID: {item.product?._id || item.product}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-lg text-sm font-medium">
                                Qty: {item.quantity}
                              </span>
                              {item.size && (
                                <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-lg text-sm font-medium border border-indigo-500/30">
                                  📏 Size: {item.size}
                                </span>
                              )}
                              {item.color && (
                                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-sm font-medium border border-purple-500/30">
                                  🎨 Color: {item.color}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600">
                              <p className="text-gray-400 text-xs uppercase tracking-wide">Unit Price</p>
                              <p className="text-white font-bold text-lg">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-3 border border-indigo-500/20 mt-2">
                              <p className="text-indigo-300 text-xs uppercase tracking-wide">Total</p>
                              <p className="text-white font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Additional Item Details */}
                        {(item.size || item.color) && (
                          <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                            <h4 className="text-white font-medium text-sm mb-2">Customer Selection Details:</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {item.size && (
                                <div>
                                  <p className="text-gray-400 text-xs uppercase tracking-wide">Selected Size</p>
                                  <p className="text-indigo-300 font-bold text-lg">{item.size}</p>
                                </div>
                              )}
                              {item.color && (
                                <div>
                                  <p className="text-gray-400 text-xs uppercase tracking-wide">Selected Color</p>
                                  <p className="text-purple-300 font-bold text-lg">{item.color}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Customer Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Customer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white">{order.customerInfo.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">{order.customerInfo.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="text-white">{order.customerInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPinIcon className="h-5 w-5" />
                Shipping Address
              </h2>
              <div className="text-gray-300">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5" />
                Payment Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Payment Method</p>
                  <p className="text-white capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Payment Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${(order.totalAmount - order.shippingCost - order.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>${order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-700"></div>
                <div className="flex justify-between text-white font-bold text-lg">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;