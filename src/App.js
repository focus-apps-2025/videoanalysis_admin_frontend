import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import theme from './styles/theme';
import AuthProvider from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import DealerDashboard from './pages/dealer-admin/Dashboard';
import UserManagement from './pages/super-admin/UserManagement';
import DealerManagement from './pages/super-admin/DealerManagement';
import NewAnalysis from './pages/dealer-admin/NewAnalysis';
import BulkUpload from './pages/dealer-admin/BulkUpload';
import Results from './pages/dealer-admin/Results';
import DealerUsers from './pages/dealer-admin/Users';
import DealerUserNewAnalysis from './pages/dealer-user/NewAnalysis';
import DealerUserBulkUpload from './pages/dealer-user/BulkUpload';
import DealerUserResults from './pages/dealer-user/Results'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute roles={["super_admin"]} />}> 
            <Route path="/super-admin/dashboard" element={<Layout><SuperAdminDashboard /></Layout>} />
            <Route path="/super-admin/users" element={<Layout><UserManagement /></Layout>} />
            <Route path="/super-admin/dealers" element={<Layout><DealerManagement /></Layout>} />
          </Route>

          <Route element={<ProtectedRoute roles={["dealer_admin"]} />}> 
            <Route path="/dealer/dashboard" element={<Layout><DealerDashboard /></Layout>} />
            <Route path="/dealer/new" element={<Layout><NewAnalysis /></Layout>} />
            <Route path="/dealer/bulk" element={<Layout><BulkUpload /></Layout>} />
            <Route path="/dealer/results" element={<Layout><Results /></Layout>} />
            <Route path="/dealer/users" element={<Layout><DealerUsers /></Layout>} />

          </Route>
           <Route element={<ProtectedRoute roles={["dealer_user"]} />}> 
            <Route path="/dealer-user/new" element={<Layout><DealerUserNewAnalysis /></Layout>} />
            <Route path="/dealer-user/bulk" element={<Layout><DealerUserBulkUpload /></Layout>} />
            <Route path="/dealer-user/results" element={<Layout><DealerUserResults /></Layout>} />
          </Route>
          


          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}


