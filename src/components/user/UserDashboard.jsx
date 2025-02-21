import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BookOpen, Clock, CheckCircle, Loader } from 'lucide-react';

const UserDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [testId, setTestId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchSubjects = async (categoryId) => {
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

  const fetchQuestions = async (subjectId) => {
    try {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const { data } = await axios.get(`https://testappbackend-p8dc.onrender.com/api/questions/subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(data);
      
      const testResponse = await axios.post(
        'https://testappbackend-p8dc.onrender.com/api/tests',
        { subject: subjectId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setTestId(testResponse.data._id);
    } catch (error) {
      toast.error('Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubjects(selectedCategory);
      setSelectedSubject('');
      setQuestions([]);
      setTestStarted(false);
      setAnswers({});
      setCurrentQuestion(0);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubject) {
      fetchQuestions(selectedSubject);
    }
  }, [selectedSubject]);

  const handleSubmitTest = async () => {
    try {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        question: questionId,
        selectedOption
      }));

      await axios.put(
        `https://testappbackend-p8dc.onrender.com/api/tests/${testId}`,
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      toast.success('Test submitted successfully');
      setTestStarted(false);
      setAnswers({});
      setQuestions([]);
      setSelectedSubject('');
      setCurrentQuestion(0);
    } catch (error) {
      toast.error('Failed to submit test');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(curr => curr - 1);
    }
  };

  const getProgressPercentage = () => {
    return (Object.keys(answers).length / questions.length) * 100;
  };

  if (isLoading && !testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Online Assessment Platform
          </h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto mt-2 rounded-full"/>
        </div>

        <div className="p-6 space-y-6">
          {!testStarted ? (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  >
                    <option value="">Choose a Category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    >
                      <option value="">Choose a Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {selectedSubject && questions.length > 0 && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setTestStarted(true)}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Start Assessment
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{Math.round(getProgressPercentage())}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              {questions[currentQuestion] && (
                <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <p className="text-lg font-medium text-gray-800">
                      {questions[currentQuestion].text}
                    </p>

                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            answers[questions[currentQuestion]._id] === option.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={questions[currentQuestion]._id}
                            value={option.id}
                            checked={answers[questions[currentQuestion]._id] === option.id}
                            onChange={(e) => setAnswers({ 
                              ...answers, 
                              [questions[currentQuestion]._id]: e.target.value 
                            })}
                            className="sr-only"
                          />
                          <span className="ml-2 text-gray-700">{option.text}</span>
                          {answers[questions[currentQuestion]._id] === option.id && (
                            <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitTest}
                    disabled={isLoading || Object.keys(answers).length !== questions.length}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm inline-flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Test'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;