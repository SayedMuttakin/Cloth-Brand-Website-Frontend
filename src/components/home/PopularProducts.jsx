import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPopularProducts } from '../../services/productService';
import ProductCard from '../products/ProductCard';
import { toast } from 'react-hot-toast';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await getPopularProducts();
        let fetchedProducts = Array.isArray(response?.data?.products) ? response.data.products : [];
        // If no products fetched, add demo products
        if (!fetchedProducts || fetchedProducts.length === 0) {
          fetchedProducts = [
            {
              _id: 'demo1',
              name: 'Demo T-Shirt',
              price: 499,
              image: 'https://placehold.co/400x400?text=T-Shirt',
              description: 'A stylish demo t-shirt for preview.',
            },
            {
              _id: 'demo2',
              name: 'Demo Sneakers',
              price: 1299,
              image: 'https://placehold.co/400x400?text=Sneakers',
              description: 'Trendy demo sneakers for your collection.',
            },
            {
              _id: 'demo3',
              name: 'Demo Backpack',
              price: 899,
              image: 'https://placehold.co/400x400?text=Backpack',
              description: 'A cool demo backpack for everyday use.',
            },
            {
              _id: 'demo4',
              name: 'Demo Watch',
              price: 1599,
              image: 'https://placehold.co/400x400?text=Watch',
              description: 'A modern demo watch to complete your look.',
            },
            {
              _id: 'demo5',
              name: 'Demo Cap',
              price: 299,
              image: 'https://placehold.co/400x400?text=Cap',
              description: 'A trendy demo cap for sunny days.',
            },
            {
              _id: 'demo6',
              name: 'Demo Sunglasses',
              price: 799,
              image: 'https://placehold.co/400x400?text=Sunglasses',
              description: 'Stylish demo sunglasses for your look.',
            },
            {
              _id: 'demo7',
              name: 'Demo Hoodie',
              price: 1099,
              image: 'https://placehold.co/400x400?text=Hoodie',
              description: 'A comfy demo hoodie for all seasons.',
            },
            {
              _id: 'demo8',
              name: 'Demo Belt',
              price: 399,
              image: 'https://placehold.co/400x400?text=Belt',
              description: 'A classic demo belt for your outfit.',
            },
          ];
        }
        setProducts(fetchedProducts);
      } catch (err) {
        // On error, show demo products
        setProducts([
          {
            _id: 'demo1',
            name: 'Demo T-Shirt',
            price: 499,
            image: 'https://placehold.co/400x400?text=T-Shirt',
            description: 'A stylish demo t-shirt for preview.',
          },
          {
            _id: 'demo2',
            name: 'Demo Sneakers',
            price: 1299,
            image: 'https://placehold.co/400x400?text=Sneakers',
            description: 'Trendy demo sneakers for your collection.',
          },
          {
            _id: 'demo3',
            name: 'Demo Backpack',
            price: 899,
            image: 'https://placehold.co/400x400?text=Backpack',
            description: 'A cool demo backpack for everyday use.',
          },
          {
            _id: 'demo4',
            name: 'Demo Watch',
            price: 1599,
            image: 'https://placehold.co/400x400?text=Watch',
            description: 'A modern demo watch to complete your look.',
          },
          {
            _id: 'demo5',
            name: 'Demo Cap',
            price: 299,
            image: 'https://placehold.co/400x400?text=Cap',
            description: 'A trendy demo cap for sunny days.',
          },
          {
            _id: 'demo6',
            name: 'Demo Sunglasses',
            price: 799,
            image: 'https://placehold.co/400x400?text=Sunglasses',
            description: 'Stylish demo sunglasses for your look.',
          },
          {
            _id: 'demo7',
            name: 'Demo Hoodie',
            price: 1099,
            image: 'https://placehold.co/400x400?text=Hoodie',
            description: 'A comfy demo hoodie for all seasons.',
          },
          {
            _id: 'demo8',
            name: 'Demo Belt',
            price: 399,
            image: 'https://placehold.co/400x400?text=Belt',
            description: 'A classic demo belt for your outfit.',
          },
        ]);
        setError(err);
        toast.error('Failed to load popular products.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading popular products...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;
  }

  return (
    <section className="relative py-12 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern - matches HeroSection */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-white text-center mb-8">Popular Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/products"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5"
          >
            <span className="relative inline-flex items-center justify-center w-full h-full px-8 py-3.5 bg-gray-900 rounded-full group-hover:bg-opacity-0 transition-all duration-300">
              <span className="absolute flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:translate-x-0 ease">
                <ShoppingBagIcon className="h-5 w-5" />
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                View All Products
              </span>
              <span className="relative invisible">View All Products</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
