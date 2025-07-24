import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, HeartIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  console.log('ProductCard received product:', product);

  const {
    _id,
    id,
    name = '',
    price = 0,
    discountPrice,
    images = [],
    ratings = 0,
    category = {},
    isNewProduct = false,
    brand = '',
    stock = 0
  } = product || {};

  const productId = id || _id;
  const image = images && images.length > 0 ? (images[0].startsWith('http') ? images[0] : (images[0].startsWith('/') ? `${API_URL.replace('/api', '')}${images[0]}` : `${API_URL.replace('/api', '')}/${images[0]}`)) : 'https://placehold.co/400x500/333/FFF?text=Product';
  
  const discount = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;
  const finalPrice = discountPrice || price;

  // Get category name directly from the category object
  const categoryName = category?.name || 'Uncategorized';

  return (
    <div className="group relative w-full max-w-sm mx-auto bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 flex flex-col">
      {/* Product Image */}
      <div className="relative overflow-hidden flex-shrink-0 aspect-[4/3] sm:aspect-[3/4] w-full">
        <Link to={`/products/${productId}`}>
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x500/333/FFF?text=Product';
            }}
          />
        </Link>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {isNewProduct && (
            <span className="bg-indigo-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-lg">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-rose-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-lg">
              -{discount}%
            </span>
          )}
          {stock === 0 && (
            <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-lg">
              Out of Stock
            </span>
          )}
        </div>
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button className="bg-white/90 hover:bg-white p-1.5 rounded-full text-gray-900 hover:text-rose-500 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-110">
            <HeartIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between p-4 pb-2">
        <div>
          <Link to={`/products/${productId}`} className="block">
            <div className="flex justify-between items-start mb-1">
              <p className="text-indigo-400 text-xs font-semibold truncate max-w-[100px]">
                {categoryName}
              </p>
              {brand && <p className="text-indigo-300 text-xs font-semibold truncate max-w-[60px]">{brand}</p>}
            </div>
            <h3 className="font-heading text-white font-semibold mb-1 group-hover:text-indigo-300 transition-colors duration-200 text-base line-clamp-2 min-h-[2.5rem]">
              {name}
            </h3>
            {/* Bullet Points (max 5) */}
            {Array.isArray(product.bullets) && product.bullets.length > 0 && (
              <ul className="list-disc pl-5 mb-2 text-indigo-200 text-sm">
                {product.bullets.slice(0, 5).map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )}
            {/* Details Paragraph */}
            {product.details && (
              <p className="text-indigo-100/80 text-xs mb-2 whitespace-pre-line">{product.details}</p>
            )}
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`h-4 w-4 ${
                    index < Math.floor(ratings)
                      ? 'text-yellow-400'
                      : 'text-gray-500'
                  }`}
                />
              ))}
              <span className="text-indigo-200/60 text-xs ml-1">({ratings.toFixed(1)})</span>
            </div>
            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <p className="text-lg font-bold text-white">
                ${finalPrice.toFixed(2)}
              </p>
              {discount > 0 && (
                <p className="text-indigo-200/60 line-through text-xs">
                  ${price.toFixed(2)}
                </p>
              )}
            </div>
          </Link>
        </div>
      </div>
      {/* Add to Cart Button - always at the bottom */}
      <div className="px-4 pb-4">
        <button 
          className={`group/btn relative inline-flex items-center justify-center w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 font-medium text-sm ${stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={stock === 0}
          onClick={handleAddToCart}
        >
          <span className="relative flex items-center justify-center w-full h-full px-4 py-2 bg-gray-900 rounded-[0.7rem] group-hover/btn:bg-opacity-0 transition-all duration-300">
            <span className="absolute flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover/btn:translate-x-0 ease">
              <ShoppingBagIcon className="h-4 w-4 mr-1" />
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover/btn:translate-x-full ease">
              {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </span>
            <span className="relative invisible">{stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;