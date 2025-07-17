
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductList from '../products/ProductList';
import { getProducts } from '../../services/productService';
import { Squares2X2Icon, Bars4Icon, ChevronDownIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import NotFound from '../common/NotFound';

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const ProductPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  // Get category from URL parameters
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        console.log('Fetching products with:', { sortBy, page, limit: 12, category: categoryFilter });
        const response = await getProducts({ sortBy, page, limit: 100 }); // Get more products to filter
        console.log('API Response:', response);
        
        if (response && response.data && response.data.products) {
          let filteredProducts = response.data.products;
          
          // Filter by category if specified
          if (categoryFilter) {
            filteredProducts = response.data.products.filter(product => {
              // Handle both string categories and populated category objects
              let categoryName = '';
              if (typeof product.category === 'string') {
                // If category is a string (could be ObjectId or actual name)
                if (product.category.length === 24 && /^[a-f\d]{24}$/i.test(product.category)) {
                  return false; // Skip ObjectId categories
                } else {
                  categoryName = product.category;
                }
              } else if (product.category && typeof product.category === 'object') {
                // If category is populated object
                categoryName = product.category.name || product.category.title || '';
              } else {
                return false; // Skip if no valid category
              }
              
              // Generate same category ID format as in CategoriesPage
              const productCategoryId = categoryName
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s]/g, '') // Remove special characters
                .replace(/\s+/g, '-'); // Replace spaces with hyphens
              
              return productCategoryId === categoryFilter;
            });
            
            // Set category name for display
            if (filteredProducts.length > 0) {
              const firstProduct = filteredProducts[0];
              if (typeof firstProduct.category === 'string') {
                setCategoryName(firstProduct.category);
              } else if (firstProduct.category && typeof firstProduct.category === 'object') {
                setCategoryName(firstProduct.category.name || firstProduct.category.title || 'Unknown Category');
              }
            } else {
              // Convert category ID back to readable name
              setCategoryName(categoryFilter.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
            }
          } else {
            setCategoryName('');
          }
          
          // Apply pagination to filtered results
          const startIndex = (page - 1) * 12;
          const endIndex = startIndex + 12;
          const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
          
          setProducts(paginatedProducts);
          setTotalProducts(filteredProducts.length);
        } else {
          console.error('Invalid response structure:', response);
          setProducts([]);
          setErrorMessage('Invalid response from server');
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setErrorMessage(error.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [sortBy, page, categoryFilter]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [categoryFilter]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20 pt-20">
      {/* Background Pattern - Same as HeroSection */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        {categoryFilter && (
          <div className="mb-6">
            <Link
              to="/categories"
              className="inline-flex items-center text-indigo-200 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Categories
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {categoryFilter ? `${categoryName} Products` : 'All Products'}
            </h1>
            <p className="text-indigo-200/60 text-sm sm:text-base">
              {totalProducts > 0 
                ? `Showing ${products.length} of ${totalProducts} products${categoryFilter ? ` in ${categoryName}` : ''}`
                : categoryFilter 
                  ? `Browse through our ${categoryName.toLowerCase()} collection`
                  : 'Browse through our collection'
              }
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-1">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-500 text-white' 
                    : 'text-indigo-200/60 hover:text-white'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-indigo-500 text-white' 
                    : 'text-indigo-200/60 hover:text-white'
                }`}
              >
                <Bars4Icon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="appearance-none bg-gray-800/50 backdrop-blur-sm text-white rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-200/60 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{errorMessage}</p>
          </div>
        )}

        {/* Products Grid or No Results */}
        {!isLoading && products.length === 0 && !errorMessage ? (
          <NotFound 
            type="search"
            title="No Products Found"
            message="We couldn't find any products matching your criteria. Try adjusting your search or browse our categories."
          />
        ) : (
          <ProductList 
            products={products} 
            isLoading={isLoading} 
            viewMode={viewMode} 
          />
        )}
        
        {/* Pagination */}
        {totalProducts > 12 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-white rounded-md hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(Math.ceil(totalProducts / 12))].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 || 
                  pageNumber === Math.ceil(totalProducts / 12) ||
                  (pageNumber >= page - 1 && pageNumber <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        page === pageNumber
                          ? 'bg-indigo-500 text-white'
                          : 'text-indigo-200/60 hover:bg-gray-800/50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (pageNumber === page - 2 || pageNumber === page + 2) {
                  return <span key={pageNumber} className="px-2 text-indigo-200/60">...</span>;
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(totalProducts / 12)}
              className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-white rounded-md hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Bottom Gradient - Same as HeroSection */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>
    </div>
  );
};

export default ProductPage;
