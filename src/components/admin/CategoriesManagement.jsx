import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  TagIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import adminApi from '../../config/adminAxios';
import { isAdminAuthenticated } from '../../services/adminAuthService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CategoriesManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    featured: false,
    active: true
  });
  const [editingCategory, setEditingCategory] = useState(null);

  // Check authentication when component mounts
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await adminApi.get('/admin/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (error.message.includes('expired')) {
        navigate('/admin/login');
      }
      setCategories([]);
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await adminApi.put(`/admin/categories/${editingCategory._id}`, formData);
        toast.success('Category updated successfully!');
      } else {
        await adminApi.post('/admin/categories', formData);
        toast.success('Category created successfully!');
      }
      
      // Close modal and reset form
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        image: '',
        featured: false,
        active: true
      });
      setEditingCategory(null);
      
      // Fetch updated categories list
      await fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      if (error.message.includes('session has expired')) {
        navigate('/admin/login');
      } else {
        toast.error(error.response?.data?.message || 'Error saving category. Please try again.');
      }
    }
  };

  // Handle category deletion
  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await adminApi.delete(`/admin/categories/${categoryId}`);
        toast.success('Category deleted successfully!');
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Error deleting category');
      }
    }
  };

  // Handle edit button click
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      featured: category.featured || false,
      active: category.active !== false
    });
    setShowAddModal(true);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (active) => {
    return active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories Management</h1>
          <p className="text-indigo-200/60">Manage your product categories</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({
              name: '',
              description: '',
              image: '',
              featured: false,
              active: true
            });
            setShowAddModal(true);
          }}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 font-medium"
        >
          <span className="relative flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-[0.4rem] group-hover:bg-opacity-0 transition-all duration-300">
            <PlusIcon className="h-5 w-5" />
            Add New Category
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200/60" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10 rounded-2xl p-6 animate-pulse">
              <div className="h-32 bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-12">
          <TagIcon className="h-12 w-12 text-indigo-200/60 mx-auto mb-4" />
          <p className="text-indigo-200/60">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10 rounded-2xl p-6 hover:border-indigo-500/20 transition-all duration-200"
            >
              {/* Category Image */}
              <div className="relative mb-4">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                    <PhotoIcon className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                {category.featured && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Category Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.active !== false)}`}>
                    {category.active !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                {category.description && (
                  <p className="text-indigo-200/60 text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-indigo-500/10">
                  <div className="text-xs text-indigo-200/60">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                      title="Edit Category"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(category._id)}
                      className="p-2 text-rose-400 hover:text-rose-300 transition-colors"
                      title="Delete Category"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter category description"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter image URL"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-indigo-200">
                    Featured Category
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-indigo-200">
                    Active Category
                  </label>
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
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;