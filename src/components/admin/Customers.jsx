import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import adminApi from '../../config/adminAxios';
import { isAdminAuthenticated } from '../../services/adminAuthService';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  // Check authentication when component mounts
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch customers when component mounts
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/admin/customers');
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      if (error.message.includes('expired')) {
        navigate('/admin/login');
      }
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post('/admin/customers', formData);
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Error creating customer. Please try again.');
    }
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await adminApi.delete(`/admin/customers/${customerId}`);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers Management</h1>
          <p className="text-indigo-200/60">Manage your customer database</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 font-medium"
        >
          <span className="relative flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-[0.4rem] group-hover:bg-opacity-0 transition-all duration-300">
            <UserPlusIcon className="h-5 w-5" />
            Add New Customer
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200/60" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-indigo-500/20">
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Email</th>
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Phone</th>
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Location</th>
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-indigo-200">Loading...</td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-indigo-200">No customers found</td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b border-indigo-500/10">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {customer.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-indigo-200">{customer.email}</td>
                    <td className="py-4 px-6 text-indigo-200">{customer.phone || 'N/A'}</td>
                    <td className="py-4 px-6 text-indigo-200">
                      {customer.address?.city && customer.address?.state 
                        ? `${customer.address.city}, ${customer.address.state}`
                        : 'N/A'
                      }
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer._id)}
                          className="p-2 text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">Add New Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                    placeholder="ZIP Code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1">Country</label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-indigo-200 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers; 