import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, isLoading }) => {
  console.log('ProductList received products:', products);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl overflow-hidden w-full max-w-sm">
            <div className="aspect-[4/5] bg-gray-800" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-800 rounded w-1/3" />
              <div className="h-6 bg-gray-800 rounded w-3/4" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-4 bg-gray-800 rounded" />
                ))}
              </div>
              <div className="h-6 bg-gray-800 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(products)) {
    return (
      <div className="text-center py-12">
        <h3 className="font-heading text-2xl text-white mb-2">Error Loading Products</h3>
        <p className="text-indigo-200/60">There was an error loading the products. Please try again later.</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <h3 className="font-heading text-2xl text-white mb-2">No Products Found</h3>
        <p className="text-indigo-200/60">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;