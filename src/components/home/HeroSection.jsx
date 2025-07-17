import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, FireIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  return (
    <div className="relative min-h-[calc(100vh-60px)] h-auto mt-[60px] bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      {/* Main Content */}
      <div className="relative w-full h-full overflow-y-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Text Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* New Arrival Badge */}
              <div className="flex items-center space-x-2">
                <span className="flex items-center px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium">
                  <FireIcon className="h-4 w-4 mr-1" />
                  New Arrivals
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                <span className="block text-white">Discover Your</span>
                <span className="block mt-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Perfect Style
                  </span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-indigo-100/80 text-lg max-w-2xl">
                Experience premium fashion at unbeatable prices. Shop the latest trends and discover your unique style with our curated collection.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/products"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5"
                >
                  <span className="relative inline-flex items-center justify-center w-full h-full px-8 py-3.5 bg-gray-900 rounded-full group-hover:bg-opacity-0 transition-all duration-300">
                    <span className="absolute flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:translate-x-0 ease">
                      <ShoppingBagIcon className="h-5 w-5" />
                    </span>
                    <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                      Shop Now
                    </span>
                    <span className="relative invisible">Shop Now</span>
                  </span>
                </Link>
                
                <Link
                  to="/categories"
                  className="group inline-flex items-center justify-center px-8 py-4 font-medium text-white bg-gray-800/50 rounded-full hover:bg-gray-700/50 transition duration-300 backdrop-blur-sm"
                >
                  Explore More
                  <ChevronRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-indigo-500/20">
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-white">20k+</p>
                  <p className="text-indigo-200/60 mt-1 text-sm sm:text-base">Products</p>
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-white">50k+</p>
                  <p className="text-indigo-200/60 mt-1 text-sm sm:text-base">Customers</p>
                </div>
                <div>
                  <p className="text-2xl lg:text-3xl font-bold text-white">95%</p>
                  <p className="text-indigo-200/60 mt-1 text-sm sm:text-base">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Products Grid */}
            <div className="relative grid grid-cols-2 gap-2 md:gap-3 lg:gap-4 mt-8 lg:mt-0">
              {/* Product Images */}
              <div className="space-y-2 md:space-y-3 lg:space-y-4">
                <div className="aspect-[4/5] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm">
                  <img 
                    src="https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Fashion Product 1" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="eager"
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x500/333/FFF?text=Fashion';
                    }}
                  />
                </div>
                <div className="aspect-[4/5] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                  <img 
                    src="https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Fashion Product 2" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="eager"
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x500/333/FFF?text=Fashion';
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2 md:space-y-3 lg:space-y-4 mt-4 sm:mt-6 lg:mt-8">
                <div className="aspect-[4/5] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm">
                  <img 
                    src="https://images.pexels.com/photos/2866119/pexels-photo-2866119.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Fashion Product 3" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="eager"
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x500/333/FFF?text=Fashion';
                    }}
                  />
                </div>
                <div className="aspect-[4/5] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-indigo-500/10 to-pink-500/10 backdrop-blur-sm">
                  <img 
                    src="https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Fashion Product 4" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    loading="eager"
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/400x500/333/FFF?text=Fashion';
                    }}
                  />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -inset-4 -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>
    </div>
  );
};

export default HeroSection; 