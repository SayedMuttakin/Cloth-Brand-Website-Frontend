
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllProducts } from '../../services/productService';
import { getCategoryBySlug } from '../../services/categoryService';
import ProductCard from '../shared/ProductCard';
import FeaturedCategories from '../home/FeaturedCategories';

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryImage, setCategoryImage] = useState('');

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const categoryResponse = await getCategoryBySlug(categorySlug);
        if (categoryResponse.data && categoryResponse.data.category) {
          setCategoryImage(categoryResponse.data.category.image);
        }

        const productsResponse = await getAllProducts({ category: categorySlug });
        if (productsResponse.data && productsResponse.data.products) {
          setProducts(productsResponse.data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-white">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat py-16"
      style={{ backgroundImage: `url(${categoryImage})` }}
    >
      <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 capitalize">
          {categorySlug.replace(/-/g, ' ')}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-white col-span-full text-center">No products found in this category.</p>
          )}
        </div>

        <div className="mt-16">
          <FeaturedCategories />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
