import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../../hooks/useSupabaseClient';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAdmin } = useSupabaseAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated or not admin
  if (!user || !isAdmin) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated and admin
  return children;
};

export default ProtectedRoute;
