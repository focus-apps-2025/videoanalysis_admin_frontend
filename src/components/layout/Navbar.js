// src/components/layout/Navbar.jsx
import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Fade,
  InputAdornment
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Business,
  Analytics,
  CloudUpload,
  Assessment,
  ExitToApp,
  Person,
  Edit,
  Save,
  Cancel,
  Close,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

// Professional BMW Theme Colors
const BMW = {
  primary: '#1C69D4',
  primaryDark: '#0D47A1',
  primaryLight: '#5B9EED',
  primaryUltraLight: '#EBF4FF',
  white: '#FFFFFF',
  background: '#FAFBFC',
  surface: '#F5F7FA',
  border: '#E1E6ED',
  textPrimary: '#0A1929',
  textSecondary: '#3E5060',
  textTertiary: '#6B7A90',
  accent: '#00A5E0',
  success: '#00A86B',
  error: '#D32F2F'
};

// Menu configuration
const MENU_BY_ROLE = {
  super_admin: [
    { text: 'Dashboard', path: '/super-admin/dashboard', icon: Dashboard },
    { text: 'User Management', path: '/super-admin/users', icon: People },
    { text: 'Dealer Network', path: '/super-admin/dealers', icon: Business }
  ],
  dealer_admin: [
    { text: 'Dashboard', path: '/dealer/dashboard', icon: Dashboard },
    { text: 'New Analysis', path: '/dealer/new', icon: Analytics },
    { text: 'Bulk Upload', path: '/dealer/bulk', icon: CloudUpload },
    { text: 'Results', path: '/dealer/results', icon: Assessment },
    { text: 'User Management', path: '/dealer/users', icon: People }
  ],
};

const ROLE_LABEL = {
  super_admin: 'Super Admin',
  dealer_admin: 'Dealer Admin',
};

const ROLE_COLOR = {
  super_admin: BMW.primary,
  dealer_admin: BMW.accent,
};

