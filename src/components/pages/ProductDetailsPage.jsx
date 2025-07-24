import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  HeartIcon,
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  StarIcon as StarOutline
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';
import { getProduct } from '../../services/productService';
import { getProductReviews } from '../../services/reviewService';
import { mockProducts } from '../../data/mockProducts';
import NotFound from '../common/NotFound';
import ReviewSection from '../products/ReviewSection';
import { trackColorView, trackColorSelection, trackColorAddToCart } from '../../services/colorTrackingService';
import { trackSizeView, trackSizeSelection, trackSizeAddToCart, trackColorSizeSelection } from '../../services/sizeTrackingService';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProductDetailsPage = () => {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewData, setReviewData] = useState({ reviews: [], totalReviews: 0, averageRating: 0 });

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedColorVariant, setSelectedColorVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { addToCart } = useCart();

  // Color hex mapping for converting string colors to hex values
  const colorHexMap = {
    'red': '#FF0000',
    'blue': '#0000FF',
    'green': '#008000',
    'yellow': '#FFFF00',
    'orange': '#FFA500',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'brown': '#A52A2A',
    'black': '#000000',
    'white': '#FFFFFF',
    'gray': '#808080',
    'grey': '#808080',
    'navy': '#000080',
    'tan': '#D2B48C',
    'beige': '#F5F5DC',
    'maroon': '#800000',
    'olive': '#808000',
    'lime': '#00FF00',
    'aqua': '#00FFFF',
    'teal': '#008080',
    'silver': '#C0C0C0',
    'gold': '#FFD700'
  };

  // Function to normalize colors - convert string colors to objects with name and hex
  const normalizeColors = (colors) => {
    if (!colors || !Array.isArray(colors)) return [];
    
    return colors.map(color => {
      // If color is already an object with name and hex, return as is
      if (typeof color === 'object' && color.name && color.hex) {
        return color;
      }
      
      // If color is a string, convert to object
      if (typeof color === 'string') {
        return {
          name: color,
          hex: colorHexMap[color.toLowerCase()] || '#000000'
        };
      }
      
      return null;
    }).filter(Boolean);
  };

  // Function to get colors for display - prioritize admin panel colors
  const getDisplayColors = (productData) => {
    if (!productData) return [];
    
    // First priority: colorVariants from admin panel (with images and stock)
    if (productData.colorVariants && productData.colorVariants.length > 0) {
      console.log('Using colorVariants from admin panel:', productData.colorVariants);
      return productData.colorVariants;
    }
    
    // Second priority: colors array from admin panel
    if (productData.colors && productData.colors.length > 0) {
      console.log('Using colors from admin panel:', productData.colors);
      return normalizeColors(productData.colors);
    }
    
    // Fallback: default colors (only for mock products)
    if (typeof productData.id === 'number' || (typeof productData.id === 'string' && /^\d+$/.test(productData.id))) {
      return [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Blue', hex: '#0000FF' }
      ];
    }
    
    return [];
  };

  // Function to get sizes for display - prioritize admin panel sizes
  const getDisplaySizes = (productData) => {
    if (!productData || !productData.sizes || productData.sizes.length === 0) return [];
    
    // Use sizes directly from productData.sizes
    const uniqueSizes = [...new Set(productData.sizes)];
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    
    // Sort sizes based on predefined order
    const sortedSizes = uniqueSizes.sort((a, b) => {
      const indexA = sizeOrder.indexOf(a);
      const indexB = sizeOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
    
    return sortedSizes;
  };

  // Function to handle size selection with tracking
  const handleSizeSelection = (size) => {
    setSelectedSize(size);
    
    // Track size selection
    if (product) {
      trackSizeSelection(product._id || product.id, size);
      
      // Track combined color-size selection if both are selected
      if (selectedColor) {
        const colorHex = selectedColorVariant?.hex || 
          normalizeColors([selectedColor])[0]?.hex || 
          '#000000';
        trackColorSizeSelection(product._id || product.id, selectedColor, colorHex, size);
      }
    }
  };

  // Function to handle color selection and image switching
  const handleColorSelection = (color, colorVariant = null) => {
    setSelectedColor(color.name);
    setSelectedColorVariant(colorVariant);
    
    // Switch to color-specific images if available
    if (colorVariant && colorVariant.images && colorVariant.images.length > 0) {
      setSelectedImage(0); // Reset to first image of the selected color
      console.log('Switching to color-specific images:', colorVariant.images);
    }
    
    // Track color selection
    if (product) {
      trackColorSelection(product._id || product.id, color.name, color.hex);
      
      // Track combined color-size selection if both are selected
      if (selectedSize) {
        trackColorSizeSelection(product._id || product.id, color.name, color.hex, selectedSize);
      }
    }
  };

  // Function to get current images (color-specific or default)
  const getCurrentImages = () => {
    // Helper function to format image URL
    const formatImageUrl = (img) => {
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return img;
      } else if (img.startsWith('/')) {
        return `${API_URL.replace('/api', '')}${img}`;
      } else {
        return `${API_URL.replace('/api', '')}/${img}`;
      }
    };

    // First priority: color-specific images from selected color variant
    if (selectedColorVariant && selectedColorVariant.images && selectedColorVariant.images.length > 0) {
      console.log('Using color-specific images from selectedColorVariant:', selectedColorVariant.images);
      return selectedColorVariant.images.map(formatImageUrl);
    }
    
    // Second priority: product images
    if (product && product.images && product.images.length > 0) {
      return product.images.map(formatImageUrl);
    }
    
    // Third priority: single product image
    if (product && product.image) {
      return [formatImageUrl(product.image)];
    }
    
    // Fallback: placeholder
    return ['https://placehold.co/400x500/333/FFF?text=Product'];
  };

  // Function to get available stock for selected color
  const getAvailableStock = () => {
    if (selectedColorVariant && selectedColorVariant.stock !== undefined) {
      return selectedColorVariant.stock;
    }
    return product?.stock || 0;
  };

  // Function to fetch review data
  const fetchReviewData = async (productId) => {
    try {
      const response = await getProductReviews(productId, { limit: 100 });
      if (response.status === 'success' && response.data) {
        const reviews = response.data.reviews || [];
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
          : 0;
        
        setReviewData({
          reviews,
          totalReviews,
          averageRating: Math.round(averageRating * 10) / 10
        });
      }
    } catch (error) {
      console.log('Could not fetch reviews:', error);
      // Keep default values if reviews can't be fetched
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('ProductDetailsPage: Fetching product with ID:', productId);

        if (!productId) {
          throw new Error("Product ID not found");
        }

        // First try to fetch from backend (for admin panel products)
        let displayColors = []; // Initialize displayColors here
        try {
          console.log('ProductDetailsPage: Trying to fetch from backend...');
          const response = await getProduct(productId);

          if (response.status === 'success' && response.data.product) {
            console.log('ProductDetailsPage: Found backend product:', response.data.product);
            const productData = response.data.product;
            
            // Process backend product data to ensure proper color and size handling
            const processedProduct = {
              ...productData,
              // Ensure colors are properly formatted
              colors: productData.colors || [],
              colorVariants: productData.colorVariants || [],
              // Ensure sizes are properly formatted
              sizes: productData.sizes || [],
              // Ensure images are properly formatted
              images: productData.images || [productData.image].filter(Boolean)
            };
            
            console.log('Processed backend product:', processedProduct);
            setProduct(processedProduct);
            console.log('ProductDetailsPage: product.colorVariants after processing:', processedProduct.colorVariants);
            
            // Auto-select first color from backend data
            // const displayColors = getDisplayColors(processedProduct);
            // if (displayColors.length > 0) {
            //   const firstColor = displayColors[0];
            //   setSelectedColor(firstColor.name);
            //   if (firstColor.stock !== undefined) {
            //     setSelectedColorVariant(firstColor);
            //   }
            // }
            
            // Don't auto-select size - let user choose
            // const displaySizes = getDisplaySizes(processedProduct);
            // if (displaySizes.length > 0) {
            //   setSelectedSize(displaySizes[0]);
            // }

            // Track color and size views
            const displayColors = getDisplayColors(processedProduct);
            trackColorView(productData._id || productData.id, displayColors);
            const displaySizes = getDisplaySizes(processedProduct);
            trackSizeView(productData._id || productData.id, displaySizes);
            
            // Fetch review data for the product
            await fetchReviewData(productData._id || productData.id);
            return; // Exit early if backend product found
          }
        } catch (backendError) {
          console.log('ProductDetailsPage: Backend fetch failed, trying mock products:', backendError);
        }

        // Fallback to mock products if backend fails
        const mockProduct = mockProducts.find(
          (p) => String(p.id) === String(productId)
        );
        
        if (mockProduct) {
          console.log('ProductDetailsPage: Found mock product:', mockProduct);
          setProduct(mockProduct);
          
          // Auto-select first color
          // const displayColors = getDisplayColors(mockProduct);
          // if (displayColors.length > 0) {
          //   const firstColor = displayColors[0];
          //   setSelectedColor(firstColor.name);
          //   if (firstColor.stock !== undefined) {
          //     setSelectedColorVariant(firstColor);
          //   }
          // }
          
          // Don't auto-select size - let user choose
          // const displaySizes = getDisplaySizes(mockProduct);
          // if (displaySizes.length > 0) {
          //   setSelectedSize(displaySizes[0]);
          // }
          
          // Track color and size views
          const displayColors = getDisplayColors(mockProduct);
          trackColorView(mockProduct.id, displayColors);
          const displaySizes = getDisplaySizes(mockProduct);
          trackSizeView(mockProduct.id, displaySizes);
          
          // Fetch review data for mock product
          await fetchReviewData(mockProduct.id);
        } else {
          throw new Error("Product not found");
        }
      } catch (err) {
        console.error('ProductDetailsPage: Error fetching product:', err);
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    try {
      // Validate color selection if colors are available
      const displayColors = getDisplayColors(product);
      if (displayColors.length > 0 && !selectedColor) {
        toast.error('Please select a color');
        return;
      }

      // Validate size selection if sizes are available
      const displaySizes = getDisplaySizes(product);
      if (displaySizes.length > 0 && !selectedSize) {
        toast.error('Please select a size');
        return;
      }

      // Check stock (use color-specific stock if available)
      const availableStock = getAvailableStock();
      if (availableStock === 0) {
        toast.error('Product is out of stock');
        return;
      }

      if (quantity > availableStock) {
        toast.error(`Only ${availableStock} items available`);
        return;
      }

      // Add to cart
      addToCart(product, quantity, selectedColor, selectedSize, getCurrentImages()[0]);
      
      // Track add to cart with color and size
      if (selectedColor) {
        const colorHex = selectedColorVariant?.hex || 
          normalizeColors([selectedColor])[0]?.hex || 
          '#000000';
        trackColorAddToCart(product._id || product.id, selectedColor, colorHex);
      }
      
      if (selectedSize) {
        trackSizeAddToCart(product._id || product.id, selectedSize);
      }
      
      // Track combined color-size add to cart
      if (selectedColor && selectedSize) {
        const colorHex = selectedColorVariant?.hex || 
          normalizeColors([selectedColor])[0]?.hex || 
          '#000000';
        trackColorSizeSelection(product._id || product.id, selectedColor, colorHex, selectedSize);
      }
      
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    }
  };

  // Handle mouse events for image zoom
  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setMousePosition({ x: 0, y: 0 }); // Reset position
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Error state or No product found
  if (error || !product) {
    return (
      <NotFound 
        type="product"
        title="Product Not Found"
        message={error || "The product you're looking for doesn't exist or has been removed."}
      />
    );
  }

  // রেটিং স্টার রেন্ডার করুন
  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return starValue <= rating ? (
        <StarSolid key={index} className="h-5 w-5 text-yellow-400" />
      ) : starValue - 0.5 <= rating ? (
        <StarSolid key={index} className="h-5 w-5 text-yellow-400/50" />
      ) : (
        <StarOutline key={index} className="h-5 w-5 text-yellow-400/30" />
      );
    });
  };

  const displayColors = getDisplayColors(product);
  const displaySizes = getDisplaySizes(product);

  return (
    <div className="mt-8 relative min-h-screen mt-2 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10 relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <img
                src={getCurrentImages()[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover rounded-lg transition-transform duration-300 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                style={{
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }}
              />
            </div>
            {/* Thumbnail Images */}
            {getCurrentImages().length > 1 ? (
              <div className="grid grid-cols-4 gap-4">
                {getCurrentImages().map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm border transition-all duration-300 flex items-center justify-center p-2 ${
                      selectedImage === index
                        ? 'border-indigo-500 ring-2 ring-indigo-500'
                        : 'border-indigo-500/10 hover:border-indigo-500/30'
                    }`}
                  >
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderRatingStars(reviewData.averageRating || product.rating || 4.5)}
                  <span className="text-indigo-200/60 ml-2">
                    ({reviewData.totalReviews || 0} reviews)
                  </span>
                </div>
                <span className="text-indigo-200/60">|</span>
                <span className="text-indigo-400">{product.brand || 'Premium Brand'}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-white">
                  ${(product.price || 99.99).toFixed(2)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-indigo-200/60 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-rose-500 font-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-indigo-200/60">{product.description || 'High-quality product with excellent features and design.'}</p>
              {/* Bullet Points (max 5) */}
              {Array.isArray(product.bullets) && product.bullets.length > 0 && (
                <ul className="list-disc pl-5 mt-2 mb-2 text-indigo-200 text-sm">
                  {product.bullets.slice(0, 5).map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
              {/* Details Paragraph */}
              {product.details && (
                <p className="text-indigo-100/80 text-xs mt-2 whitespace-pre-line">{product.details}</p>
              )}
            </div>

            {/* Color Selection - Show only if colors exist */}
            {displayColors.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-3">Color</h3>
                <div className="flex gap-3 flex-wrap">
                  {displayColors.map((color) => (
                    <button
                      key={`${color.name}-${color.hex}`}
                      onClick={() => handleColorSelection(color, color.stock !== undefined ? color : null)}
                      className={`w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 relative ${
                        selectedColor === color.name
                          ? 'border-white ring-2 ring-indigo-500 shadow-lg'
                          : 'border-transparent hover:border-white/50'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name.charAt(0).toUpperCase() + color.name.slice(1)}${color.stock !== undefined ? ` (${color.stock} available)` : ''}`}
                    >
                      {/* Stock indicator */}
                      {color.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✕</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-indigo-500/20">
                    <p className="text-indigo-200/80 text-sm">
                      <span className="font-medium">Selected Color:</span> {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}
                    </p>
                    {selectedColorVariant && (
                      <p className="text-indigo-200/60 text-xs mt-1">
                        Stock: {selectedColorVariant.stock} available
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Size Selection - Show only if sizes exist */}
            {displaySizes.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-4">
                  Size <span className="text-red-400">*</span>
                  {!selectedSize && (
                    <span className="text-sm text-red-400 ml-2">(Please select a size)</span>
                  )}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
                  {displaySizes.map((size, index) => (
                    <button
                      key={`${size}-${index}`}
                      onClick={() => handleSizeSelection(size)}
                      className={`relative px-4 py-3 rounded-xl border-2 transition-all duration-300 font-bold text-center min-h-[50px] flex items-center justify-center ${
                        selectedSize === size
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-400 text-white shadow-xl transform scale-105 ring-2 ring-indigo-300'
                          : 'border-indigo-500/30 text-indigo-200/80 hover:border-indigo-400 hover:text-white hover:bg-indigo-500/20 hover:scale-102'
                      }`}
                      title={`Select size ${size}`}
                    >
                      <span className="text-lg">{size}</span>
                      {selectedSize === size && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-indigo-500/20">
                    <p className="text-indigo-200/80 text-sm">
                      <span className="font-medium">Selected Size:</span> {selectedSize}
                    </p>
                    <p className="text-indigo-200/60 text-xs mt-1">
                      Make sure this size fits you perfectly
                    </p>
                    {selectedColor && (
                      <p className="text-indigo-200/60 text-xs mt-1">
                        <span className="font-medium">Color & Size:</span> {selectedColor} - {selectedSize}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Size Guide */}
                <div className="mt-4 p-4 bg-gray-800/20 rounded-lg border border-indigo-500/10">
                  <h4 className="text-white font-medium mb-2">Size Guide</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-indigo-200/60">
                    <div><span className="font-medium">XS:</span> Extra Small</div>
                    <div><span className="font-medium">S:</span> Small</div>
                    <div><span className="font-medium">M:</span> Medium</div>
                    <div><span className="font-medium">L:</span> Large</div>
                    <div><span className="font-medium">XL:</span> Extra Large</div>
                    <div><span className="font-medium">XXL:</span> Double XL</div>
                  </div>
                  <p className="text-xs text-indigo-200/40 mt-2">
                    Sizes may vary by brand. Check product description for specific measurements.
                  </p>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-white font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-indigo-500/30 text-indigo-200/60 hover:border-indigo-500 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="text-white font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-indigo-500/30 text-indigo-200/60 hover:border-indigo-500 hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={getAvailableStock() === 0}
                className={`flex-1 group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 font-medium ${
                  getAvailableStock() === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span className="relative flex items-center justify-center w-full h-full px-6 py-3 bg-gray-900 rounded-[0.4rem] group-hover:bg-opacity-0 transition-all duration-300">
                  <span className="absolute flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:translate-x-0 ease">
                    <ShoppingBagIcon className="h-5 w-5 mr-2" />
                    {getAvailableStock() === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                    <ShoppingBagIcon className="h-5 w-5 mr-2" />
                    {getAvailableStock() === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </span>
                  <span className="relative invisible">
                    <ShoppingBagIcon className="h-5 w-5 mr-2" />
                    {getAvailableStock() === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </span>
                </span>
              </button>
              <button className="p-4 rounded-lg border border-indigo-500/30 text-indigo-200/60 hover:border-indigo-500 hover:text-white transition-colors">
                <HeartIcon className="h-6 w-6" />
              </button>
              <button className="p-4 rounded-lg border border-indigo-500/30 text-indigo-200/60 hover:border-indigo-500 hover:text-white transition-colors">
                <ShareIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-indigo-500/20 pt-8">
              <h3 className="text-white font-semibold mb-4">Product Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(product.features || ['High Quality Material', 'Comfortable Fit', 'Durable Construction', 'Easy Care']).map((feature) => (
                  <li key={feature} className="flex items-center text-indigo-200/60">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-indigo-500/20 pt-8">
              <div className="flex items-center gap-3">
                <TruckIcon className="h-8 w-8 text-indigo-400" />
                <div>
                  <h4 className="text-white font-medium">Free Shipping</h4>
                  <p className="text-sm text-indigo-200/60">On orders over $100</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
                <div>
                  <h4 className="text-white font-medium">Secure Payment</h4>
                  <p className="text-sm text-indigo-200/60">100% secure checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ArrowPathIcon className="h-8 w-8 text-indigo-400" />
                <div>
                  <h4 className="text-white font-medium">Easy Returns</h4>
                  <p className="text-sm text-indigo-200/60">30 day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Review Section - Always show reviews */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ReviewSection 
          productId={product._id || product.id} 
          onReviewUpdate={() => fetchReviewData(product._id || product.id)}
        />
      </div>
    </div>
  );
};

export default ProductDetailsPage;