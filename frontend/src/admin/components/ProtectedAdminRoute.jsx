import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const ProtectedAdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  // If no token or user, redirect to login
  if (!adminToken || !adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // Render AdminLayout with children (the actual page component)
  return <AdminLayout>{children}</AdminLayout>;
};

export default ProtectedAdminRoute;