export default function Navbar() {
  const { user, role, logout, updateProfile } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [userAnchor, setUserAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editBoxOpen, setEditBoxOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (p) => location.pathname.startsWith(p);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const openUserMenu = (e) => setUserAnchor(e.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleEditClick = () => {
    setEditForm({
      username: user?.username || '',
      email: user?.email || '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setEditBoxOpen(true);
    closeUserMenu();
  };

  const handleEditChange = (field) => (e) => {
    setEditForm(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSaveProfile = async () => {
    // Validation
    if (!editForm.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!editForm.email.trim()) {
      setError('Email is required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation if passwords are provided
    if (editForm.newPassword || editForm.confirmPassword) {
      if (editForm.newPassword !== editForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (editForm.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        username: editForm.username.trim(),
        email: editForm.email.trim(),
      };

      // Only include new password if provided
      if (editForm.newPassword) {
        updateData.new_password = editForm.newPassword;
      }

      await updateProfile(updateData);

      setSuccess('Profile updated successfully!');

      // Close box after success message
      setTimeout(() => {
        setEditBoxOpen(false);
        setEditForm({
          username: '',
          email: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccess('');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditBoxOpen(false);
    setEditForm({
      username: '',
      email: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, height: '100%', background: BMW.white }}>
      {/* Drawer Header */}
      <Box sx={{
        p: 3,
        background: BMW.primary,
        borderBottom: `1px solid ${BMW.border}`
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, color: 'white' }}>
          CITNOW Analytics
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{
            width: 36,
            height: 36,
            bgcolor: 'rgba(255,255,255,0.2)',
            fontSize: '15px',
            fontWeight: 600,
            color: 'white'
          }}>
            {(user?.username || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', lineHeight: 1.2 }}>
              {user?.username || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {ROLE_LABEL[role] || 'User'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ p: 2 }}>
        {(MENU_BY_ROLE[role] || []).map(({ text, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={RouterLink}
            to={path}
            selected={isActive(path)}
            onClick={toggleDrawer}
            sx={{
              mb: 0.5,
              borderRadius: 1.5,
              '&.Mui-selected': {
                background: BMW.primaryUltraLight,
                color: BMW.primary,
                '& .MuiListItemIcon-root': { color: BMW.primary },
                '&:hover': {
                  background: BMW.primaryUltraLight
                }
              },
              '&:hover': {
                backgroundColor: BMW.surface
              }
            }}
          >
            <ListItemIcon sx={{
              color: isActive(path) ? BMW.primary : BMW.textTertiary,
              minWidth: 40
            }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontWeight: isActive(path) ? 600 : 500,
                fontSize: '0.9375rem',
                color: isActive(path) ? BMW.primary : BMW.textPrimary
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Main AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: BMW.white,
          borderBottom: `1px solid ${BMW.border}`,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{
          justifyContent: 'space-between',
          minHeight: { xs: '64px', sm: '72px' },
          px: { xs: 2, sm: 3 }
        }}>
          {/* Left: Logo + Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  color: BMW.textPrimary,
                  '&:hover': { background: BMW.surface }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none'
              }}
            >
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                background: BMW.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Business sx={{ fontSize: 20, color: 'white' }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: BMW.primary,
                    display: { xs: 'block', sm: 'block' },
                    lineHeight: 1.2
                  }}
                >
                  {/* ✅ DYNAMIC: Show CITNOW for super_admin, showroom name for dealer_admin */}
                  {role === 'super_admin' ? 'FOCUS' : (user?.showroom_name || 'Dealer Portal')}
                </Typography>
                {role === 'dealer_admin' && user?.showroom_name && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: BMW.textSecondary,
                      display: { xs: 'none', sm: 'block' },
                      fontWeight: 500
                    }}
                  >
                    Powered by Focus
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Center: Desktop Navigation */}
          {!isMobile && (
            <Box sx={{
              display: 'flex',
              gap: 1,
              background: BMW.surface,
              borderRadius: 2,
              p: 0.5,
              border: `1px solid ${BMW.border}`
            }}>
              {(MENU_BY_ROLE[role] || []).map(({ text, path, icon: Icon }) => (
                <NavButton
                  key={path}
                  to={path}
                  active={isActive(path)}
                  icon={Icon}
                >
                  {text}
                </NavButton>
              ))}
            </Box>
          )}

          {/* Right: Role + User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Role Chip */}
            <Chip
              label={ROLE_LABEL[role] || 'User'}
              size="small"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                background: `${ROLE_COLOR[role] || BMW.primary}15`,
                color: ROLE_COLOR[role] || BMW.primary,
                fontWeight: 700,
                height: 28,
                fontSize: '0.75rem',
                border: `1px solid ${ROLE_COLOR[role] || BMW.primary}30`
              }}
            />

            {/* User Avatar */}
            <Tooltip title="Account">
              <IconButton
                onClick={openUserMenu}
                sx={{
                  p: 0.5,
                  border: `2px solid ${BMW.border}`,
                  '&:hover': {
                    borderColor: BMW.primary,
                    background: BMW.primaryUltraLight
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: BMW.primary,
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  {(user?.username || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            border: 'none'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userAnchor}
        open={Boolean(userAnchor)}
        onClose={closeUserMenu}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 220,
            border: `1px solid ${BMW.border}`,
            borderRadius: 2
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600} color={BMW.textPrimary}>
            {user?.username || 'User'}
          </Typography>
          <Typography variant="caption" color={BMW.textSecondary}>
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>
        <Divider />

        {/* Edit Profile Menu Item */}
        <MenuItem
          onClick={handleEditClick}
          sx={{
            color: BMW.textPrimary,
            py: 1.5,
            '&:hover': {
              background: BMW.surface
            }
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" sx={{ color: BMW.textSecondary }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Edit Profile</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => { closeUserMenu(); logout(); }}
          sx={{
            color: BMW.textPrimary,
            py: 1.5,
            '&:hover': {
              background: BMW.surface
            }
          }}
        >
          <ListItemIcon>
            <ExitToApp fontSize="small" sx={{ color: BMW.textSecondary }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Logout</Typography>
        </MenuItem>
      </Menu>

      {/* Compact Edit Profile Box (Top-Right Corner) */}
      <Fade in={editBoxOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            top: 80,
            right: 16,
            width: 320,
            maxWidth: '90vw',
            borderRadius: 2,
            border: `1px solid ${BMW.border}`,
            background: BMW.white,
            zIndex: theme.zIndex.modal,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box sx={{
            p: 2,
            background: BMW.primaryUltraLight,
            borderBottom: `1px solid ${BMW.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="subtitle1" fontWeight={600} color={BMW.textPrimary}>
              Edit Profile
            </Typography>
            <IconButton
              size="small"
              onClick={handleCancelEdit}
              disabled={loading}
              sx={{
                color: BMW.textTertiary,
                '&:hover': {
                  background: 'rgba(0,0,0,0.04)',
                  color: BMW.textPrimary
                }
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2.5 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
                {success}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Username */}
              <TextField
                label="Username"
                value={editForm.username}
                onChange={handleEditChange('username')}
                fullWidth
                size="small"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />

              {/* Email */}
              <TextField
                label="Email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange('email')}
                fullWidth
                size="small"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
              />

              {/* New Password with Eye Icon */}
              <TextField
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={editForm.newPassword}
                onChange={handleEditChange('newPassword')}
                fullWidth
                size="small"
                disabled={loading}
                placeholder="Leave empty to keep current password"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm Password with Eye Icon */}
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={editForm.confirmPassword}
                onChange={handleEditChange('confirmPassword')}
                fullWidth
                size="small"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Actions */}
            <Box sx={{
              display: 'flex',
              gap: 1,
              mt: 3,
              justifyContent: 'flex-end'
            }}>
              <Button
                onClick={handleCancelEdit}
                size="small"
                disabled={loading}
                sx={{
                  color: BMW.textSecondary,
                  borderRadius: 1,
                  px: 2,
                  '&:hover': {
                    background: BMW.surface
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                size="small"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={14} /> : <Save />}
                sx={{
                  background: BMW.primary,
                  borderRadius: 1,
                  px: 2,
                  '&:hover': {
                    background: BMW.primaryDark
                  },
                  '&.Mui-disabled': {
                    background: BMW.textTertiary
                  }
                }}
              >
                {loading ? 'Saving' : 'Save'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>

      {/* Toolbar spacer */}
      <Toolbar sx={{ minHeight: { xs: '64px', sm: '72px' } }} />
    </>
  );
}

// Navigation Button Component
function NavButton({ to, icon: Icon, active, children }) {
  return (
    <Box
      component={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          borderRadius: 1.5,
          color: active ? BMW.primary : BMW.textSecondary,
          background: active ? BMW.white : 'transparent',
          fontWeight: 600,
          fontSize: '0.875rem',
          border: active ? `1px solid ${BMW.border}` : '1px solid transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: BMW.white,
            color: BMW.primary,
            border: `1px solid ${BMW.border}`
          }
        }}
      >
        {Icon && <Icon sx={{ fontSize: 18 }} />}
        <Typography variant="body2" fontWeight={active ? 700 : 600}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
}
