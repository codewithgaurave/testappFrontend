// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { Container, Row, Col, Card, Table, Badge, Accordion, Button, Modal } from 'react-bootstrap';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import { Pie } from 'react-chartjs-2';
// import { UserCircle, BookOpen, FileCheck, Award } from 'lucide-react';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalCategories: 0,
//     totalSubjects: 0,
//     totalQuestions: 0,
//     totalTests: 0,
//   });
  
//   const [detailedStats, setDetailedStats] = useState({
//     categoriesBreakdown: [],
//     overallStats: {
//       totalTests: 0,
//       totalTestTakers: 0,
//       overallAvgScore: 0
//     }
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const [showModal, setShowModal] = useState(false);
//   const [modalContent, setModalContent] = useState({
//     title: '',
//     content: null
//   });
  
//   useEffect(() => {
//     fetchBasicStats();
//     fetchDetailedStats();
//   }, []);
  
//   const fetchBasicStats = async () => {
//     try {
//       const userInfo = localStorage.getItem('userInfo');
//       if (!userInfo) {
//         throw new Error('User information not found');
//       }
      
//       const token = JSON.parse(userInfo).token;
//       const [categories, subjects, questions, tests] = await Promise.all([
//         axios.get('http://localhost:5000/api/categories', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get('http://localhost:5000/api/subjects', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get('http://localhost:5000/api/questions', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get('http://localhost:5000/api/tests', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//       ]);
//       setStats({
//         totalCategories: categories.data.length,
//         totalSubjects: subjects.data.length,
//         totalQuestions: questions.data.length,
//         totalTests: tests.data.length,
//       });
//     } catch (error) {
//       console.error('Failed to fetch basic statistics:', error);
//       setError('Failed to fetch basic statistics');
//       toast.error('Failed to fetch basic statistics');
//     }
//   };
  
//   const fetchDetailedStats = async () => {
//     try {
//       const userInfo = localStorage.getItem('userInfo');
//       if (!userInfo) {
//         throw new Error('User information not found');
//       }
      
//       const token = JSON.parse(userInfo).token;
//       const response = await axios.get('http://localhost:5000/api/admin-stats/detailed', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setDetailedStats(response.data);
//     } catch (error) {
//       console.error('Failed to fetch detailed statistics:', error);
//       setError('Failed to fetch detailed statistics');
//       toast.error('Failed to fetch detailed statistics');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const fetchUserStats = async (userId, userName) => {
//     try {
//       const userInfo = localStorage.getItem('userInfo');
//       if (!userInfo) {
//         throw new Error('User information not found');
//       }
      
//       const token = JSON.parse(userInfo).token;
//       const response = await axios.get(`http://localhost:5000/api/admin-stats/user/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       const renderUserStats = () => {
//         const userData = response.data;
        
//         if (!userData || !userData.testStats) {
//           return <p>No test data available for this user.</p>;
//         }
        
//         return (
//           <div>
//             <h5 className="mb-3">{userName}'s Performance</h5>
            
//             <div className="mb-4">
//               <h6>Overall Statistics</h6>
//               <Table bordered>
//                 <tbody>
//                   <tr>
//                     <th>Total Tests Taken</th>
//                     <td>{userData.testStats.totalTests}</td>
//                   </tr>
//                   <tr>
//                     <th>Average Score</th>
//                     <td>{userData.testStats.overallAvgScore.toFixed(1)}%</td>
//                   </tr>
//                   <tr>
//                     <th>Best Score</th>
//                     <td>{userData.testStats.highestScore.toFixed(1)}%</td>
//                   </tr>
//                 </tbody>
//               </Table>
//             </div>
            
//             <h6>Recent Tests</h6>
//             <Table bordered striped>
//               <thead>
//                 <tr>
//                   <th>Test Date</th>
//                   <th>Subject</th>
//                   <th>Score</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {userData.recentTests?.slice(0, 5).map((test, index) => (
//                   <tr key={index}>
//                     <td>{new Date(test.date).toLocaleDateString()}</td>
//                     <td>{test.subjectName}</td>
//                     <td>
//                       <Badge bg={test.score > 70 ? 'success' : 'warning'}>
//                         {test.score.toFixed(1)}%
//                       </Badge>
//                     </td>
//                   </tr>
//                 ))}
//                 {!userData.recentTests?.length && (
//                   <tr>
//                     <td colSpan="3" className="text-center">No recent tests</td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         );
//       };
      
