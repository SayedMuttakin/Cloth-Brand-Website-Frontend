import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBagIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const shipping = 10.00;
  const tax = cartTotal * 0.1; // 10% tax
  const total = cartTotal + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    } else {
      toast.error('Your cart is empty!');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="relative min-h-screen mt-2 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <ShoppingCartIcon className="mx-auto h-24 w-24 text-indigo-500/50 mb-8" />
            <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
            <p className="text-indigo-200/60 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5"
            >
              <span className="relative inline-flex items-center justify-center w-full h-full px-8 py-3.5 bg-gray-900 rounded-full group-hover:bg-opacity-0 transition-all duration-300">
                <span className="absolute flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:translate-x-0 ease">
                  <ShoppingBagIcon className="h-5 w-5" />
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                  Start Shopping
                </span>
                <span className="relative invisible">Start Shopping</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen mt-2 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Shopping Cart</h1>
          <p className="text-indigo-200/60 max-w-2xl mx-auto text-lg">
            Review and manage your items
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={`${item._id}-${item.color}-${item.size}`}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10 hover:border-indigo-500/30 transition-colors"
              >
                <div className="flex items-center gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-800">
                    <img
                      src={item.image.startsWith('http://') || item.image.startsWith('https://') ? item.image : `${import.meta.env.VITE_API_BASE_URL}/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/96x96/333/FFF?text=No+Image'; // Fallback image
                        console.error('Error loading image for product:', item.name, 'URL:', item.image);
                      }}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {item.name}
                    </h3>
                    <div className="text-indigo-200/60 text-sm space-x-4">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => updateQuantity(item._id, item.color, item.size, item.quantity - 1)}
                          className="p-1 rounded-lg border border-indigo-500/30 text-indigo-200/60 hover:border-indigo-500 hover:text-white transition-colors"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="text-white font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.color, item.size, item.quantity + 1)}
                          className="p-1 rounded-lg border border-indigo-500/30 text-indigo-200/60 hover:border-indigo-500 hover:text-white transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item._id, item.color, item.size)}
                          className="p-2 rounded-lg border border-rose-500/30 text-rose-200/60 hover:border-rose-500 hover:text-rose-500 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center text-indigo-200/60 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/10 sticky top-20">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-indigo-200/60">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-indigo-200/60">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-indigo-200/60">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>
                <div className="flex justify-between text-white font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="group relative inline-flex items-center justify-center w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 font-medium"
              >
                <span className="relative flex items-center justify-center w-full h-full px-6 py-3 bg-gray-900 rounded-[0.7rem] group-hover:bg-opacity-0 transition-all duration-300">
                  <span className="absolute flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:translate-x-0 ease">
                    <ShoppingBagIcon className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                    <ShoppingBagIcon className="h-5 w-5 mr-2" />
                    Proceed to Checkout
                  </span>
                  <span className="relative invisible">
                    <ShoppingBagIcon className="h-5 w-5 mr-2 inline" />
                    Proceed to Checkout
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;