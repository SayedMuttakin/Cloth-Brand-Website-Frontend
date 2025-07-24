
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductList from '../products/ProductList';
import FilterSidebar from '../products/FilterSidebar';
import { getProducts, getProductFilters } from '../../services/productService';
import { Squares2X2Icon, Bars4Icon, ChevronDownIcon, ArrowLeftIcon, FunnelIcon } from '@heroicons/react/24/outline';
import NotFound from '../common/NotFound';

const sortOptions = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      const response = await getProductFilters();
      if (response.status === 'success') {
        setFilters(response.data);
      }
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    setSelectedFilters(params);
    setSortBy(params.sortBy || 'newest');
    setPage(parseInt(params.page) || 1);

    const loadProducts = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await getProducts(params);
        if (response && response.data && response.data.products) {
          setProducts(response.data.products);
          setTotalProducts(response.total);
        } else {
          setProducts([]);
          setTotalProducts(0);
          setErrorMessage('Invalid response from server');
        }
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load products');
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [searchParams]);

  const handleFilterChange = (filterName, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get(filterName) === value) {
      newParams.delete(filterName);
    } else {
      newParams.set(filterName, value);
    }
    newParams.set('page', 1);
    setSearchParams(newParams);
  };

  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', value);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20 pt-20">
      {/* Background Pattern - Same as HeroSection */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-8">
          <FilterSidebar 
            filters={filters} 
            selectedFilters={selectedFilters} 
            onFilterChange={handleFilterChange} 
            onClearFilters={handleClearFilters} 
            isOpen={isFilterOpen} 
            onClose={() => setIsFilterOpen(false)} 
          />
          <main className="flex-1">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {selectedFilters.category ? filters.categories?.find(c => c.value === selectedFilters.category)?.label : 'All Products'}
                </h1>
                <button onClick={() => setIsFilterOpen(true)} className="lg:hidden p-2 rounded-md bg-gray-800/50 text-white">
                  <FunnelIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="text-indigo-200/60 text-sm sm:text-base">
                Showing {products.length} of {totalProducts} products
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-800/50 backdrop-blur-sm rounded-lg p-1">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-indigo-200/60 hover:text-white'}`}>
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-indigo-200/60 hover:text-white'}`}>
                    <Bars4Icon className="h-5 w-5" />
                  </button>
                </div>
                {/* Sort Dropdown */}
                <div className="relative w-full sm:w-auto">
                  <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="appearance-none bg-gray-800/50 backdrop-blur-sm text-white rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto text-sm">
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

            {/* Products Grid or No Results */}
            {!isLoading && products.length === 0 && !errorMessage ? (
              <NotFound 
                type="search"
                title="No Products Found"
                message="We couldn't find any products matching your criteria. Try adjusting your filters or browse our categories."
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
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-white rounded-md hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <span className="text-indigo-200/60">Page {page} of {Math.ceil(totalProducts / 12)}</span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page >= Math.ceil(totalProducts / 12)} className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm text-white rounded-md hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Bottom Gradient - Same as HeroSection */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>
    </div>
  );
};

export default ProductPage;
