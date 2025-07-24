import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, ArrowLeftOnRectangleIcon, TruckIcon, CheckCircleIcon, ClockIcon, XCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import ConfirmationModal from '../ConfirmationModal';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelTimers, setCancelTimers] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const formatImageUrl = (img) => {
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    } else if (img.startsWith('/')) {
      return `${API_URL.replace('/api', '')}${img}`;
    } else {
      return `${API_URL.replace('/api', '')}/${img}`;
    }
  };

  const fetchOrders = async () => {
    console.log('Fetching orders...');
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/orders/my-orders');
      console.log('API Response:', response.data);
      if (response.data && response.data.status === 'success') {
        if (response.data.data && Array.isArray(response.data.data.orders)) {
          setOrders(response.data.data.orders);
          console.log('Orders set:', response.data.data.orders);
        } else {
          setOrders([]);
          console.log('No orders data found or not an array.');
        }
      } else {
        setError('Failed to fetch orders: ' + (response.data?.message || 'Unknown error'));
        setOrders([]);
        console.error('Failed to fetch orders with status not success:', response.data);
      }
    } catch (err) {
      setError('Failed to load orders: ' + (err.response?.data?.message || err.message));
      setOrders([]);
      console.error('Error fetching orders:', err.response?.data || err.message);
    } finally {
      setLoading(false);
      console.log('Finished fetching orders. Loading state set to false.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCancelTimers((prev) => {
        const updated = { ...prev };
        orders.forEach((order) => {
          if (order.status === 'pending') {
            const created = new Date(order.createdAt).getTime();
            const now = Date.now();
            const diff = 60 * 60 * 1000 - (now - created);
            updated[order._id] = diff > 0 ? diff : 0;
          }
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await api.patch('/users/profile', formData);
      if (response.data.status === 'success') {
        toast.success('Profile updated successfully!');
        updateUser(response.data.data.user);
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case 'delivered': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default: return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully!');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
      fetchOrders();
    }
  };

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsModalOpen(true);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      await api.delete(`/orders/${orderToDelete}/user-delete`);
      toast.success('Order deleted successfully!');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete order');
    } finally {
      setIsModalOpen(false);
      setOrderToDelete(null);
    }
  };

  const formatTimer = (ms) => {
    if (ms <= 0) return 'Expired';
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-gray-700/50">
            <div className="h-24 sm:h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="relative px-4 sm:px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <div className="-mt-12 sm:-mt-16">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full p-1 shadow-lg">
                      <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="sm:ml-6 pt-2 sm:pt-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-white">{user.name}</h1>
                    <p className="text-xs sm:text-sm text-gray-300">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeftOnRectangleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="mt-4 sm:mt-6 bg-gray-800/50 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-gray-700/50">
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Profile Information</h2>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="flex items-center text-sm text-indigo-400 hover:text-indigo-300">
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleUpdateProfile} className="text-sm text-green-400 hover:text-green-300">Save</button>
                    <button onClick={() => setIsEditing(false)} className="text-sm text-red-400 hover:text-red-300">Cancel</button>
                  </div>
                )}
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 text-white">
                  <EnvelopeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 mt-1 sm:mt-0 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-300">Email</p>
                    <p className="text-sm sm:text-base break-all text-white">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 text-white">
                  <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 mt-1 sm:mt-0 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-300">Phone</p>
                    {isEditing ? (
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="bg-gray-700 text-white rounded-md p-1 w-full" />
                    ) : (
                      <p className="text-sm sm:text-base text-white">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 text-white">
                  <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 mt-1 sm:mt-0 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-300">Address</p>
                    {isEditing ? (
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="bg-gray-700 text-white rounded-md p-1 w-full" />
                    ) : (
                      <p className="text-sm sm:text-base text-white">{user.address || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="mt-4 sm:mt-6 bg-gray-800/50 backdrop-blur-xl rounded-lg shadow-lg overflow-hidden border border-gray-700/50">
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-white">Order History</h2>
                <button onClick={fetchOrders} disabled={loading} className="px-3 sm:px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              {loading ? (
                <div className="text-center py-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div></div>
              ) : error ? (
                <div className="text-center text-red-500 py-4">
                  <p>{error}</p>
                  <button onClick={fetchOrders} className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Retry</button>
                </div>
              ) : !Array.isArray(orders) || orders.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No orders yet</h3>
                  <p className="text-gray-300">When you place orders, they will appear here.</p>
                  <button onClick={() => navigate('/products')} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-600 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow bg-gray-700/30">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-3 sm:mb-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-300 break-all">Order ID: {order._id}</p>
                          <p className="text-xs sm:text-sm text-gray-300">Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                        </div>
                        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center ${getStatusColor(order.status)} self-start`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 sm:ml-2 capitalize">{order.status}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item._id} className="flex justify-between items-start sm:items-center gap-3">
                            <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg overflow-hidden">
                                {item.product && item.product.images && item.product.images.length > 0
                                  ? <img src={formatImageUrl(item.product.images[0])} alt={item.product.name} className="w-full h-full object-cover" />
                                  : <img src="https://placehold.co/40x40/333/FFF?text=No+Image" alt="No Image" className="w-full h-full object-cover" />
                                }
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-white text-sm sm:text-base truncate">{item.product ? item.product.name : 'Unknown Product'}</p>
                                <p className="text-xs sm:text-sm text-gray-300">Quantity: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-medium text-white text-sm sm:text-base flex-shrink-0">${item.product ? (item.price * item.quantity).toFixed(2) : '0.00'}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-600 space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-xs sm:text-sm text-gray-300">Total Amount</p>
                          <p className="text-base sm:text-lg font-semibold text-white">${order.totalAmount ? order.totalAmount.toFixed(2) : order.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</p>
                        </div>
                        {order.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                            <button onClick={() => handleCancelOrder(order._id)} disabled={cancelTimers[order._id] === 0} className={`px-3 sm:px-4 py-2 rounded-md font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm ${cancelTimers[order._id] === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'}`}>
                              Cancel Order
                            </button>
                            <div className="text-xs sm:text-sm text-gray-300">
                              <span className="font-medium">Cancel within:</span>
                              <span className="ml-1 font-mono text-red-600">{formatTimer(cancelTimers[order._id] || 0)}</span>
                            </div>
                          </div>
                        )}
                        {(order.status === 'cancelled' || order.status === 'delivered') && (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                            <button onClick={() => handleDeleteOrder(order._id)} className="px-3 sm:px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm">
                              Delete Order
                            </button>
                            <div className="text-xs sm:text-sm text-gray-300">
                              <span className="font-medium">{order.status === 'cancelled' ? 'Order was cancelled' : 'Order was delivered'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDeleteOrder}
        title="Confirm Order Deletion"
        message="Are you sure you want to delete this order? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default ProfilePage;