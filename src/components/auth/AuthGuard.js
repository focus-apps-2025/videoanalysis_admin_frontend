import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function AuthGuard({ children, roles }) {
  const { isAuthenticated, role } = React.useContext(AuthContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && roles.length && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}




