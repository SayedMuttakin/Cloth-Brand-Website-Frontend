import React from 'react';
import { mockProducts } from '../../data/mockProducts';

const ProductDebug = () => {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Mock Products Debug</h1>
      <div className="grid gap-4">
        {mockProducts.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">ID: {product.id} - {product.name}</h2>
            <p>Price: ${product.price}</p>
            <p>Colors: {product.colors?.join(', ') || 'None'}</p>
            <p>Sizes: {product.sizes?.join(', ') || 'None'}</p>
            <p>Stock: {product.stock}</p>
            <a 
              href={`/products/${product.id}`} 
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Product Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDebug;