import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  SwatchIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, uploadImage } from '../../services/adminService';
import { isAdminAuthenticated } from '../../services/adminAuthService';
import { useNavigate } from 'react-router-dom';
import ColorVariantsManager from './ColorVariantsManager';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    brand: '',
    images: [''],  // We'll start with one image
    colors: [],
    colorVariants: [], // New color variants with images
    sizes: [],
    featured: false,
    isNew: true
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Check authentication when component mounts
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch products and categories when component mounts
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch products with filters
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getProducts({
        search: searchTerm || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.message.includes('expired')) {
        navigate('/admin/login');
      }
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      const categoriesData = response.data.categories || [];
      setAvailableCategories(categoriesData);
      setCategories(['All', ...categoriesData.map(cat => cat.name)]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setAvailableCategories([]);
      setCategories(['All']);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection and upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await uploadImage(formData);
      setFormData(prev => ({ ...prev, images: [response.data.filePath] }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    try {
      // Find the selected category object
      const selectedCategory = availableCategories.find(cat => cat.name === formData.category);
      
      if (!selectedCategory) {
        alert('Please select a valid category');
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: [formData.images[0]],
        category: selectedCategory.id // Use the category ID directly
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      
      // Close modal and reset form
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        brand: '',
        images: [''],
        colors: [],
        colorVariants: [],
        sizes: [],
        featured: false,
        isNew: true
      });
      setEditingProduct(null);
      
      // Fetch updated products list
      await fetchProducts();
      
      // Show success message
      alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      // Only redirect on actual session expiry
      if (error.message.includes('session has expired')) {
        navigate('/admin/login');
      } else {
        // Show error message but stay on the page
        alert(error.message || 'Error saving product. Please try again.');
      }
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: typeof product.category === 'object' && product.category?.name 
        ? product.category.name 
        : product.category || '',
      price: product.price,
      stock: product.stock,
      brand: product.brand,
      images: [product.images[0]],
      colors: product.colors || [],
      colorVariants: product.colorVariants || [],
      sizes: product.sizes || [],
      featured: product.featured,
      isNew: product.isNew
    });
    setShowAddModal(true);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const productCategory = typeof product.category === 'object' && product.category?.name 
      ? product.category.name 
      : product.category || '';
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || productCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-500';
      case 'Low Stock':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Out of Stock':
        return 'bg-rose-500/20 text-rose-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Get product status based on stock
  const getProductStatus = (stock) => {
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products Management</h1>
          <p className="text-indigo-200/60">Manage your product inventory</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              category: '',
              price: '',
              stock: '',
              brand: '',
              images: [''],
              colors: [],
              colorVariants: [],
              sizes: [],
              featured: false,
              isNew: true
            });
            setShowAddModal(true);
          }}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 font-medium"
        >
          <span className="relative flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-[0.4rem] group-hover:bg-opacity-0 transition-all duration-300">
            <PlusIcon className="h-5 w-5" />
            Add New Product
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200/60" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200/60" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500 appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-indigo-500/20">
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Product</th>
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Category</th>
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Price</th>
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Stock</th>
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-indigo-200/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-indigo-200">Loading...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-indigo-200">No products found</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-indigo-500/10">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={`${API_URL}${product.images[0]}`}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className="text-white font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-indigo-200">
                      {typeof product.category === 'object' && product.category?.name 
                        ? product.category.name 
                        : product.category || 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-indigo-200">${product.price}</td>
                    <td className="py-4 px-6 text-indigo-200">{product.stock}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getProductStatus(product.stock))}`}>
                        {getProductStatus(product.stock)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
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

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-gray-900 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter product name"
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
                  placeholder="Enter product description"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Select category</option>
                  {availableCategories && availableCategories.length > 0 ? (
                    availableCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No categories available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Main Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-indigo-500/20 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:border-indigo-500"
                />
                {formData.images && formData.images[0] && (
                  <div className="mt-2">
                    <p className="text-sm text-indigo-200">Current Image:</p>
                    <img src={`${API_URL}${formData.images[0]}`} alt="Current Product" className="w-20 h-20 rounded-lg object-cover mt-1" />
                  </div>
                )}
              </div>

              {/* Color Variants Manager */}
              <ColorVariantsManager
                colorVariants={formData.colorVariants}
                onChange={(variants) => setFormData(prev => ({ ...prev, colorVariants: variants }))}
              />

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <label key={size} className="inline-flex items-center bg-gray-800/50 px-3 py-1 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        value={size}
                        checked={formData.sizes.includes(size)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          setFormData(prev => ({
                            ...prev,
                            sizes: checked
                              ? [...prev.sizes, value]
                              : prev.sizes.filter(s => s !== value)
                          }));
                        }}
                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                      />
                      <span className="ml-2 text-white text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-indigo-200">
                  Mark as Popular Product (Show in Home)
                </label>
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
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement; 