//       setModalContent({
//         title: `${userName}'s Detailed Statistics`,
//         content: renderUserStats()
//       });
      
//       setShowModal(true);
//     } catch (error) {
//       console.error('Failed to fetch user statistics:', error);
//       toast.error('Failed to fetch user statistics');
//     }
//   };
  
//   const handleViewTests = (subjectName, testCount) => {
//     setModalContent({
//       title: `Tests for ${subjectName}`,
//       content: (
//         <div>
//           <p>This subject has {testCount} tests taken by users.</p>
//           <p>Detailed test analysis functionality would be implemented here.</p>
//         </div>
//       )
//     });
//     setShowModal(true);
//   };
  
//   const handleViewAllUsers = (categoryName, totalUsers) => {
//     setModalContent({
//       title: `All Users for ${categoryName}`,
//       content: (
//         <div>
//           <p>This category has {totalUsers} unique users who have taken tests.</p>
//           <p>Complete user listing functionality would be implemented here.</p>
//         </div>
//       )
//     });
//     setShowModal(true);
//   };
  
//   const pieData = React.useMemo(() => {
//     if (!detailedStats.categoriesBreakdown || detailedStats.categoriesBreakdown.length === 0) {
//       return {
//         labels: [],
//         datasets: [{
//           data: [],
//           backgroundColor: [],
//           hoverBackgroundColor: []
//         }]
//       };
//     }
    
//     const categoryLabels = detailedStats.categoriesBreakdown.map(cat => cat._id.categoryName);
//     const categoryTestCounts = detailedStats.categoriesBreakdown.map(cat => cat.totalTests);
    
//     return {
//       labels: categoryLabels,
//       datasets: [
//         {
//           data: categoryTestCounts,
//           backgroundColor: [
//             '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
//             '#8AC926', '#1982C4', '#6A4C93', '#F94144', '#F3722C', '#F8961E'
//           ],
//           hoverBackgroundColor: [
//             '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
//             '#8AC926', '#1982C4', '#6A4C93', '#F94144', '#F3722C', '#F8961E'
//           ]
//         }
//       ]
//     };
//   }, [detailedStats.categoriesBreakdown]);
  
//   if (loading) {
//     return <div className="text-center my-5">Loading statistics...</div>;
//   }
  
//   if (error) {
//     return <div className="text-center my-5 text-danger">{error}</div>;
//   }
  
//   return (
//     <Container fluid className="py-4">
//       <h1 className="mb-4">Admin Dashboard</h1>
      
//       <Row className="mb-4">
//         <Col md={3}>
//           <Card className="shadow-sm h-100">
//             <Card.Body className="d-flex align-items-center">
//               <div className="bg-primary p-3 rounded-circle me-3">
//                 <UserCircle size={24} className="text-white" />
//               </div>
//               <div>
//                 <h6 className="text-muted mb-1">Test Takers</h6>
//                 <h3>{detailedStats.overallStats.totalTestTakers}</h3>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="shadow-sm h-100">
//             <Card.Body className="d-flex align-items-center">
//               <div className="bg-success p-3 rounded-circle me-3">
//                 <BookOpen size={24} className="text-white" />
//               </div>
//               <div>
//                 <h6 className="text-muted mb-1">Subjects</h6>
//                 <h3>{stats.totalSubjects}</h3>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="shadow-sm h-100">
//             <Card.Body className="d-flex align-items-center">
//               <div className="bg-info p-3 rounded-circle me-3">
//                 <FileCheck size={24} className="text-white" />
//               </div>
//               <div>
//                 <h6 className="text-muted mb-1">Total Tests</h6>
//                 <h3>{detailedStats.overallStats.totalTests}</h3>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className="shadow-sm h-100">
//             <Card.Body className="d-flex align-items-center">
//               <div className="bg-warning p-3 rounded-circle me-3">
//                 <Award size={24} className="text-white" />
//               </div>
//               <div>
//                 <h6 className="text-muted mb-1">Avg Score</h6>
//                 <h3>{detailedStats.overallStats.overallAvgScore.toFixed(1)}%</h3>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
      
