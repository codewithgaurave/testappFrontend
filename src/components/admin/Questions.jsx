import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BookOpen, ChevronDown, ClipboardList, CheckCircle } from 'lucide-react';

const Questions = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    text: '',
    options: [
      { id: '1', text: '' },
      { id: '2', text: '' },
      { id: '3', text: '' },
      { id: '4', text: '' },
    ],
    correctOption: '1',
    subject: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const { data } = await axios.get('http://localhost:5000/api/subjects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async (subjectId) => {
    if (!subjectId) return;
    
    setIsLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const { data } = await axios.get(`http://localhost:5000/api/questions/subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setFormData({ ...formData, subject: subjectId });
    
    if (subjectId) {
      fetchQuestions(subjectId);
    } else {
      setQuestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.subject) {
      toast.error('Please select a subject');
      return;
    }
    
    if (!formData.text.trim()) {
      toast.error('Question text is required');
      return;
    }
    
    // Validate options
    for (const option of formData.options) {
      if (!option.text.trim()) {
        toast.error(`Option ${option.id} text is required`);
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      await axios.post('http://localhost:5000/api/questions', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Question created successfully');
      
      // Reset form while keeping the selected subject
      setFormData({
        text: '',
        options: [
          { id: '1', text: '' },
          { id: '2', text: '' },
          { id: '3', text: '' },
          { id: '4', text: '' },
        ],
        correctOption: '1',
        subject: selectedSubject,
      });
      
      // Refresh questions list
      fetchQuestions(selectedSubject);
    } catch (error) {
      console.error('Error creating question:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create question';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Manage Questions
        </h2>
        <p className="text-gray-600">Create and manage multiple-choice questions for your subjects</p>
      </div>

      {/* Subject Selector */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
          Select Subject
        </h3>
        <div className="relative">
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 pr-10 transition duration-150"
          >
            <option value="">Select a Subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Content Grid - Show only when subject is selected */}
      {selectedSubject && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Question Creation Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-indigo-600" />
                Add New Question
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text
                  </label>
                  <textarea
                    id="questionText"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Enter your question"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">Answer Options</p>
                  {formData.options.map((option, index) => (
                    <div key={option.id} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full border ${formData.correctOption === option.id ? 'bg-indigo-100 border-indigo-500 text-indigo-500' : 'border-gray-300 text-gray-400'}`}>
                          {option.id}
                        </div>
                      </div>
                      <div className="ml-3 flex-grow">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                          value={option.text}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index].text = e.target.value;
                            setFormData({ ...formData, options: newOptions });
                          }}
                          placeholder={`Option ${option.id}`}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <label htmlFor="correctOption" className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer
                  </label>
                  <div className="relative">
                    <select
                      id="correctOption"
                      value={formData.correctOption}
                      onChange={(e) => setFormData({ ...formData, correctOption: e.target.value })}
                      className="w-full appearance-none px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 pr-10 transition duration-150"
                      required
                    >
                      {formData.options.map((option) => (
                        <option key={option.id} value={option.id}>
                          Option {option.id}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
                >
                  {isSubmitting ? 'Adding...' : 'Add Question'}
                </button>
              </form>
            </div>
          </div>

          {/* Questions List */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-indigo-600" />
                Questions in This Subject
                <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  {questions.length}
                </span>
              </h3>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse text-gray-400">Loading questions...</div>
                </div>
              ) : questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-gray-400 mb-2">No questions found</div>
                  <p className="text-sm text-gray-500">Create your first question using the form</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                  {questions.map((question, qIndex) => (
                    <div key={question._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-150">
                      <div className="flex items-start">
                        <span className="flex-shrink-0 bg-gray-100 text-gray-700 font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2">
                          {qIndex + 1}
                        </span>
                        <h4 className="font-medium text-gray-800">{question.text}</h4>
                      </div>
                      
                      <div className="mt-3 pl-8 space-y-2">
                        {question.options.map((option) => (
                          <div 
                            key={option.id} 
                            className={`flex items-center p-2 rounded-md ${option.id === question.correctOption ? 'bg-green-50 border border-green-100' : ''}`}
                          >
                            {option.id === question.correctOption && (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${option.id === question.correctOption ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                              {option.id}. {option.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty state when no subject is selected */}
      {!selectedSubject && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Subject Selected</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Please select a subject from the dropdown above to manage questions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;