import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BookOpen, ChevronDown, FolderPlus } from 'lucide-react';

const Subjects = () => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

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

  const fetchSubjectsByCategory = async (categoryId) => {
    if (!categoryId) return;
    try {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const { data } = await axios.get(`https://testappbackend-p8dc.onrender.com/api/subjects/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(data);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubjectsByCategory(selectedCategory);
    } else {
      setSubjects([]);
    }
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error('Please select a category first');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      await axios.post('https://testappbackend-p8dc.onrender.com/api/subjects', 
        { ...formData, category: selectedCategory },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('Subject created successfully');
      setFormData({ name: '', description: '' });
      fetchSubjectsByCategory(selectedCategory);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Manage Subjects
        </h2>
        <p className="text-gray-600">Create and organize subjects within categories</p>
      </div>

      {/* Category Selector */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FolderPlus className="w-5 h-5 mr-2 text-indigo-600" />
          Select Category
        </h3>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 pr-10 transition duration-150"
          >
            <option value="">Select a Category</option>
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

      {/* Content Grid - Show only when category is selected */}
      {selectedCategory && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject Creation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                Add New Subject
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter subject name"
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
                    placeholder="Enter subject description"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                >
                  {isSubmitting ? 'Adding...' : 'Add Subject'}
                </button>
              </form>
            </div>
          </div>

          {/* Subjects List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Subjects in Selected Category ({subjects.length})
              </h3>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse text-gray-400">Loading subjects...</div>
                </div>
              ) : subjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-gray-400 mb-2">No subjects found in this category</div>
                  <p className="text-sm text-gray-500">Create your first subject using the form</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjects.map((subject) => (
                    <div key={subject._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-150">
                      <h4 className="font-medium text-gray-800 mb-2">{subject.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{subject.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty state when no category is selected */}
      {!selectedCategory && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Category Selected</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Please select a category from the dropdown above to view and manage subjects.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;