//       <Row className="mb-4">
//         <Col lg={6}>
//           <Card className="shadow-sm mb-4">
//             <Card.Header>Tests by Category</Card.Header>
//             <Card.Body>
//               <div style={{ height: '300px' }}>
//                 {detailedStats.categoriesBreakdown && detailedStats.categoriesBreakdown.length > 0 ? (
//                   <Pie 
//                     data={pieData} 
//                     options={{ 
//                       maintainAspectRatio: false,
//                       plugins: {
//                         id: 'categoryPieChart',
//                         legend: {
//                           position: 'bottom',
//                           labels: {
//                             boxWidth: 12
//                           }
//                         },
//                         tooltip: {
//                           callbacks: {
//                             label: (tooltipItem) => {
//                               const label = pieData.labels[tooltipItem.dataIndex];
//                               const value = pieData.datasets[0].data[tooltipItem.dataIndex];
//                               const total = pieData.datasets[0].data.reduce((a, b) => a + b, 0);
//                               const percentage = Math.round((value / total) * 100);
//                               return `${label}: ${value} tests (${percentage}%)`;
//                             }
//                           }
//                         }
//                       }
//                     }} 
//                   />
//                 ) : (
//                   <div className="text-center text-muted py-5">No category data available</div>
//                 )}
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col lg={6}>
//           <Card className="shadow-sm">
//             <Card.Header>Categories Overview</Card.Header>
//             <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
//               {detailedStats.categoriesBreakdown && detailedStats.categoriesBreakdown.length > 0 ? (
//                 <Table hover className="mb-0">
//                   <thead>
//                     <tr>
//                       <th>Category</th>
//                       <th>Subjects</th>
//                       <th>Tests</th>
//                       <th>Avg Score</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {detailedStats.categoriesBreakdown.map(category => (
//                       <tr key={category._id.categoryId} style={{ cursor: 'pointer' }}>
//                         <td>{category._id.categoryName}</td>
//                         <td>{category.subjects?.length || 0}</td>
//                         <td>{category.totalTests}</td>
//                         <td>
//                           {category.totalTests > 0 ? 
//                             (category.subjects.reduce((sum, subj) => 
//                               sum + (subj.avgScore || 0) * (subj.testCount || 0), 0) / 
//                               category.totalTests).toFixed(1) + '%'
//                             : 'N/A'}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               ) : (
//                 <div className="text-center text-muted py-4">No categories available</div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
      
//       <Card className="shadow-sm mb-4">
//         <Card.Header>
//           <h5 className="mb-0">Detailed Category & Subject Analysis</h5>
//         </Card.Header>
//         <Card.Body>
//           {detailedStats.categoriesBreakdown && detailedStats.categoriesBreakdown.length > 0 ? (
//             <Accordion>
//               {detailedStats.categoriesBreakdown.map((category, idx) => (
//                 <Accordion.Item key={category._id?.categoryId || idx} eventKey={idx.toString()}>
//                   <Accordion.Header>
//                     <span className="fw-bold">{category._id?.categoryName || 'Unknown Category'}</span>
//                     <Badge bg="primary" pill className="ms-2">
//                       {category.totalTests || 0} Tests
//                     </Badge>
//                     <Badge bg="info" pill className="ms-2">
//                       {category.subjects?.length || 0} Subjects
//                     </Badge>
//                   </Accordion.Header>
//                   <Accordion.Body>
//                     {category.subjects && category.subjects.length > 0 ? (
//                       <>
//                         <Table responsive striped hover>
//                           <thead>
//                             <tr>
//                               <th>Subject</th>
//                               <th>Tests Taken</th>
//                               <th>Users</th>
//                               <th>Avg Score</th>
//                               <th>Action</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {category.subjects.map((subject, subIdx) => (
//                               <tr key={subject._id || `${category._id?.categoryId}-subj-${subIdx}`}>
//                                 <td>{subject.name || 'Unnamed Subject'}</td>
//                                 <td>{subject.testCount || 0}</td>
//                                 <td>{subject.usersCount || 0}</td>
//                                 <td>{(subject.avgScore || 0).toFixed(1)}%</td>
//                                 <td>
//                                   <Button 
//                                     variant="outline-primary" 
//                                     size="sm"
//                                     onClick={() => handleViewTests(subject.name, subject.testCount)}
//                                   >
//                                     View Tests
//                                   </Button>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </Table>
                        
//                         <h6 className="mt-4 mb-3">Recent Test Takers</h6>
                        
