import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  ArrowLeftIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import adminApi from '../../config/adminAxios';

const SizeAnalytics = () => {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);

  const timeRangeOptions = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  useEffect(() => {
    fetchProducts();
    fetchAnalytics();
  }, [timeRange, selectedProduct]);

  const fetchProducts = async () => {
    try {
      const response = await adminApi.get('/products');
      if (response.data.status === 'success') {
        setProducts(response.data.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        timeRange,
        limit: '50'
      });

      if (selectedProduct) {
        params.append('productId', selectedProduct);
      }

      const response = await adminApi.get(`/size-analytics/admin/stats?${params}`);
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error('Error fetching size analytics:', error);
      setError('Failed to load size analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getSizeDisplayName = (size) => {
    const sizeMap = {
      'XS': 'Extra Small',
      'S': 'Small',
      'M': 'Medium',
      'L': 'Large',
      'XL': 'Extra Large',
      'XXL': 'Double XL',
      '2XL': 'Double XL',
      '3XL': 'Triple XL'
    };
    return sizeMap[size] || size;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getConversionColor = (rate) => {
    if (rate >= 20) return 'text-green-400';
    if (rate >= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin')}
                className="mr-4 p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-indigo-400 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">Size Analytics</h1>
                  <p className="text-gray-400 text-sm">Track size selection patterns and preferences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {timeRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Filter
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[200px]"
              >
                <option value="">All Products</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center text-gray-400">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">
                Total Records: {analyticsData?.summary?.totalRecords || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Top Sizes */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <ArrowTrendingUpIcon className="h-6 w-6 text-indigo-400 mr-2" />
            Most Popular Sizes
          </h2>
          
          {analyticsData?.topSizes?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsData.topSizes.slice(0, 6).map((sizeData, index) => (
                <div key={sizeData._id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {sizeData._id}
                      </div>
                      <div>
                        <h3 className="font-semibold">{getSizeDisplayName(sizeData._id)}</h3>
                        <p className="text-gray-400 text-sm">Size {sizeData._id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-400">
                        #{index + 1}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Views
                      </span>
                      <span className="font-semibold">{formatNumber(sizeData.views)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 flex items-center">
                        <CursorArrowRaysIcon className="h-4 w-4 mr-1" />
                        Selections
                      </span>
                      <span className="font-semibold">{formatNumber(sizeData.selections)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 flex items-center">
                        <ShoppingBagIcon className="h-4 w-4 mr-1" />
                        Add to Cart
                      </span>
                      <span className="font-semibold">{formatNumber(sizeData.addToCarts)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No size data available for the selected time range</p>
            </div>
          )}
        </div>

        {/* Conversion Rates */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <ArrowTrendingUpIcon className="h-6 w-6 text-green-400 mr-2" />
            Size Conversion Rates
          </h2>
          
          {analyticsData?.conversionStats?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Size</th>
                    <th className="text-left py-3 px-4">Views</th>
                    <th className="text-left py-3 px-4">Selections</th>
                    <th className="text-left py-3 px-4">Add to Cart</th>
                    <th className="text-left py-3 px-4">Selection Rate</th>
                    <th className="text-left py-3 px-4">Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.conversionStats.map((stat) => (
                    <tr key={stat._id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                            {stat._id}
                          </div>
                          <span className="font-medium">{getSizeDisplayName(stat._id)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatNumber(stat.views)}</td>
                      <td className="py-3 px-4">{formatNumber(stat.selections)}</td>
                      <td className="py-3 px-4">{formatNumber(stat.addToCarts)}</td>
                      <td className="py-3 px-4">
                        <span className={getConversionColor(stat.selectionRate)}>
                          {stat.selectionRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={getConversionColor(stat.conversionRate)}>
                          {stat.conversionRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversion data available</p>
            </div>
          )}
        </div>

        {/* Size Guide */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Size Guide Reference</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div key={size} className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2">
                  {size}
                </div>
                <div className="text-sm font-medium">{getSizeDisplayName(size)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeAnalytics;