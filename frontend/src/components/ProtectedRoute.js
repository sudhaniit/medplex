import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-2 text-brand-blue">Loading...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Additional navigation logic based on user role
  // This ensures users are redirected to their appropriate dashboard if they try to access wrong routes
  const currentPath = location.pathname;
  
  // Define role-specific base paths
  const roleBasePaths = {
    superadmin: '/super-admin-dashboard',
    manufacturer: '/manufacturer-dashboard',
    hospital: '/medical-dashboard'
  };

  // If user is trying to access a generic route but should be redirected to their specific dashboard
  if (currentPath === '/' || currentPath === '/dashboard') {
    const redirectPath = roleBasePaths[user.role] || '/medical-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // Prevent hospital users from accessing manufacturer routes and vice versa
  if (user.role === 'hospital' && currentPath.startsWith('/manufacturer')) {
    return <Navigate to="/medical-dashboard" replace />;
  }

  if (user.role === 'manufacturer' && currentPath.startsWith('/medical')) {
    return <Navigate to="/manufacturer-dashboard" replace />;
  }

  // Prevent regular users from accessing super admin routes
  if (user.role !== 'superadmin' && currentPath.startsWith('/super-admin')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;