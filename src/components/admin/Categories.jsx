import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const { data } = await axios.get('https://testappbackend-p8dc.onrender.com/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      await axios.post('https://testappbackend-p8dc.onrender.com/api/categories', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Category created successfully');
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Manage Categories
        </h2>
        <p className="text-gray-600">Create and manage categories for your content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2 text-indigo-600" />
              Add New Category
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
              >
                {isLoading ? 'Adding...' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              All Categories ({categories.length})
            </h3>
            
            {isLoading && categories.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-gray-400">Loading categories...</div>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-gray-400 mb-2">No categories found</div>
                <p className="text-sm text-gray-500">Create your first category using the form</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div key={category._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-150">
                    <h4 className="font-medium text-gray-800 mb-2">{category.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">{category.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;