import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowUturnLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20 px-6 py-24 sm:py-32 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative text-center z-10">
        <p className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-6 text-base leading-7 text-indigo-100/80">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5"
          >
            <span className="relative inline-flex items-center justify-center w-full h-full px-8 py-3.5 bg-gray-900 rounded-full group-hover:bg-opacity-0 transition-all duration-300">
              <span className="absolute flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:translate-x-0 ease">
                <HomeIcon className="h-5 w-5" />
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                Go Back Home
              </span>
              <span className="relative invisible">Go Back Home</span>
            </span>
          </Link>
          
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center justify-center px-8 py-4 font-medium text-white bg-gray-800/50 rounded-full hover:bg-gray-700/50 transition duration-300 backdrop-blur-sm"
          >
            Go Back
            <ArrowUturnLeftIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-3000"></div>
    </div>
  );
};

export default NotFound;