import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  HomeIcon,
  ShoppingBagIcon,
  ViewColumnsIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { searchProducts } from '../../services/productService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  // Mobile search state
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [mobileSearchResults, setMobileSearchResults] = useState([]);
  const [showMobileSearchResults, setShowMobileSearchResults] = useState(false);
  const [mobileSearchLoading, setMobileSearchLoading] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const mobileSearchTimeoutRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (query.trim().length > 2) {
      setSearchLoading(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await searchProducts(query);
          if (response.status === 'success') {
            console.log('Search results:', response.data.products);
            setSearchResults(response.data.products.slice(0, 5));
            setShowSearchResults(true);
          }
        } catch (error) {
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      setSearchLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Mobile search handlers
  const handleMobileSearchChange = (e) => {
    const query = e.target.value;
    setMobileSearchQuery(query);
    if (mobileSearchTimeoutRef.current) {
      clearTimeout(mobileSearchTimeoutRef.current);
    }
    if (query.trim().length > 2) {
      setMobileSearchLoading(true);
      mobileSearchTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await searchProducts(query);
          if (response.status === 'success') {
            console.log('Mobile search results:', response.data.products);
            setMobileSearchResults(response.data.products.slice(0, 5));
            setShowMobileSearchResults(true);
          }
        } catch (error) {
          setMobileSearchResults([]);
        } finally {
          setMobileSearchLoading(false);
        }
      }, 300);
    } else {
      setMobileSearchResults([]);
      setShowMobileSearchResults(false);
      setMobileSearchLoading(false);
    }
  };

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      setShowMobileSearchResults(false);
      setIsOpen(false); // Close mobile menu
      navigate(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setShowMobileSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (mobileSearchTimeoutRef.current) {
        clearTimeout(mobileSearchTimeoutRef.current);
      }
    };
  }, []);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const formatImageUrl = (img) => {
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    } else if (img.startsWith('/')) {
      return `${API_URL.replace('/api', '')}${img}`;
    } else {
      return `${API_URL.replace('/api', '')}/${img}`;
    }
  };

  const navigation = [
    { name: 'Home', to: '/', icon: HomeIcon },
    { name: 'Products', to: '/products', icon: ShoppingBagIcon },
    { name: 'Categories', to: '/categories', icon: ViewColumnsIcon },
    { name: 'About', to: '/about', icon: InformationCircleIcon },
    { name: 'Contact', to: '/contact', icon: EnvelopeIcon },
  ];

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-xl shadow-xl fixed w-full top-0 z-50 border-b border-gray-200/50 h-[64px]">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md transform group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
                <span className="text-xl font-bold text-white">SH</span>
              </div>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all duration-300">ShopHub</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 ml-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Box - Hidden on Mobile, Visible on Desktop */}
          <div className="hidden md:flex flex-1 justify-center items-center relative mx-4">
            <form
              className="w-full max-w-md"
              onSubmit={handleSearchSubmit}
              autoComplete="off"
              ref={searchRef}
            >
              <div className="relative">
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-base bg-white placeholder-gray-500 transition-all duration-200 shadow-sm text-gray-900"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  style={{ color: '#111' }}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute left-0 right-0 mt-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">No results found</div>
                    ) : (
                      searchResults.map((product) => (
                        <Link
                          key={product._id}
                          to={`/products/${product._id}`}
                          className="w-full text-left flex items-center px-4 py-2 cursor-pointer hover:bg-indigo-50 transition-all"
                          onClick={() => {
                            console.log('Clicking product:', product._id, 'Navigating to:', `/products/${product._id}`);
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          tabIndex={0}
                        >
                          <img
                            src={formatImageUrl(product.images?.[0]) || '/placeholder-image.jpg'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded mr-3 border"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.jpg'; console.log('Image load error for:', product.name, 'Original src:', product.images?.[0], 'Formatted src:', formatImageUrl(product.images?.[0])); }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate">{product.category?.name}</div>
                          </div>
                          <div className="ml-2 text-xs text-gray-700 font-semibold">${product.price}</div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-6 ml-4">
            <Link to="/cart" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 hover:scale-105 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute top-[-8px] right-[-8px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs rounded-full px-2">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link
                to="/profile"
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <UserCircleIcon className="h-7 w-7" />
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
            ) : (
              <Link to="/auth/login" className="text-gray-700 hover:text-indigo-600 transition-colors duration-300 hover:scale-105">
                <UserCircleIcon className="h-7 w-7" />
              </Link>
            )}
          </div>

          {/* Mobile menu button and icons */}
          <div className="md:hidden flex items-center space-x-4 ml-2">
            <Link to="/cart" className="text-gray-700 hover:text-indigo-600 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute top-[-8px] right-[-8px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xs rounded-full px-2">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link to="/profile" className="text-gray-700 hover:text-indigo-600">
                <UserCircleIcon className="h-7 w-7" />
              </Link>
            ) : (
              <Link to="/auth/login" className="text-gray-700 hover:text-indigo-600">
                <UserCircleIcon className="h-7 w-7" />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed top-[20px] inset-x-0 bottom-0 z-40 md:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div
          className="fixed top-[20px] inset-x-0 bottom-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>

        <div className={`fixed top-[20px] bottom-0 right-0 w-[80%] max-w-sm bg-white/95 backdrop-blur-xl shadow-xl transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-bl-3xl">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md text-white hover:text-indigo-100 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="absolute bottom-4 left-6 flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/20">
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">SH</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">ShopHub</span>
                <p className="text-indigo-100 text-sm">Discover amazing products</p>
              </div>
            </div>
          </div>

          {/* Mobile Search Box */}
          <div className="px-4 py-4">
            <form onSubmit={handleMobileSearchSubmit} autoComplete="off" ref={mobileSearchRef}>
              <div className="relative">
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-base bg-white placeholder-gray-500 transition-all duration-200 shadow-sm text-gray-900"
                  placeholder="Search products..."
                  value={mobileSearchQuery}
                  onChange={handleMobileSearchChange}
                  onFocus={() => mobileSearchResults.length > 0 && setShowMobileSearchResults(true)}
                  style={{ color: '#111' }}
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                {/* Search Results Dropdown */}
                {showMobileSearchResults && (
                  <div className="absolute left-0 right-0 mt-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                    {mobileSearchLoading ? (
                      <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                    ) : mobileSearchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">No results found</div>
                    ) : (
                      mobileSearchResults.map((product) => (
                        <Link
                          key={product._id}
                          to={`/products/${product._id}`}
                          className="w-full text-left flex items-center px-4 py-2 cursor-pointer hover:bg-indigo-50 transition-all"
                          onClick={() => {
                            console.log('Mobile - Clicking product:', product._id, 'Navigating to:', `/products/${product._id}`);
                            setShowMobileSearchResults(false);
                            setMobileSearchQuery('');
                            setIsOpen(false); // Close mobile menu
                          }}
                          tabIndex={0}
                        >
                          <img
                            src={formatImageUrl(product.images?.[0]) || '/placeholder-image.jpg'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded mr-3 border"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.jpg'; console.log('Image load error for:', product.name, 'Original src:', product.images?.[0], 'Formatted src:', formatImageUrl(product.images?.[0])); }}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate">{product.category?.name}</div>
                          </div>
                          <div className="ml-2 text-xs text-gray-700 font-semibold">${product.price}</div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl transition-all duration-300 group hover:shadow-md hover:translate-x-1"
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-6 w-6 mr-4 text-gray-500 group-hover:text-indigo-600 transition-colors duration-300" />
                  <span className="font-medium group-hover:text-indigo-600 transition-colors duration-300">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>
            <div className="px-6 py-4">
              {user ? (
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 group transition-all duration-300 hover:shadow-sm hover:translate-x-1"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 shadow-sm">
                    <UserCircleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium">{user.name}</span>
                    <p className="text-sm text-gray-500">View Profile</p>
                  </div>
                </Link>
              ) : (
                <Link
                  to="/auth/login"
                  className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 group transition-all duration-300 hover:shadow-sm hover:translate-x-1"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 shadow-sm">
                    <UserCircleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-medium">Sign In</span>
                    <p className="text-sm text-gray-500">Access your account</p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
