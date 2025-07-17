import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  SwatchIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { isAdminAuthenticated } from '../../services/adminAuthService';
import { useNavigate } from 'react-router-dom';
import adminApi from '../../config/adminAxios';

const ColorAnalytics = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    colorStats: [],
    topColors: [],
    totalRecords: 0
  });

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
    fetchAnalytics();
  }, [navigate, timeRange, selectedProduct]);

  const fetchProducts = async () => {
    try {
      const response = await adminApi.get('/admin/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ timeRange });
      if (selectedProduct) {
        params.append('productId', selectedProduct);
      }

      const response = await adminApi.get(`/color-analytics/admin/stats?${params}`);
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      if (error.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'view':
        return <EyeIcon className="h-4 w-4" />;
      case 'select':
        return <CursorArrowRaysIcon className="h-4 w-4" />;
      case 'add_to_cart':
        return <ShoppingBagIcon className="h-4 w-4" />;
      case 'purchase':
        return <CreditCardIcon className="h-4 w-4" />;
      default:
        return <SwatchIcon className="h-4 w-4" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'view':
        return 'text-blue-400';
      case 'select':
        return 'text-yellow-400';
      case 'add_to_cart':
        return 'text-green-400';
      case 'purchase':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatTimeRange = (range) => {
    switch (range) {
      case '1d':
        return 'Last 24 Hours';
      case '7d':
        return 'Last 7 Days';
      case '30d':
        return 'Last 30 Days';
      case '90d':
        return 'Last 90 Days';
      default:
        return 'Last 30 Days';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Color Analytics</h1>
          <p className="text-indigo-200/60">Track user color preferences and interactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Time Range Filter */}
        <div className="relative">
          <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200/60" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500 appearance-none"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>

        {/* Product Filter */}
        <div className="relative">
          <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200/60" />
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500 appearance-none"
          >
            <option value="">All Products</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Summary */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10 rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{analyticsData.totalRecords}</div>
            <div className="text-sm text-indigo-200/60">Total Interactions</div>
            <div className="text-xs text-indigo-200/40">{formatTimeRange(timeRange)}</div>
          </div>
        </div>
      </div>

      {/* Top Colors */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <SwatchIcon className="h-6 w-6" />
          Most Popular Colors
        </h2>
        
        {analyticsData.topColors.length === 0 ? (
          <div className="text-center py-8 text-indigo-200/60">
            <SwatchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No color interaction data available</p>
            <p className="text-sm">Data will appear as users interact with product colors</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.topColors.map((color, index) => (
              <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-indigo-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: color.colorHex }}
                  />
                  <div>
                    <h3 className="text-white font-medium">{color.colorName}</h3>
                    <p className="text-indigo-200/60 text-sm">{color.colorHex}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200/60">Total Selections:</span>
                    <span className="text-white font-medium">{color.totalSelections}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200/60">Unique Users:</span>
                    <span className="text-white font-medium">{color.uniqueUsers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-indigo-200/60">Products:</span>
                    <span className="text-white font-medium">{color.uniqueProducts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Color Stats */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ChartBarIcon className="h-6 w-6" />
          Detailed Color Analytics
        </h2>

        {analyticsData.colorStats.length === 0 ? (
          <div className="text-center py-8 text-indigo-200/60">
            <ChartBarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No detailed analytics available</p>
            <p className="text-sm">Detailed data will appear as users interact with products</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyticsData.colorStats.map((stat, index) => (
              <div key={index} className="bg-gray-800/30 rounded-lg p-4 border border-indigo-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: stat._id.colorHex }}
                    />
                    <div>
                      <h3 className="text-white font-medium">{stat._id.colorName}</h3>
                      <p className="text-indigo-200/60 text-sm">{stat._id.productName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{stat.totalInteractions}</div>
                    <div className="text-indigo-200/60 text-sm">Total Interactions</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stat.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="text-center">
                      <div className={`flex items-center justify-center gap-1 mb-1 ${getActionColor(action.action)}`}>
                        {getActionIcon(action.action)}
                        <span className="text-sm capitalize">{action.action.replace('_', ' ')}</span>
                      </div>
                      <div className="text-white font-medium">{action.count}</div>
                      <div className="text-indigo-200/60 text-xs">
                        {action.uniqueUsers} users, {action.uniqueSessions} sessions
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorAnalytics;