import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Squares2X2Icon,
  ChatBubbleLeftIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { isAdminAuthenticated, adminLogout } from '../../services/adminAuthService';
import { io } from 'socket.io-client';

const initialNavigation = [
  { name: 'Dashboard', to: '/admin', icon: Squares2X2Icon },
  { name: 'Products', to: '/admin/products', icon: ShoppingBagIcon },
  { name: 'Orders', to: '/admin/orders', icon: ChartBarIcon },
  { name: 'Customers', to: '/admin/customers', icon: UsersIcon },
  { name: 'Reports', to: '/admin/reports', icon: ChartBarIcon },
  { name: 'Reviews', to: '/admin/reviews', icon: ChatBubbleLeftIcon },
  { name: 'Settings', to: '/admin/settings', icon: Cog6ToothIcon },
];

const AdminLayout = () => {
  const [navigation, setNavigation] = useState(initialNavigation);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [bellShake, setBellShake] = useState(false);
  const prevNotifCount = useRef(0);

  useEffect(() => {
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    if (adminUser && adminUser.role === 'super-admin') {
      const newNav = [...initialNavigation];
      if (!newNav.find(item => item.name === 'Admins')) {
        newNav.push({ name: 'Admins', to: '/admin/admins', icon: ShieldCheckIcon });
      }
      setNavigation(newNav);
    } else {
      setNavigation(initialNavigation);
    }
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('sidebar');
        const toggleButton = document.getElementById('sidebar-toggle');
        if (sidebar && !sidebar.contains(event.target) && !toggleButton?.contains(event.target)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  const socketRef = useRef(null);

  useEffect(() => {
    console.log('Setting up Socket.IO connection...');
    
    if (socketRef.current) {
      console.log('Socket.IO: Already connected. Skipping setup.');
      return;
    }

    socketRef.current = io(import.meta.env.VITE_API_BASE_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket.IO: Connected successfully!', socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO: connect_error:', err);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket.IO: disconnected:', reason);
    });

    socket.on('newOrder', (data) => {
      console.log('🔔 Socket.IO: Received newOrder event:', data);
      setNotifications((prev) => [
        { type: 'order', ...data, id: Date.now() },
        ...prev
      ]);
    });

    return () => {
      console.log('Socket.IO: Cleaning up connection...');
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Debug: log notifications state on every render
  useEffect(() => {
    console.log('Current notifications state:', notifications);
  }, [notifications]);

  // Bell shake animation when new notification arrives
  useEffect(() => {
    if (notifications.length > prevNotifCount.current) {
      setBellShake(true);
      setTimeout(() => setBellShake(false), 700);
    }
    prevNotifCount.current = notifications.length;
  }, [notifications]);

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" />;
  }

  const handleLogout = () => {
    adminLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20 lg:flex relative">
      {/* Background Pattern - same as hero section */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10 pointer-events-none"></div>
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:fixed lg:h-screen
          w-72
          bg-gradient-to-br from-gray-900/95 to-indigo-900/90 backdrop-blur-xl border-r border-indigo-500/10 shadow-2xl`}
      >
        {/* Logo and Sidebar Toggle */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-indigo-500/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">Admin Panel</h1>
              <p className="text-indigo-200/60 text-sm">E-commerce Dashboard</p>
            </div>
          </div>
          <button
            id="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-500/10 rounded-lg transition-colors lg:hidden"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto scrollbar-hide">
          {navigation.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.name}
                to={item.to}
                className={`${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-lg'
                    : 'text-indigo-200 hover:bg-indigo-500/10 hover:text-white'
                } group flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 mb-2`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-white' : 'text-indigo-400 group-hover:text-white'
                  } mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-200`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Help & Logout */}
        <div className="flex-shrink-0 p-4 border-t border-indigo-500/10 space-y-2">
          <Link
            to="/"
            className="group flex items-center px-4 py-3 text-base font-medium rounded-xl text-indigo-200 hover:bg-indigo-500/10 hover:text-white transition-all duration-200"
          >
            <HomeIcon className="h-6 w-6 mr-3 text-indigo-400 group-hover:text-white" />
            <span>View Store</span>
          </Link>
          <Link
            to="/admin/help"
            className="group flex items-center px-4 py-3 text-base font-medium rounded-xl text-indigo-200 hover:bg-indigo-500/10 hover:text-white transition-all duration-200"
          >
            <QuestionMarkCircleIcon className="h-6 w-6 mr-3 text-indigo-400 group-hover:text-white" />
            <span>Help & Support</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-4 py-3 text-base font-medium rounded-xl text-indigo-200 hover:bg-indigo-500/10 hover:text-white transition-all duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3 text-indigo-400 group-hover:text-white" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 min-h-screen flex flex-col lg:ml-72">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-gradient-to-r from-gray-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-indigo-500/10">
          <div className="flex items-center justify-between px-6 h-20">
            <div className="flex items-center space-x-4">
              <button
                id="sidebar-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-500/10 rounded-lg transition-colors lg:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-semibold text-white">
                {navigation.find(item => item.to === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  className={`p-2 text-indigo-300 hover:text-white hover:bg-indigo-500/10 rounded-lg transition-colors relative ${bellShake ? 'animate-shake' : ''}`}
                  onClick={() => setShowNotifications((prev) => !prev)}
                >
                  <BellIcon className="h-6 w-6" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-xl z-50 p-4 text-white max-h-96 overflow-y-auto animate-fade-in border border-indigo-500/10">
                    <h4 className="font-bold mb-2 text-indigo-200">Notifications</h4>
                    {notifications.length === 0 ? (
                      <p className="text-indigo-300">No new notifications</p>
                    ) : (
                      <ul>
                        {notifications.map((notif) => (
                          <li key={notif.id} className="mb-2 p-3 rounded-lg bg-gradient-to-r from-indigo-700/60 to-purple-700/60 hover:from-indigo-600/80 hover:to-purple-600/80 transition-colors duration-200 shadow-md">
                            {notif.type === 'order' && (
                              <span>
                                <span className="font-semibold text-indigo-100">New order</span> from <b className="text-purple-200">{notif.customer}</b> - <span className="text-emerald-300">${notif.totalAmount}</span>
                                <br/>
                                <span className="text-xs text-indigo-300">{new Date(notif.createdAt).toLocaleString()}</span>
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Admin Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-white font-medium">Admin User</p>
                  <p className="text-indigo-200/60 text-sm">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gradient-to-b from-gray-900/20 via-gray-900/10 to-indigo-900/20 min-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:max-h-[calc(100vh-5rem)] relative z-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 