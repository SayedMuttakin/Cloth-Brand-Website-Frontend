import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBagIcon, StarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { getProducts } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import NotFound from '../common/NotFound';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CategoryProductsPage = () => {
  const { categorySlug } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const formatImageUrl = (img) => {
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    } else if (img.startsWith('/')) {
      return `${API_URL.replace('/api', '')}${img}`;
    } else {
      return `${API_URL.replace('/api', '')}/${img}`;
    }
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // Use the category filter directly in the API call
        const response = await getProducts({ category: categorySlug, limit: 100 });
        
        if (response && response.data && response.data.products) {
          // Convert categorySlug back to original category name
          const originalCategoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          setProducts(response.data.products);
          setCategoryName(originalCategoryName);
        } else {
          setProducts([]);
          // Still set category name even if no products found
          const originalCategoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          setCategoryName(originalCategoryName);
        }
      } catch (err) {
        console.error('Error fetching category products:', err);
        setError('Failed to load products');
        // Still set category name even on error
        const originalCategoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        setCategoryName(originalCategoryName);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchCategoryProducts();
    }
  }, [categorySlug]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen mt-2 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="text-white mt-4">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen mt-2 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <NotFound 
            type="error"
            title="Failed to Load Products"
            message={error}
          />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="relative min-h-screen mt-2 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <NotFound 
            type="search"
            title="No Products Found"
            message={`No products found in "${categoryName}" category.`}
          />
        </div>
      </div>
    );
  }

  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return starValue <= rating ? (
        <StarIconSolid key={index} className="h-4 w-4 text-yellow-400" />
      ) : starValue - 0.5 <= rating ? (
        <StarIconSolid key={index} className="h-4 w-4 text-yellow-400/50" />
      ) : (
        <StarIcon key={index} className="h-4 w-4 text-yellow-400/30" />
      );
    });
  };

  return (
    <div className="relative min-h-screen mt-2 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/categories"
            className="inline-flex items-center text-indigo-200 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Categories
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {categoryName}
          </h1>
          <p className="text-indigo-200/60 max-w-2xl mx-auto text-lg">
            Explore our collection of {categoryName.toLowerCase()} ({products.length} products)
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group relative bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
            >
              {/* Product Image */}
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={product.images && product.images.length > 0 ? formatImageUrl(product.images[0]) : 'https://placehold.co/400x500/333/FFF?text=Product'}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x500/333/FFF?text=Product';
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quick Add Button */}
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="group/btn relative inline-flex items-center justify-center w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 font-medium"
                  >
                    <span className="relative flex items-center justify-center w-full h-full px-6 py-3 bg-gray-900 rounded-[0.7rem] group-hover/btn:bg-opacity-0 transition-all duration-300">
                      <span className="absolute flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover/btn:translate-x-0 ease">
                        <ShoppingBagIcon className="h-5 w-5" />
                      </span>
                      <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover/btn:translate-x-full ease">
                        Add to Cart
                      </span>
                      <span className="relative invisible">Add to Cart</span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link 
                  to={`/products/${product._id}`}
                  className="block"
                >
                  <h3 className="text-white font-semibold mb-2 group-hover:text-indigo-300 transition-colors duration-200 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center space-x-1 mb-2">
                  {renderRatingStars(product.rating || 4.5)}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-white">
                    ${product.price}
                  </p>
                  {product.stock && product.stock < 10 && (
                    <span className="text-xs text-orange-400">
                      Only {product.stock} left
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

              </div>
    </div>
  );
};

export default CategoryProductsPage;