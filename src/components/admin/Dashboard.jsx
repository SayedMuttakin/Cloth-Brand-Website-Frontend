import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  StarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import adminApi from '../../config/adminAxios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await adminApi.get('/admin/dashboard-stats');
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Handle quick action button clicks
  const handleQuickAction = (action) => {
    switch (action) {
      case 'New Order':
        // Navigate to orders page
        navigate('/admin/orders');
        break;
      case 'Add Product':
        // Navigate to products page and open add product modal
        navigate('/admin/products');
        break;
      case 'New Customer':
        // Navigate to customers page
        navigate('/admin/customers');
        break;
      case 'View Reports':
        // Navigate to reports page or show reports modal
        navigate('/admin/reports');
        break;
      default:
        break;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate percentage change (mock data for now)
  const getPercentageChange = (type) => {
    const changes = {
      sales: '+12%',
      orders: '+8%',
      customers: '+15%',
      conversion: '-2%'
    };
    return changes[type] || '+0%';
  };

  const stats = [
    {
      name: 'Total Sales',
      value: formatCurrency(dashboardData.totalSales),
      change: getPercentageChange('sales'),
      isIncrease: true,
      icon: CurrencyDollarIcon,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      name: 'Total Orders',
      value: dashboardData.totalOrders.toString(),
      change: getPercentageChange('orders'),
      isIncrease: true,
      icon: ShoppingBagIcon,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      name: 'Total Customers',
      value: dashboardData.totalCustomers.toString(),
      change: getPercentageChange('customers'),
      isIncrease: true,
      icon: UsersIcon,
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Conversion Rate',
      value: '3.2%',
      change: getPercentageChange('conversion'),
      isIncrease: false,
      icon: ChartBarIcon,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const quickActions = [
    {
      name: 'New Order',
      icon: ShoppingCartIcon,
      color: 'from-blue-500 to-indigo-500',
      description: 'Create a new order'
    },
    {
      name: 'Add Product',
      icon: ShoppingBagIcon,
      color: 'from-emerald-500 to-teal-500',
      description: 'Add a new product'
    },
    {
      name: 'New Customer',
      icon: UserGroupIcon,
      color: 'from-purple-500 to-pink-500',
      description: 'Add a new customer'
    },
    {
      name: 'View Reports',
      icon: ChartBarIcon,
      color: 'from-amber-500 to-orange-500',
      description: 'View analytics reports'
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard Overview</h1>
            <p className="text-indigo-200/60">Loading dashboard data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-indigo-500/10 animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard Overview</h1>
            <p className="text-red-400">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard Overview</h1>
          <p className="text-indigo-200/60">Welcome back, Admin. Here's what's happening with your store today.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all">
            Generate Report
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.name}
              onClick={() => handleQuickAction(action.name)}
              className="group p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-indigo-500/10 hover:border-indigo-500/20 transition-all duration-200 hover:scale-105 text-center"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-white font-medium">{action.name}</p>
              <p className="text-indigo-200/60 text-xs mt-1">{action.description}</p>
            </button>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-indigo-500/10 hover:border-indigo-500/20 transition-all duration-200"
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white leading-tight">{stat.value}</h3>
                <p className="text-indigo-200/70 text-sm mt-1 font-medium">{stat.name}</p>
                <div className={`flex items-center justify-center text-sm font-semibold mt-2 ${
                  stat.isIncrease ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {stat.isIncrease ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-indigo-500/10">
          <div className="p-6 border-b border-indigo-500/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                <p className="text-indigo-200/60 text-sm mt-1">Latest transactions from your store</p>
              </div>
              <button 
                onClick={() => navigate('/admin/orders')}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                    onClick={() => navigate('/admin/orders')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <ShoppingBagIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">#{order._id.slice(-6)}</h3>
                        <p className="text-indigo-200/60 text-sm">
                          {order.user ? order.user.name : order.customerInfo?.name || 'Guest'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatCurrency(order.totalAmount)}</p>
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered'
                            ? 'bg-emerald-500/20 text-emerald-500'
                            : order.status === 'processing'
                            ? 'bg-blue-500/20 text-blue-500'
                            : 'bg-amber-500/20 text-amber-500'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-indigo-200/60 text-xs">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-indigo-200/60">No orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-indigo-500/10">
          <div className="p-6 border-b border-indigo-500/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Top Products</h2>
                <p className="text-indigo-200/60 text-sm mt-1">Best performing products this month</p>
              </div>
              <button 
                onClick={() => navigate('/admin/products')}
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.topProducts.length > 0 ? (
                dashboardData.topProducts.map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors cursor-pointer"
                    onClick={() => navigate('/admin/products')}
                  >
                    <div>
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-indigo-200/60 text-sm">{product.sold} units sold</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{formatCurrency(product.revenue)}</p>
                      <p className="text-indigo-200/60 text-sm">Revenue</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-indigo-200/60">No products found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 