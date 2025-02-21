import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TestHistory.css';

const TestHistory = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'timeline', 'subjects'

  const fetchTests = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const { data } = await axios.get('http://localhost:5000/api/tests/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sort tests by date (newest first)
      const sortedTests = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTests(sortedTests);
    } catch (error) {
      toast.error('Failed to fetch test history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Prepare data for charts
  const prepareTimelineData = () => {
    return tests.map(test => ({
      date: new Date(test.createdAt).toLocaleDateString(),
      score: test.score,
      subject: test.subject.name
    })).reverse(); // Reverse to show timeline from oldest to newest
  };

  const prepareSubjectData = () => {
    const subjectMap = {};
    
    // Group tests by subject
    tests.forEach(test => {
      const subjectName = test.subject.name;
      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = {
          subject: subjectName,
          avgScore: 0,
          tests: [],
          improvement: 0
        };
      }
      subjectMap[subjectName].tests.push(test);
    });
    
    // Calculate average scores and improvement
    return Object.values(subjectMap).map(item => {
      const scores = item.tests.map(t => t.score);
      item.avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      
      // Calculate improvement (difference between first and last test)
      if (scores.length > 1) {
        item.improvement = scores[scores.length - 1] - scores[0];
      }
      
      return item;
    });
  };

  const getAverageScore = () => {
    if (tests.length === 0) return 0;
    const sum = tests.reduce((total, test) => total + test.score, 0);
    return (sum / tests.length).toFixed(2);
  };

  const getRecentTrend = () => {
    if (tests.length < 2) return 0;
    const recentTests = [...tests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    if (recentTests.length < 2) return 0;
    return (recentTests[0].score - recentTests[recentTests.length - 1].score).toFixed(2);
  };

  if (loading) {
    return <div className="loading-container">Loading test history...</div>;
  }

  return (
    <div className="test-history-dashboard">
      <header className="dashboard-header">
        <h2>Test History Dashboard</h2>
        <div className="view-selector">
          <button 
            className={viewMode === 'cards' ? 'active' : ''} 
            onClick={() => setViewMode('cards')}
          >
            Cards
          </button>
          <button 
            className={viewMode === 'timeline' ? 'active' : ''} 
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </button>
          <button 
            className={viewMode === 'subjects' ? 'active' : ''} 
            onClick={() => setViewMode('subjects')}
          >
            By Subject
          </button>
        </div>
      </header>

      {tests.length > 0 ? (
        <>
          {/* Summary section */}
          <div className="summary-metrics">
            <div className="metric-card">
              <h3>Tests Taken</h3>
              <p className="metric-value">{tests.length}</p>
            </div>
            <div className="metric-card">
              <h3>Average Score</h3>
              <p className="metric-value">{getAverageScore()}%</p>
            </div>
            <div className="metric-card">
              <h3>Recent Trend</h3>
              <p className={`metric-value ${parseFloat(getRecentTrend()) >= 0 ? 'positive' : 'negative'}`}>
                {getRecentTrend() > 0 ? '+' : ''}{getRecentTrend()}%
              </p>
            </div>
          </div>

          {/* View Modes */}
          {viewMode === 'cards' && (
            <div className="test-cards-container">
              {tests.map((test) => (
                <div key={test._id} className="test-card">
                  <div className="test-card-header">
                    <h3>{test.subject.name}</h3>
                    <div className="score-badge" style={{ 
                      backgroundColor: test.score >= 90 ? '#4CAF50' : test.score >= 70 ? '#FFC107' : '#F44336' 
                    }}>
                      {test.score.toFixed(2)}%
                    </div>
                  </div>
                  <div className="test-card-body">
                    <p><strong>Date:</strong> {new Date(test.createdAt).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(test.createdAt).toLocaleTimeString()}</p>
                    {test.questions && <p><strong>Questions:</strong> {test.questions.length}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="chart-container">
              <h3>Score Timeline</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={prepareTimelineData()} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45} 
                    textAnchor="end"
                    height={80}
                    tickMargin={20}
                  />
                  <YAxis domain={[0, 100]} label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2196F3" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                    name="Test Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {viewMode === 'subjects' && (
            <>
              <div className="chart-container">
                <h3>Performance by Subject</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={prepareSubjectData()} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="subject" 
                      angle={-45} 
                      textAnchor="end"
                      height={80}
                      tickMargin={20}
                    />
                    <YAxis domain={[0, 100]} label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="avgScore" fill="#3F51B5" name="Average Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="subject-improvement-section">
                <h3>Subject Improvement</h3>
                <div className="improvement-cards">
                  {prepareSubjectData().map(subject => (
                    <div key={subject.subject} className="improvement-card">
                      <h4>{subject.subject}</h4>
                      <p>Average: <strong>{subject.avgScore.toFixed(2)}%</strong></p>
                      <p>Tests: <strong>{subject.tests.length}</strong></p>
                      <div className="improvement-indicator">
                        <span>Improvement:</span>
                        <span className={subject.improvement >= 0 ? 'positive' : 'negative'}>
                          {subject.improvement > 0 ? '+' : ''}{subject.improvement.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-illustration">📊</div>
          <h3>No Test History Available</h3>
          <p>Take your first test to start tracking your progress!</p>
        </div>
      )}
    </div>
  );
};

export default TestHistory;