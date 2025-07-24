import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import LoadingScreen from './components/common/LoadingScreen'; // Import LoadingScreen
import HomePage from './components/pages/HomePage';
import ProductPage from './components/pages/ProductPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import CategoriesPage from './components/pages/CategoriesPage';
import CategoryProductsPage from './components/pages/CategoryProductsPage';
import AuthPage from './components/pages/AuthPage';
import ProductDetailsPage from './components/pages/ProductDetailsPage';
import SearchResults from './components/pages/SearchResults';
import ProfilePage from './components/pages/ProfilePage';
import CartPage from './components/pages/CartPage';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import StripeProvider from './context/StripeContext';
import { Toaster } from 'react-hot-toast';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './components/pages/AdminLoginPage';
import Dashboard from './components/admin/Dashboard';
import ProductsManagement from './components/admin/ProductsManagement';
import Orders from './components/admin/Orders';
import OrderDetails from './components/admin/OrderDetails';
import Customers from './components/admin/Customers';
import Reports from './components/admin/Reports';
import CheckoutPage from './components/pages/CheckoutPage';
import OrderConfirmationPage from './components/pages/OrderConfirmationPage';
import { isAdminAuthenticated } from './services/adminAuthService';
import AdminSettingsPage from './components/admin/AdminSettingsPage';
import ColorAnalytics from './components/admin/ColorAnalytics';
import SizeAnalytics from './components/admin/SizeAnalytics';
import AdminsManagement from './components/admin/AdminsManagement';
import NotFoundPage from './components/pages/NotFoundPage';
import ProductDebug from './components/debug/ProductDebug';
import AdminForgotPasswordPage from './components/pages/AdminForgotPasswordPage';
import AdminResetPasswordPage from './components/pages/AdminResetPasswordPage';

// AdminRoute wrapper
const AdminRoute = ({ children }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// AdminLoginRedirect wrapper
const AdminLoginRedirect = ({ children }) => {
  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <div className="min-h-screen relative z-0">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:categorySlug" element={<CategoryProductsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/auth/:type" element={<AuthPage />} />
        {/* Debug Route */}
        <Route path="/debug/products" element={<ProductDebug />} />
        {/* Protected User Routes */}
        <Route path="/profile" element={<ProfilePage />} />
        {/* Admin Login - redirect if already logged in */}
        <Route path="/admin/login" element={
          <AdminLoginRedirect>
            <AdminLoginPage />
          </AdminLoginRedirect>
        } />
        {/* Admin Forgot Password */}
        <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
        {/* Admin Reset Password */}
        <Route path="/admin/resetPassword/:token" element={<AdminResetPasswordPage />} />
        {/* Admin Routes - protected */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="customers" element={<Customers />} />
          <Route path="color-analytics" element={<ColorAnalytics />} />
          <Route path="size-analytics" element={<SizeAnalytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="admins" element={<AdminsManagement />} />
        </Route>
        {/* Fallback Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate initial asset loading
    const loadingTimer = setTimeout(() => {
      setIsExiting(true); // Start fade-out animation
      const exitingTimer = setTimeout(() => {
        setIsLoading(false); // Remove loading screen from DOM
      }, 500); // Corresponds to the transition duration

      return () => clearTimeout(exitingTimer);
    }, 2500); // Adjust time as needed

    return () => clearTimeout(loadingTimer);
  }, []);

  if (isLoading) {
    return <LoadingScreen isExiting={isExiting} />;
  }

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <StripeProvider>
            <Toaster position="top-center" />
            <AppContent />
          </StripeProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;