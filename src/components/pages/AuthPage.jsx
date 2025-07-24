import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';

const AuthPage = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/auth/register';

  return (
    <div className="relative min-h-screen mt-2 bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center justify-center">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {isRegisterPage ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-indigo-200/60 max-w-2xl mx-auto text-lg">
              {isRegisterPage
                ? 'Join our community and discover amazing fashion products'
                : 'Sign in to your account to continue shopping'}
            </p>
          </div>

          {/* Auth Form Container */}
          <div className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10">
            {isRegisterPage ? <RegisterForm /> : <LoginForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 