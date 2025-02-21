import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo?.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;