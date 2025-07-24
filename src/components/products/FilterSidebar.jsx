
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FilterSidebar = ({ filters, selectedFilters, onFilterChange, onClearFilters, isOpen, onClose }) => {
  const handlePriceChange = (min, max) => {
    onFilterChange('priceRange', `${min}-${max}`);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-gray-800/90 backdrop-blur-sm p-6 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-72 lg:bg-transparent lg:p-0`}>
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h2 className="text-xl font-bold text-white">Filters</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Category</h3>
        <div className="space-y-2">
          {filters.categories && filters.categories.map(category => (
            <button key={category.value} onClick={() => onFilterChange('category', category.value)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedFilters.category === category.value ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Price Range</h3>
        <div className="space-y-2">
          {filters.priceRanges && filters.priceRanges.map(range => (
            <button key={range.value} onClick={() => handlePriceChange(range.min, range.max)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedFilters.priceRange === `${range.min}-${range.max}` ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
              {range.label} ({range.count})
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Color</h3>
        <div className="flex flex-wrap gap-2">
          {filters.colors && filters.colors.map(color => (
            <button key={color.value} onClick={() => onFilterChange('color', color.value)} className={`h-8 w-8 rounded-full border-2 ${selectedFilters.color === color.value ? 'border-indigo-500' : 'border-transparent'}`}>
              <span className="block h-full w-full rounded-full" style={{ backgroundColor: color.hex }}></span>
            </button>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {filters.sizes && filters.sizes.map(size => (
            <button key={size.value} onClick={() => onFilterChange('size', size.value)} className={`px-3 py-1 rounded-md text-sm ${selectedFilters.size === size.value ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Brand</h3>
        <div className="space-y-2">
          {filters.brands && filters.brands.map(brand => (
            <button key={brand.value} onClick={() => onFilterChange('brand', brand.value)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedFilters.brand === brand.value ? 'bg-indigo-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
              {brand.label} ({brand.count})
            </button>
          ))}
        </div>
      </div>

      <button onClick={onClearFilters} className="w-full py-2 px-4 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-colors">
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
