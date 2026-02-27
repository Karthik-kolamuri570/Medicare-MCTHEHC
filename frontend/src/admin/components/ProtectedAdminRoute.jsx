import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { ThemeProvider } from '../context/ThemeContext';

const ProtectedAdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  // If no token or user, redirect to login
  if (!adminToken) {
    return <Navigate to="/login?role=admin" replace />;
  }

  // Render AdminLayout with children wrapped in ThemeProvider
  return (
    <ThemeProvider>
      <AdminLayout>{children}</AdminLayout>
    </ThemeProvider>
  );
};

export default ProtectedAdminRoute;
