import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  console.log("ProtectedRoute: Token found?", !!token);
  
  if (!token) {
    console.warn("ProtectedRoute: No token, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
