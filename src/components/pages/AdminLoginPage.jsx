import React from 'react';
import AdminLoginForm from '../admin/AdminLoginForm';
import { isAdminAuthenticated } from '../../services/adminAuthService';
import { Navigate } from 'react-router-dom';

const AdminLoginPage = () => {
  // Redirect to admin dashboard if already logged in
  if (isAdminAuthenticated()) {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative w-full max-w-md px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">A</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Login
            </h1>
            <p className="text-indigo-200/60">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Admin Login Form Container */}
          <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage; 