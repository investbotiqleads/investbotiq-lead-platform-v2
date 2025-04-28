import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../../hooks/useSupabaseClient';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAdmin } = useSupabaseAuth();
  const location = useLocation();

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('ProtectedRoute:', { loading, user, isAdmin });
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-blue-600">Authenticatie controleren...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated or not admin
  if (!user || !isAdmin) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Geen toegang tot admin: user of admin rol ontbreekt', { user });
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated and admin
  return children;
};

export default ProtectedRoute;
