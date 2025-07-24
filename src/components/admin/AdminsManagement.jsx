import React, { useState, useEffect } from 'react';
import { getAllAdmins, createAdmin, updateAdmin, deleteAdmin } from '../../services/adminService';
import { toast } from 'react-hot-toast';
import { PlusIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const AdminsManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'admin' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await getAllAdmins();
      setAdmins(response.data.admins);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch admins: " + err.message);
    }
    setIsLoading(false);
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await createAdmin(newAdmin);
      setNewAdmin({ name: '', email: '', password: '', role: 'admin' });
      fetchAdmins();
      toast.success("Admin created successfully!");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to create admin: " + err.message);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await deleteAdmin(adminId);
        fetchAdmins();
        toast.success("Admin deleted successfully!");
      } catch (err) {
        setError(err.message);
        toast.error("Failed to delete admin: " + err.message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white mb-1">Admins Management</h1>
        <p className="text-indigo-200/60">Loading admin data...</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-indigo-500/10 animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white mb-1">Admins Management</h1>
      <p className="text-indigo-200/60">Manage your administrative users and their roles.</p>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Create New Admin Form */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-indigo-500/10 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Create New Admin</h2>
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-indigo-200">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Admin Name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-indigo-200">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Admin Email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-indigo-200">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Admin Password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-indigo-200">Role</label>
              <select
                id="role"
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-800 text-white"
              >
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Create Admin
            </button>
          </div>
        </form>
      </div>

      {/* Existing Admins List */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-indigo-500/10 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Existing Admins</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-indigo-500/20">
            <thead className="bg-indigo-500/10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-indigo-200 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-indigo-200 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/20">
              {admins.map(admin => (
                <tr key={admin._id} className="hover:bg-indigo-500/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{admin.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-indigo-200">{admin.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.role === 'super-admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="text-rose-500 hover:text-rose-700 inline-flex items-center p-2 rounded-full hover:bg-rose-500/10 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {admins.length === 0 && !isLoading && (
          <div className="text-center py-8 text-indigo-200/60">
            <UserGroupIcon className="mx-auto h-12 w-12 text-indigo-400" />
            <p className="mt-2">No admins found. Create your first admin above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminsManagement;