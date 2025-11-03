// src/pages/auth/LoginPage.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Fade,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Lock, Person, Business, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../../contexts/AuthContext';

const BMW_THEME = {
  primary: '#1C69D4',
  primaryDark: '#0A4B9C',
  primaryLight: '#4D8FDF',
  primaryUltraLight: '#E8F1FD',
  accent: '#FF6D00',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  error: '#EF4444',
  gradientPrimary: 'linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

export default function LoginPage() {
  const { login, loading, role, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Snackbar state - simplified
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });

  // Prefill username from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const usernameFromQuery = params.get('username');
    const dealerFromQuery = params.get('dealer');

    if (usernameFromQuery && dealerFromQuery) {
      setForm(prev => ({ ...prev, username: usernameFromQuery }));
      setTimeout(() => passwordRef.current?.focus(), 100);
    }
  }, [location.search]);

  // Auto-focus username field on mount
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  // Redirect on login success - FIXED
  useEffect(() => {
    if (isAuthenticated && role) {
      setSnackbar({
        open: true,
        message: 'Login successful! Redirecting...',
        severity: 'success'
      });
      
      // Small delay to show the success message before redirect
      const timer = setTimeout(() => {
        const roleRedirects = {
          super_admin: '/super-admin/dashboard',
          dealer_admin: '/dealer/dashboard',
          dealer_user: '/dealer-user/new'
        };
        navigate(roleRedirects[role] || '/');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, role, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setSnackbar({ open: false, message: '', severity: 'info' });

    if (!form.username || !form.password) {
      showSnackbar('Both username and password are required.', 'warning');
      return;
    }

    try {
      await login(form.username.trim(), form.password);
      // Success message is handled in the useEffect above
    } catch (err) {
      const errorMessage = err.message || 'Invalid username or password. Please try again.';
      showSnackbar(errorMessage, 'error');
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: BMW_THEME.surface,
        p: 2,
        position: 'relative', // Ensure proper stacking context
      }}
    >
      <Fade in timeout={500}>
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            borderRadius: 3,
            border: `1px solid ${BMW_THEME.border}`,
            boxShadow: BMW_THEME.shadowLg,
            background: BMW_THEME.background,
            position: 'relative',
            zIndex: 1, // Ensure card is above background
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 3,
                  background: BMW_THEME.gradientPrimary,
                  mx: 'auto',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Business sx={{ fontSize: 32, color: '#fff' }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: BMW_THEME.gradientPrimary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CITNOW Analytics Portal
              </Typography>
              <Typography variant="body2" sx={{ color: BMW_THEME.textSecondary, mt: 0.5 }}>
                Sign in to continue
              </Typography>
            </Box>

            {/* Form */}
            <form onSubmit={onSubmit} noValidate>
              <TextField
                label="Username"
                name="username"
                fullWidth
                margin="normal"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                inputRef={usernameRef}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: BMW_THEME.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: BMW_THEME.primary,
                    },
                  },
                }}
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                inputRef={passwordRef}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: BMW_THEME.textSecondary }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: BMW_THEME.primary,
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: BMW_THEME.gradientPrimary,
                  color: '#fff',
                  boxShadow: BMW_THEME.shadowMd,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: BMW_THEME.shadowLg,
                    transform: 'translateY(-2px)',
                  },
                  '&:disabled': {
                    background: BMW_THEME.border,
                    color: BMW_THEME.textTertiary,
                    boxShadow: 'none',
                    transform: 'none',
                  },
                }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Fade>

      {/* Snackbar for errors & success - FIXED */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          // Ensure snackbar is on top of everything
          zIndex: 9999,
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          elevation={6}
          variant="filled"
          sx={{ 
            width: '100%', 
            fontWeight: 600,
            alignItems: 'center',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}