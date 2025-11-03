import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, role, loading } = React.useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (Array.isArray(roles) && roles.length > 0 && !roles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // Support both wrapper usage (<Route element={<ProtectedRoute/>}><Route .../></Route>)
  // and direct child usage (<ProtectedRoute><Component/></ProtectedRoute>)
  return children ? children : <Outlet />;
}
