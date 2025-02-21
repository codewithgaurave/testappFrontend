import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChevronDown } from 'lucide-react';

const TakeTest = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const { data } = await axios.get('https://testappbackend-p8dc.onrender.com/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) {
      navigate(`/take-test/${categoryId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Take a Test
        </h2>
      </div>

      {/* Category Selector Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="category" className="block text-lg font-semibold text-gray-800 mb-2">
            Select Category:
          </label>
          <div className="relative">
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 pr-10"
            >
              <option value="">Choose a Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeTest;