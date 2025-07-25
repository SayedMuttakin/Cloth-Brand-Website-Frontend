import React, { useState } from 'react';
import { adminForgotPassword } from '../../services/adminAuthService';
import { toast } from 'react-hot-toast';

const AdminForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await adminForgotPassword(email);
      setMessage(res.message);
      toast.success(res.message);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-900/20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

      <div className="relative w-full max-w-md px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">A</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-indigo-200/60">
              Enter your email to reset your password
            </p>
          </div>

          <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-indigo-200">Email address</label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
            {message && <p className="mt-4 text-center text-green-400">{message}</p>}
            {error && <p className="mt-4 text-center text-red-400">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPasswordPage;