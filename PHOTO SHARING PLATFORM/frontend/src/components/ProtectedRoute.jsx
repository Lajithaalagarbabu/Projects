import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading text="Authenticating session..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'TEAM_MEMBER') {
      return <Navigate to="/team/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
