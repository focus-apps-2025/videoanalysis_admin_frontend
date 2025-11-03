// src/pages/dealer-admin/Users.js
import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Box,
  Chip,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Alert,
  InputAdornment,
  Fade,
  Container,
  Divider,
  LinearProgress,
  Snackbar
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Person, 
  Search,
  Group,
  Email,
  Badge,
  Refresh,
  Shield,
  Visibility,
  VisibilityOff,
  Business,
  ContentCopy,
  Link,
  Close
} from '@mui/icons-material';
import { listMyDealerUsers, createDealerUser, updateDealerUser, deleteDealerUser } from '../../services/dealer_user';
import { AuthContext } from '../../contexts/AuthContext';

// BMW Theme Constants
const MODERN_BMW_THEME = {
  primary: '#0e2342ff',
  primaryDark: '#0A4B9C',
  primaryLight: '#4D8FDF',
  primaryUltraLight: '#E8F1FD',
  accent: '#FF6D00',
  accentLight: '#FF9D45',
  accentUltraLight: '#FFF3E8',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  gradientPrimary: 'linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)',
  gradientAccent: 'linear-gradient(135deg, #FF6D00 0%, #FF8A00 100%)',
  gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// Dealer User Base URL - UPDATED
const DEALER_USER_BASE_URL = 'https://dealeruser.netlify.app';

// User Card Component
const UserCard = ({ user, onEdit, onDelete }) => (
  <Fade in={true}>
    <Card sx={{
      background: MODERN_BMW_THEME.surfaceElevated,
      border: `1px solid ${MODERN_BMW_THEME.border}`,
      borderRadius: 3,
      boxShadow: MODERN_BMW_THEME.shadowSm,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        boxShadow: MODERN_BMW_THEME.shadowMd,
        transform: 'translateY(-2px)',
        borderColor: MODERN_BMW_THEME.primaryLight
      },
      height: '100%'
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              background: MODERN_BMW_THEME.gradientPrimary,
              fontWeight: 600,
              fontSize: '18px',
              mr: 2
            }}
          >
            {(user.username || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{
              color: MODERN_BMW_THEME.textPrimary,
              fontWeight: 600,
              mb: 0.5
            }}>
              {user.username}
            </Typography>
            <Chip
              label={user.role === 'dealer_admin' ? 'Dealer Admin' : 'Dealer User'}
              size="small"
              sx={{
                background: user.role === 'dealer_admin' ? MODERN_BMW_THEME.accent : MODERN_BMW_THEME.primary,
                color: MODERN_BMW_THEME.background,
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: MODERN_BMW_THEME.borderLight, mb: 3 }} />

        {/* User Details */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Email sx={{ fontSize: 18, color: MODERN_BMW_THEME.textSecondary, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{
                color: MODERN_BMW_THEME.textSecondary,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}>
                EMAIL
              </Typography>
              <Typography variant="body2" sx={{
                color: MODERN_BMW_THEME.textPrimary,
                fontWeight: 500,
                wordBreak: 'break-word'
              }}>
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge sx={{ fontSize: 18, color: MODERN_BMW_THEME.textSecondary, mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{
                color: MODERN_BMW_THEME.textSecondary,
                fontWeight: 500,
                fontSize: '0.75rem'
              }}>
                DEALER ID
              </Typography>
              <Typography variant="body2" sx={{
                color: MODERN_BMW_THEME.textPrimary,
                fontWeight: 600,
                fontFamily: 'monospace'
              }}>
                {user.dealer_id || '—'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: MODERN_BMW_THEME.borderLight, mb: 3 }} />

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{
            color: MODERN_BMW_THEME.textTertiary,
            fontStyle: 'italic'
          }}>
            Created {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit User">
              <IconButton
                size="small"
                onClick={() => onEdit(user)}
                sx={{
                  color: MODERN_BMW_THEME.primary,
                  background: `${MODERN_BMW_THEME.primary}08`,
                  '&:hover': {
                    background: `${MODERN_BMW_THEME.primary}15`
                  }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete User">
              <IconButton
                size="small"
                onClick={() => onDelete(user._id || user.id)}
                sx={{
                  color: MODERN_BMW_THEME.error,
                  background: `${MODERN_BMW_THEME.error}08`,
                  '&:hover': {
                    background: `${MODERN_BMW_THEME.error}15`
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Fade>
);

export default function DealerUsers() {
  const { user: authUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'dealer_user',
    dealer_id: authUser?.dealer_id || '',
  });

  // Show success message
  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  // Close success message
  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccess(false);
  };

  // Load users belonging to this dealer
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listMyDealerUsers();
      const filtered = data.filter(
        (u) => String(u.dealer_id) === String(authUser?.dealer_id)
      );
      setUsers(filtered);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser?.dealer_id) load();
  }, [authUser]);

  // Reset dialog form when closing
  useEffect(() => {
    if (!open) {
      setForm({
        username: '',
        email: '',
        password: '',
        role: 'dealer_user',
        dealer_id: authUser?.dealer_id || '',
      });
      setEditingUser(null);
      setError('');
      setShowPassword(false);
    }
  }, [open, authUser]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      dealer_id: user.dealer_id,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await deleteDealerUser(id);
      await load();
      showSuccessMessage('User deleted successfully!');
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!form.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!editingUser && !form.password) {
      setError('Password is required for new users');
      return false;
    }
    if (form.password && form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingUser) {
        const updated = { ...form };
        if (!updated.password) delete updated.password;
        await updateDealerUser(editingUser._id || editingUser.id, updated);
        showSuccessMessage('User updated successfully!');
      } else {
        await createDealerUser(form);
        showSuccessMessage('User created successfully!');
      }
      setOpen(false);
      await load();
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.response?.data?.error || 'Failed to save user. Please try again.');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: MODERN_BMW_THEME.background,
      py: 4
    }}>
      <Container maxWidth="xl">
        
        {/* Global Success Snackbar */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={4000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              background: MODERN_BMW_THEME.gradientSuccess,
              borderRadius: 3,
              boxShadow: MODERN_BMW_THEME.shadowLg,
              minWidth: '300px',
              fontWeight: 500,
              fontSize: '14px'
            }
          }}
        >
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            sx={{
              width: '100%',
              background: MODERN_BMW_THEME.success,
              color: 'white',
              borderRadius: 3,
              fontWeight: 600,
              '& .MuiAlert-icon': { color: 'white' },
              '& .MuiAlert-message': { 
                fontWeight: 600,
                fontSize: '16px'
              }
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>

        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: MODERN_BMW_THEME.textPrimary,
              mb: 2,
              background: MODERN_BMW_THEME.gradientPrimary,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Team Management
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: MODERN_BMW_THEME.textSecondary,
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              mb: 3
            }}
          >
            Manage your dealership team members and their access permissions
          </Typography>

          {/* Dealer Info Card */}
          <Card sx={{
            background: MODERN_BMW_THEME.surfaceElevated,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            borderRadius: 3,
            boxShadow: MODERN_BMW_THEME.shadowSm,
            maxWidth: '400px',
            mx: 'auto',
            mb: 4
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Business sx={{ color: MODERN_BMW_THEME.primary, mr: 2, fontSize: 24 }} />
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{
                      color: MODERN_BMW_THEME.textSecondary,
                      fontWeight: 500,
                      mb: 0.5
                    }}>
                      DEALERSHIP ID
                    </Typography>
                    <Typography variant="h6" sx={{
                      color: MODERN_BMW_THEME.textPrimary,
                      fontWeight: 700,
                      fontFamily: 'monospace'
                    }}>
                      {authUser?.dealer_id || 'N/A'}
                    </Typography>
                  </Box>
                </Box>

                {/* Access URL */}
                {authUser?.dealer_id && (
                  <Box sx={{
                    mt: 2,
                    p: 1.5,
                    background: MODERN_BMW_THEME.successLight,
                    borderRadius: 2,
                    border: `1px solid ${MODERN_BMW_THEME.success}80`,
                    width: '100%',
                    maxWidth: '320px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    wordBreak: 'break-all'
                  }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: MODERN_BMW_THEME.success,
                        fontWeight: 600,
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        flex: 1,
                        textAlign: 'center'
                      }}
                    >
                      {`${DEALER_USER_BASE_URL}/login?dealer=${authUser.dealer_id}`}
                    </Typography>
                    <Tooltip title="Copy Access URL">
                      <IconButton
                        size="small"
                        onClick={() => navigator.clipboard.writeText(
                          `${DEALER_USER_BASE_URL}/login?dealer=${authUser.dealer_id}`
                        )}
                        sx={{
                          color: MODERN_BMW_THEME.success,
                          '&:hover': {
                            background: `${MODERN_BMW_THEME.success}15`
                          }
                        }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Action Bar */}
        <Box sx={{
          p: 3,
          background: MODERN_BMW_THEME.surface,
          borderRadius: 3,
          border: `1px solid ${MODERN_BMW_THEME.border}`,
          mb: 4
        }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: MODERN_BMW_THEME.textTertiary }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: MODERN_BMW_THEME.background,
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: MODERN_BMW_THEME.primary,
                    },
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { md: 'flex-end' }, gap: 2 }}>
              <Button
                startIcon={<Refresh />}
                onClick={load}
                disabled={loading}
                variant="outlined"
                sx={{
                  borderColor: MODERN_BMW_THEME.border,
                  color: MODERN_BMW_THEME.textSecondary,
                  borderRadius: 2,
                  fontWeight: 500
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpen(true)}
                sx={{
                  background: MODERN_BMW_THEME.gradientPrimary,
                  borderRadius: 3,
                  px: 4,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '16px',
                  boxShadow: MODERN_BMW_THEME.shadowMd,
                  '&:hover': {
                    boxShadow: MODERN_BMW_THEME.shadowLg,
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Add Team Member
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Stats Overview */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{ mb: 4, textAlign: 'center' }}
        >
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{
              width: '100%',
              maxWidth: 360,
              background: MODERN_BMW_THEME.surfaceElevated,
              border: `1px solid ${MODERN_BMW_THEME.border}`,
              borderRadius: 3,
              boxShadow: MODERN_BMW_THEME.shadowSm
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Group sx={{ fontSize: 40, color: MODERN_BMW_THEME.primary, mb: 2 }} />
                <Typography variant="h3" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 700, mb: 1 }}>
                  {users.length}
                </Typography>
                <Typography variant="body1" sx={{ color: MODERN_BMW_THEME.textSecondary, fontWeight: 500 }}>
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{
              width: '100%',
              maxWidth: 360,
              background: MODERN_BMW_THEME.surfaceElevated,
              border: `1px solid ${MODERN_BMW_THEME.border}`,
              borderRadius: 3,
              boxShadow: MODERN_BMW_THEME.shadowSm
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Shield sx={{ fontSize: 40, color: MODERN_BMW_THEME.accent, mb: 2 }} />
                <Typography variant="h3" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 700, mb: 1 }}>
                  {users.filter(u => u.role === 'dealer_admin').length}
                </Typography>
                <Typography variant="body1" sx={{ color: MODERN_BMW_THEME.textSecondary, fontWeight: 500 }}>
                  Admin Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Card sx={{
              width: '100%',
              maxWidth: 360,
              background: MODERN_BMW_THEME.surfaceElevated,
              border: `1px solid ${MODERN_BMW_THEME.border}`,
              borderRadius: 3,
              boxShadow: MODERN_BMW_THEME.shadowSm
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Person sx={{ fontSize: 40, color: MODERN_BMW_THEME.success, mb: 2 }} />
                <Typography variant="h3" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 700, mb: 1 }}>
                  {users.filter(u => u.role === 'dealer_user').length}
                </Typography>
                <Typography variant="body1" sx={{ color: MODERN_BMW_THEME.textSecondary, fontWeight: 500 }}>
                  Standard Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Loading State */}
        {loading && (
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 360 }}>
              <LinearProgress sx={{ borderRadius: 2, height: 6 }} />
            </Box>
          </Box>
        )}

        {/* Error Display */}
        {error && !open && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: 3,
              maxWidth: 720,
              mx: 'auto',
              '& .MuiAlert-message': { fontWeight: 500 }
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Users Grid */}
        {!loading && filteredUsers.length === 0 ? (
          <Card
            sx={{
              background: MODERN_BMW_THEME.surfaceElevated,
              border: `1px solid ${MODERN_BMW_THEME.border}`,
              borderRadius: 3,
              textAlign: 'center',
              p: 8,
              boxShadow: MODERN_BMW_THEME.shadowSm,
              maxWidth: 720,
              mx: 'auto'
            }}
          >
            <Person sx={{ fontSize: 80, color: MODERN_BMW_THEME.textTertiary, mb: 3, opacity: 0.5 }} />
            <Typography variant="h4" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 600, mb: 2 }}>
              {searchTerm ? 'No Users Found' : 'No Team Members Yet'}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: MODERN_BMW_THEME.textSecondary, mb: 4, maxWidth: '400px', mx: 'auto', lineHeight: 1.6 }}
            >
              {searchTerm
                ? 'Try adjusting your search terms to find team members'
                : 'Get started by adding the first member to your dealership team'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{ background: MODERN_BMW_THEME.gradientPrimary, borderRadius: 3, px: 4, fontWeight: 600 }}
            >
              Add First Member
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {filteredUsers.map((user) => (
              <Grid item xs={12} sm={6} lg={4} key={user._id || user.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: 420 }}>
                  <UserCard user={user} onEdit={handleEdit} onDelete={handleDelete} />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Enhanced User Form Dialog */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: MODERN_BMW_THEME.background,
              border: `1px solid ${MODERN_BMW_THEME.border}`,
              borderRadius: 3,
              boxShadow: MODERN_BMW_THEME.shadowXl
            }
          }}
        >
          <DialogTitle sx={{
            background: MODERN_BMW_THEME.gradientPrimary,
            color: MODERN_BMW_THEME.background,
            fontWeight: 600,
            py: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 2, fontSize: 24 }} />
              {editingUser ? 'Edit Team Member' : 'Add Team Member'}
            </Box>
          </DialogTitle>

          <DialogContent sx={{ mt: 2, p: 3 }}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontWeight: 500
                  }
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              margin="normal"
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: MODERN_BMW_THEME.primary,
                  },
                }
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: MODERN_BMW_THEME.primary,
                  },
                }
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required={!editingUser}
              helperText={editingUser ? 'Leave blank to keep existing password' : 'Password must be at least 6 characters'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: MODERN_BMW_THEME.primary,
                  },
                }
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              select
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: MODERN_BMW_THEME.primary,
                  },
                }
              }}
            >
              <MenuItem value="dealer_user">Dealer User</MenuItem>
              <MenuItem value="dealer_admin">Dealer Admin</MenuItem>
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              label="Dealer ID"
              value={form.dealer_id}
              disabled
              helperText="Automatically assigned to your dealership"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: MODERN_BMW_THEME.surface,
                }
              }}
            />

            {/* ACCESS URL PREVIEW - Only show for dealer users */}
            {form.role === 'dealer_user' && form.username && form.dealer_id && (
              <Box sx={{ mt: 3, p: 2, background: MODERN_BMW_THEME.successLight, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: MODERN_BMW_THEME.success }}>
                  Dealer Portal Access URL
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{
                    color: MODERN_BMW_THEME.success,
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    flex: 1,
                    wordBreak: 'break-all'
                  }}>
                    {`${DEALER_USER_BASE_URL}/login?dealer=${form.dealer_id}&username=${form.username}`}
                  </Typography>
                  <Tooltip title="Copy Access URL">
                    <IconButton
                      size="small"
                      onClick={() => navigator.clipboard.writeText(
                        `${DEALER_USER_BASE_URL}/login?dealer=${form.dealer_id}&username=${form.username}`
                      )}
                      sx={{
                        color: MODERN_BMW_THEME.success,
                        '&:hover': {
                          background: `${MODERN_BMW_THEME.success}15`
                        }
                      }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary, mt: 1, display: 'block' }}>
                  Share this URL with the user to access the dealer portal
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setOpen(false)}
              variant="outlined"
              sx={{
                borderColor: MODERN_BMW_THEME.border,
                color: MODERN_BMW_THEME.textSecondary,
                borderRadius: 2,
                px: 3,
                fontWeight: 500,
                '&:hover': {
                  borderColor: MODERN_BMW_THEME.textSecondary,
                  color: MODERN_BMW_THEME.textPrimary
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                background: MODERN_BMW_THEME.gradientPrimary,
                borderRadius: 2,
                px: 4,
                fontWeight: 600,
                boxShadow: MODERN_BMW_THEME.shadowMd,
                '&:hover': {
                  boxShadow: MODERN_BMW_THEME.shadowLg,
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}