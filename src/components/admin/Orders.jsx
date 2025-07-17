import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../config/adminAxios';
import { format } from 'date-fns';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { isAdminAuthenticated } from '../../services/adminAuthService';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const navigate = useNavigate();

  const filterOrders = (status, search) => {
    let filtered = [...orders];

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchLower) ||
        order.customerInfo.name.toLowerCase().includes(searchLower) ||
        order.customerInfo.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'total') {
        return sortOrder === 'desc'
          ? b.totalAmount - a.totalAmount
          : a.totalAmount - b.totalAmount;
      }
      return 0;
    });

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await adminApi.put(`/admin/orders/${orderId}/status`,
        { status: newStatus }
      );
      
      // Update local state
      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      filterOrders(statusFilter, searchTerm);
      
      // Show success toast
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status');
      setError('Failed to update order status');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await adminApi.delete(`/admin/orders/${orderId}`);
      
      // Remove from local state
      const updatedOrders = orders.filter(order => order._id !== orderId);
      setOrders(updatedOrders);
      filterOrders(statusFilter, searchTerm);
      
      // Show success toast
      toast.success('Order deleted successfully!');
    } catch (err) {
      console.error('Error deleting order:', err);
      
      // Show error toast
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(`Failed to delete order: ${errorMessage}`);
      setError(`Failed to delete order: ${errorMessage}`);
    }
  };

  useEffect(() => {
    // Check if admin is authenticated
    if (!isAdminAuthenticated()) {
      setError('Access denied. Admin login required.');
      setLoading(false);
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Please login as admin to view orders');
        setLoading(false);
        navigate('/admin/login');
        return;
      }

      const response = await adminApi.get('/admin/orders');
      setOrders(response.data);
      setFilteredOrders(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to view orders');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
        navigate('/login');
      } else {
        setError('Failed to fetch orders');
      }
      setLoading(false);
      console.error('Error fetching orders:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-500';
      case 'delivered':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  filterOrders(statusFilter, e.target.value);
                }}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex gap-4">
              <select
                className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  filterOrders(statusFilter, searchTerm);
                }}
              >
                <option value="date">Sort by Date</option>
                <option value="total">Sort by Total</option>
              </select>
              <button
                className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                  filterOrders(statusFilter, searchTerm);
                }}
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
              <select
                className="bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  filterOrders(e.target.value, searchTerm);
                }}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div>
                        <p className="font-medium text-white">{order.customerInfo.name}</p>
                        <p className="text-gray-400">{order.customerInfo.email}</p>
                        <div className="mt-2 space-y-1">
                          {order.items && order.items.length > 0 && (
                            <div className="space-y-2">
                              {order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-indigo-500/30 transition-colors">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex-1">
                                      <div className="text-white font-medium text-sm">
                                        {item.quantity}x {item.product?.name || `Product #${index + 1}`}
                                      </div>
                                      <div className="text-gray-400 text-xs mt-1">
                                        Unit Price: ${item.price.toFixed(2)}
                                      </div>
                                    </div>
                                    <span className="text-green-400 text-sm font-bold">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {item.size && (
                                      <span className="bg-indigo-500/30 text-indigo-200 px-2 py-1 rounded-full text-xs font-bold border border-indigo-500/40">
                                        📏 {item.size}
                                      </span>
                                    )}
                                    {item.color && (
                                      <span className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded-full text-xs font-bold border border-purple-500/40">
                                        🎨 {item.color}
                                      </span>
                                    )}
                                    {!item.size && !item.color && (
                                      <span className="text-gray-500 text-xs italic">No size/color selected</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="text-center">
                                  <span className="text-gray-500 text-xs bg-gray-800/30 px-3 py-1 rounded-full border border-gray-600">
                                    +{order.items.length - 3} more items
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                        {order.status === 'cancelled' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500">
                            User Cancelled
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-4">
                        <select
                          className="bg-gray-800 text-white rounded-lg px-3 py-1 border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="View Order Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {order.status === 'cancelled' && (
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete Cancelled Order"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;