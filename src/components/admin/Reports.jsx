import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import adminApi from '../../config/adminAxios';
import { isAdminAuthenticated } from '../../services/adminAuthService';
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const navigate = useNavigate();
  const [reportsData, setReportsData] = useState({
    salesData: [],
    topProducts: [],
    customerStats: {},
    orderStats: {}
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  // Check authentication when component mounts
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch reports data when component mounts
  useEffect(() => {
    fetchReportsData();
  }, [selectedPeriod]);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      // For now, we'll use the dashboard stats endpoint
      const response = await adminApi.get('/admin/dashboard-stats');
      setReportsData({
        salesData: [
          { month: 'Jan', sales: 12000 },
          { month: 'Feb', sales: 15000 },
          { month: 'Mar', sales: 18000 },
          { month: 'Apr', sales: 14000 },
          { month: 'May', sales: 22000 },
          { month: 'Jun', sales: 25000 }
        ],
        topProducts: response.data.topProducts || [],
        customerStats: {
          total: response.data.totalCustomers,
          newThisMonth: 45,
          growth: '+12%'
        },
        orderStats: {
          total: response.data.totalOrders,
          completed: Math.floor(response.data.totalOrders * 0.85),
          pending: Math.floor(response.data.totalOrders * 0.15),
          growth: '+8%'
        }
      });
    } catch (error) {
      console.error('Error fetching reports data:', error);
      if (error.message.includes('expired')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Analytics & Reports</h1>
            <p className="text-indigo-200/60">Loading reports data...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-indigo-500/10 animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-indigo-200/60">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-indigo-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-semibold text-emerald-500">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              +15%
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white leading-tight">
              {formatCurrency(reportsData.salesData.reduce((sum, item) => sum + item.sales, 0))}
            </h3>
            <p className="text-indigo-200/70 text-sm mt-1 font-medium">Total Revenue</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-indigo-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500">
              <ShoppingBagIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-semibold text-emerald-500">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              {reportsData.orderStats.growth}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white leading-tight">{reportsData.orderStats.total}</h3>
            <p className="text-indigo-200/70 text-sm mt-1 font-medium">Total Orders</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-indigo-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-semibold text-emerald-500">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              {reportsData.customerStats.growth}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white leading-tight">{reportsData.customerStats.total}</h3>
            <p className="text-indigo-200/70 text-sm mt-1 font-medium">Total Customers</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-indigo-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center text-sm font-semibold text-emerald-500">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              +5%
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white leading-tight">3.2%</h3>
            <p className="text-indigo-200/70 text-sm mt-1 font-medium">Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-indigo-500/10">
          <div className="p-6 border-b border-indigo-500/10">
            <h2 className="text-xl font-bold text-white">Sales Trend</h2>
            <p className="text-indigo-200/60 text-sm mt-1">Monthly revenue performance</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportsData.salesData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-white font-medium">{item.month}</span>
                  </div>
                  <span className="text-indigo-200">{formatCurrency(item.sales)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-indigo-500/10">
          <div className="p-6 border-b border-indigo-500/10">
            <h2 className="text-xl font-bold text-white">Top Performing Products</h2>
            <p className="text-indigo-200/60 text-sm mt-1">Best selling products by revenue</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportsData.topProducts.slice(0, 5).map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-4 rounded-xl bg-indigo-500/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <p className="text-indigo-200/60 text-sm">{product.sold} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{formatCurrency(product.revenue)}</p>
                    <p className="text-indigo-200/60 text-sm">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-indigo-500/10">
        <div className="p-6 border-b border-indigo-500/10">
          <h2 className="text-xl font-bold text-white">Order Status Breakdown</h2>
          <p className="text-indigo-200/60 text-sm mt-1">Current order status distribution</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-3xl font-bold text-emerald-500 mb-2">{reportsData.orderStats.completed}</div>
              <div className="text-emerald-400 font-medium">Completed</div>
              <div className="text-emerald-300/60 text-sm">85% of total</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-3xl font-bold text-amber-500 mb-2">{reportsData.orderStats.pending}</div>
              <div className="text-amber-400 font-medium">Pending</div>
              <div className="text-amber-300/60 text-sm">15% of total</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="text-3xl font-bold text-indigo-500 mb-2">{reportsData.customerStats.newThisMonth}</div>
              <div className="text-indigo-400 font-medium">New Customers</div>
              <div className="text-indigo-300/60 text-sm">This month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 