//                         {(() => {
//                           const allTests = category.subjects.flatMap(subj => subj.tests || []);
//                           // Handle the case where tests might be missing or empty
//                           if (!allTests.length) {
//                             return <p className="text-muted">No test data available for this category.</p>;
//                           }
                          
//                           const uniqueUsers = Array.from(new Set(allTests
//                             .filter(test => test?.user && test.user._id) // Ensure test.user exists
//                             .map(test => test.user._id)))
//                             .map(userId => {
//                               const test = allTests.find(t => t.user && t.user._id === userId);
//                               return test?.user;
//                             })
//                             .filter(Boolean) 
//                             .slice(0, 5);
                          
//                           if (!uniqueUsers.length) {
//                             return <p className="text-muted">No users have taken tests in this category.</p>;
//                           }
                          
//                           return (
//                             <div className="d-flex flex-wrap">
//                               {uniqueUsers.map(user => (
//                                 <Card key={user._id} className="me-3 mb-3" style={{ width: '220px' }}>
//                                   <Card.Body>
//                                     <div className="d-flex align-items-center mb-3">
//                                       <div className="bg-light rounded-circle p-2 me-2">
//                                         <UserCircle size={30} />
//                                       </div>
//                                       <div>
//                                         <h6 className="mb-0">{user.name || 'Anonymous User'}</h6>
//                                       </div>
//                                     </div>
                                    
//                                     {(() => {
//                                       const userTests = allTests.filter(t => t.user && t.user._id === user._id);
//                                       const avgScore = userTests.reduce((sum, t) => sum + (t.score || 0), 0) / 
//                                                        (userTests.length || 1);
                                      
//                                       return (
//                                         <>
//                                           <div className="small text-muted mb-2">Tests: {userTests.length}</div>
//                                           <div className="small mb-3">
//                                             Avg Score: <Badge bg={avgScore > 70 ? 'success' : 'warning'}>
//                                               {avgScore.toFixed(1)}%
//                                             </Badge>
//                                           </div>
//                                         </>
//                                       );
//                                     })()}
                                    
//                                     <Button 
//                                       variant="link" 
//                                       className="p-0 small"
//                                       onClick={() => fetchUserStats(user._id, user.name || 'Anonymous User')}
//                                     >
//                                       View Detailed Stats
//                                     </Button>
//                                   </Card.Body>
//                                 </Card>
//                               ))}
                              
