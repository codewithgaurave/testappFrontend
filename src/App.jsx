import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import Categories from './components/admin/Categories';
import Subjects from './components/admin/Subjects';
import Questions from './components/admin/Questions';
import TakeTest from './components/user/TakeTest';
import TestHistory from './components/user/TestHistory';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/take-test/:subjectId" element={<TakeTest />} />
            <Route path="/test-history" element={<TestHistory />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/subjects" element={<Subjects />} />
            <Route path="/admin/questions" element={<Questions />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;