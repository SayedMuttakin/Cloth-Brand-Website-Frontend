import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchProducts } from '../../services/productService';
import { MagnifyingGlassIcon, Squares2X2Icon, Bars4Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import ProductList from '../products/ProductList';
import NotFound from '../common/NotFound';

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await searchProducts(query);
        
        if (response.status === 'success') {
          let results = response.data.products;
          
          // Apply sorting
          switch (sortBy) {
            case 'price-low-high':
              results = results.sort((a, b) => a.price - b.price);
              break;
            case 'price-high-low':
              results = results.sort((a, b) => b.price - a.price);
              break;
            case 'rating':
              results = results.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
              break;
            case 'newest':
            default:
              results = results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
              break;
          }
          
          setProducts(results);
        } else {
          setError('Failed to search products');
        }
      } catch (err) {
        setError('An error occurred while searching');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, sortBy]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20 pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-3 text-indigo-400 mb-2">
              <MagnifyingGlassIcon className="h-6 w-6" />
              <span className="text-sm font-medium">Search results for:</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">"{query}"</h1>
            <p className="text-indigo-200/60">
              {loading ? 'Searching...' : 
               products.length === 0 ? 'No products found' :
               `Found ${products.length} ${products.length === 1 ? 'product' : 'products'}`
              }
            </p>
          </div>
          
          {/* Controls */}
          {!loading && products.length > 0 && (
            <div className="flex items-center gap-4">
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
              <div className="relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className="appearance-none bg-gray-800/50 backdrop-blur-sm text-white rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && products.length === 0 && !error ? (
          <div className="text-center py-16">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-indigo-500/10">
              <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-indigo-400/50 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
              <p className="text-indigo-200/60 mb-6">
                We couldn't find any products matching "{query}". Try adjusting your search terms or browse our categories.
              </p>
              <div className="space-y-3">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  Browse All Products
                </Link>
                <Link
                  to="/categories"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-800/50 backdrop-blur-sm text-indigo-200 font-medium rounded-lg border border-indigo-500/20 hover:bg-gray-700/50 hover:border-indigo-500/40 transition-all duration-300"
                >
                  View Categories
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <ProductList 
            products={products} 
            isLoading={loading} 
            viewMode={viewMode} 
          />
        )}

        {/* Search Suggestions */}
        {!loading && products.length === 0 && !error && query && (
          <div className="mt-12">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10">
              <h3 className="text-lg font-semibold text-white mb-4">Search Suggestions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Automotive'].map((suggestion) => (
                  <Link
                    key={suggestion}
                    to={`/search?q=${encodeURIComponent(suggestion)}`}
                    className="px-4 py-2 bg-gray-700/50 text-indigo-200 rounded-lg text-center hover:bg-indigo-500/20 hover:text-white transition-all duration-300 text-sm"
                  >
                    {suggestion}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>
    </div>
  );
};

export default SearchResults;