//                               {(category.totalUniqueUsers || 0) > 5 && (
//                                 <Card className="me-3 mb-3 d-flex justify-content-center align-items-center" 
//                                   style={{ width: '220px', background: '#f8f9fa' }}>
//                                   <Card.Body className="text-center">
//                                     <div className="text-muted mb-2">
//                                       +{(category.totalUniqueUsers || 0) - 5} more users
//                                     </div>
//                                     <Button 
//                                       variant="outline-secondary" 
//                                       size="sm"
//                                       onClick={() => handleViewAllUsers(
//                                         category._id?.categoryName || 'Unknown Category', 
//                                         category.totalUniqueUsers || 0
//                                       )}
//                                     >
//                                       View All
//                                     </Button>
//                                   </Card.Body>
//                                 </Card>
//                               )}
//                             </div>
//                           );
//                         })()}
//                       </>
//                     ) : (
//                       <p className="text-muted">No subjects available for this category.</p>
//                     )}
//                   </Accordion.Body>
//                 </Accordion.Item>
//               ))}
//             </Accordion>
//           ) : (
//             <p className="text-center text-muted py-4">No category data available</p>
//           )}
//         </Card.Body>
//       </Card>
      
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>{modalContent.title}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {modalContent.content}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalSubjects: 0,
    totalQuestions: 0,
    totalTests: 0,
  });

  const [detailedStats, setDetailedStats] = useState(null);
  const [selectedUserStats, setSelectedUserStats] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const fetchStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const [categories, subjects, questions, tests] = await Promise.all([
        axios.get('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/subjects', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/questions', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/tests', {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);

      setStats({
        totalCategories: categories.data.length,
        totalSubjects: subjects.data.length,
        totalQuestions: questions.data.length,
        totalTests: tests.data.length,
      });
    } catch (error) {
      toast.error('Failed to fetch statistics');
    }
  };

  const fetchDetailedStats = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const response = await axios.get('http://localhost:5000/api/admin-stats/detailed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDetailedStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch detailed statistics');
    }
  };

  const fetchUserTestStats = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo')).token;
      const response = await axios.get(`http://localhost:5000/api/admin-stats/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUserStats(response.data);
    } catch (error) {
      toast.error('Failed to fetch user statistics');
    }
  };

  useEffect(() => {
    fetchStats();
    fetchDetailedStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Categories</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalCategories}</p>
          <Link to="/admin/categories" className="text-blue-500 hover:text-blue-600">Manage Categories →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Subjects</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalSubjects}</p>
          <Link to="/admin/subjects" className="text-blue-500 hover:text-blue-600">Manage Subjects →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Questions</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</p>
          <Link to="/admin/questions" className="text-blue-500 hover:text-blue-600">Manage Questions →</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Tests Taken</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalTests}</p>
        </div>
      </div>

      {/* Detailed Statistics */}
      {detailedStats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Detailed Test Statistics</h2>
          
          {/* Overall Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Tests</h3>
              <p className="text-3xl font-bold text-blue-600">
                {detailedStats.overallStats.totalTests}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Total Test Takers</h3>
              <p className="text-3xl font-bold text-green-600">
                {detailedStats.overallStats.totalTestTakers}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Overall Average Score</h3>
              <p className="text-3xl font-bold text-purple-600">
                {detailedStats.overallStats.overallAvgScore.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Categories Breakdown */}
          <div className="space-y-6">
            {detailedStats.categoriesBreakdown.map(category => (
              <div key={category._id.categoryId} className="border rounded-lg p-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedCategory(expandedCategory === category._id.categoryId ? null : category._id.categoryId)}
                >
                  <h3 className="text-xl font-semibold">{category._id.categoryName}</h3>
                  <div className="text-sm text-gray-600">
                    {category.totalTests} Tests | {category.totalUniqueUsers} Users
                  </div>
                </div>

                {expandedCategory === category._id.categoryId && (
                  <div className="mt-4">
                    {category.subjects.map(subject => (
                      <div key={subject._id} className="mt-4 border-t pt-4">
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="text-lg font-semibold mb-2">{subject.name}</h4>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Tests Taken</p>
                              <p className="font-semibold">{subject.testCount}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Average Score</p>
                              <p className="font-semibold">{subject.avgScore.toFixed(2)}%</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Unique Users</p>
                              <p className="font-semibold">{subject.usersCount}</p>
                            </div>
                          </div>
                        </div>

                        {/* User Performance Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="p-2 text-left">User</th>
                                <th className="p-2 text-left">Score</th>
                                <th className="p-2 text-left">Date</th>
                                <th className="p-2 text-left">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {subject.tests.map(test => (
                                <tr key={test._id} className="border-b">
                                  <td className="p-2">{test.user.name}</td>
                                  <td className="p-2">
                                    <span className={`px-2 py-1 rounded ${
                                      test.score >= 70 ? 'bg-green-100 text-green-800' :
                                      test.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {test.score}%
                                    </span>
                                  </td>
                                  <td className="p-2">{new Date(test.createdAt).toLocaleDateString()}</td>
                                  <td className="p-2">
                                    <button 
                                      onClick={() => fetchUserTestStats(test.user._id)}
                                      className="text-white-600 hover:text-white-800"
                                    >
                                      View History
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Stats Modal */}
      {selectedUserStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedUserStats.user.name}'s Performance</h2>
              <button 
                onClick={() => setSelectedUserStats(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Tests Taken</p>
                <p className="text-2xl font-bold text-blue-600">{selectedUserStats.stats.totalTests}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {selectedUserStats.stats.avgScore.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(selectedUserStats.stats.testsByCategory).map(([category, data]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{category}</h3>
                  <p className="text-sm text-gray-600 mb-4">Tests Taken: {data.tests}</p>
                  
                  {Object.entries(data.subjects).map(([subject, tests]) => (
                    <div key={subject} className="mt-4 border-t pt-4">
                      <h4 className="font-medium mb-2">{subject}</h4>
                      <div className="space-y-2">
                        {tests.map(test => (
                          <div key={test.id} className="bg-gray-50 p-2 rounded flex justify-between">
                            <span>{new Date(test.date).toLocaleDateString()}</span>
                            <span className={`font-medium ${
                              test.score >= 70 ? 'text-green-600' :
                              test.score >= 50 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {test.score}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;