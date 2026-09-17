import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Skeleton from '../ui/Skeleton';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: 'var(--sp-6)', gap: 'var(--sp-4)', minHeight: '100vh' }}>
        <Skeleton height={60} />
        <Skeleton height={200} />
        <Skeleton height={120} />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the intended location to return to after login
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    // Redirect based on their role if they try to access something they shouldn't
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'GYM_OWNER') return <Navigate to="/partner" replace />;
    return <Navigate to="/member" replace />;
  }

  return children;
}
