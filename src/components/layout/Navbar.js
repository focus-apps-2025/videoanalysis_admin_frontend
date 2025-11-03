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
  Badge
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
  Notifications,
  Settings
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

/* 1 ──────────────────────────────────
      Enhanced BMW Theme
   ──────────────────────────────────── */
export const BMW_THEME = {
  // Primary Blues (BMW-inspired)
  primary: '#1C69D4',
  primaryDark: '#0A4B9C',
  primaryLight: '#4D8FDF',
  primaryUltraLight: '#E8F1FD',
  
  // Accent & Secondary
  accent: '#FF6D00',
  accentLight: '#FF9D45',
  
  // Neutrals
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Text
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  
  // Status
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)',
  gradientAccent: 'linear-gradient(135deg, #FF6D00 0%, #FF8A00 100%)',
  
  // Shadows
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
};

/* 2 ──────────────────────────────────
      Central menu definition
   ──────────────────────────────────── */
const MENU_BY_ROLE = {
  super_admin: [
    { text: 'Dashboard', path: '/super-admin/dashboard', icon: Dashboard },
    { text: 'User Management', path: '/super-admin/users', icon: People },
    { text: 'Dealer Network', path: '/super-admin/dealers', icon: Business }
  ],
  dealer_admin: [
    { text: 'Dashboard',   path: '/dealer/dashboard',  icon: Dashboard },
    { text: 'New Analysis',path: '/dealer/new',        icon: Analytics },
    { text: 'Bulk Upload', path: '/dealer/bulk',       icon: CloudUpload },
    { text: 'Results',     path: '/dealer/results',    icon: Assessment },
    { text: 'User Management', path: '/dealer/users',  icon: People }
  ]
};

const ROLE_LABEL = {
  super_admin : 'Super Admin',
  dealer_admin: 'Dealer Admin',
 
};

const ROLE_COLOR = {
  super_admin : BMW_THEME.primary,
  dealer_admin: BMW_THEME.accent,
  
};

/* 3 ──────────────────────────────────
      Component
   ──────────────────────────────────── */
export default function Navbar() {
  const { user, role, logout } = useContext(AuthContext);

  /* router helpers */
  const location      = useLocation();
  const navigate      = useNavigate();

  /* component state */
  const [userAnchor,  setUserAnchor]  = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [drawerOpen,  setDrawerOpen]  = useState(false);

  /* responsive helpers */
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  /* helper funcs */
  const isActive = (p) => location.pathname.startsWith(p);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const openUserMenu = (e) => setUserAnchor(e.currentTarget);
  const closeUserMenu = () => setUserAnchor(null);
  const openNotifMenu = (e) => setNotifAnchor(e.currentTarget);
  const closeNotifMenu = () => setNotifAnchor(null);

  /* drawer / side menu */
  const drawer = (
    <Box sx={{ width: 280, height: '100%', background: BMW_THEME.surface }}>
      {/* Drawer Header */}
      <Box sx={{ 
        p: 3, 
        background: BMW_THEME.gradientPrimary,
        color: '#fff'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          CITNOW Analytics
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ 
            width: 32, 
            height: 32, 
            bgcolor: 'rgba(255,255,255,0.2)',
            fontSize: '14px',
            fontWeight: 600
          }}>
            {(user?.username || 'U').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
              {user?.username || 'User'}
            </Typography>
            <Chip
              label={ROLE_LABEL[role] || 'User'}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontWeight: 600
              }}
            />
          </Box>
        </Box>
      </Box>
      
      <List sx={{ p: 2 }}>
        {(MENU_BY_ROLE[role] || []).map(({ text, path, icon: Icon }) => (
          <ListItemButton
            key={path}
            component={RouterLink}
            to={path}
            selected={isActive(path)}
            onClick={toggleDrawer}
            sx={{
              mb: 1,
              borderRadius: 2,
              '&.Mui-selected': {
                background: BMW_THEME.gradientPrimary,
                color: '#fff',
                '& .MuiListItemIcon-root': { color: '#fff' },
                '&:hover': {
                  background: BMW_THEME.gradientPrimary,
                  opacity: 0.9
                }
              },
              '&:hover': {
                backgroundColor: BMW_THEME.primaryUltraLight,
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: isActive(path) ? '#fff' : BMW_THEME.textSecondary,
              minWidth: 40
            }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary={text} 
              primaryTypographyProps={{
                fontWeight: isActive(path) ? 600 : 500,
                fontSize: '0.9rem'
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  /* render */
  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          background: BMW_THEME.background,
          borderBottom: `1px solid ${BMW_THEME.border}`,
          boxShadow: BMW_THEME.shadowSm,
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          minHeight: '70px !important'
        }}>
          {/* brand + burger */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton 
                onClick={toggleDrawer}
                sx={{
                  color: BMW_THEME.textPrimary,
                  '&:hover': { background: BMW_THEME.primaryUltraLight }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: BMW_THEME.gradientPrimary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Business sx={{ fontSize: 18, color: '#fff' }} />
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                background: BMW_THEME.gradientPrimary,
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                CITNOW
              </Typography>
            </Box>
          </Box>

          {/* desktop nav buttons */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              gap: 0.5,
              background: BMW_THEME.surface,
              borderRadius: 3,
              p: 0.5,
              border: `1px solid ${BMW_THEME.border}`
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

          {/* right side: notifications + user */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
           
            {/* User Role Chip */}
            <Chip
              label={ROLE_LABEL[role] || 'User'}
              size="small"
              sx={{
                display: { xs: 'none', sm: 'flex' },
                background: `${ROLE_COLOR[role] || BMW_THEME.primary}15`,
                color: ROLE_COLOR[role] || BMW_THEME.primary,
                fontWeight: 700,
                height: 28,
                fontSize: '0.75rem'
              }}
            />

            {/* User Avatar */}
            <Tooltip title="Account settings">
              <IconButton 
                onClick={openUserMenu}
                sx={{
                  p: 0.5,
                  border: `2px solid ${BMW_THEME.border}`,
                  '&:hover': { 
                    borderColor: BMW_THEME.primary,
                    background: BMW_THEME.primaryUltraLight
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    bgcolor: BMW_THEME.gradientPrimary,
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

      {/* drawer for mobile */}
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
            mt: 1,
            minWidth: 200,
            border: `1px solid ${BMW_THEME.border}`,
            boxShadow: BMW_THEME.shadowLg,
            borderRadius: 2
          }
        }}
      >
        <MenuItem disabled sx={{ 
          fontWeight: 600, 
          color: BMW_THEME.textPrimary,
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <Typography variant="body2" fontWeight={600}>{user?.username || 'User'}</Typography>
          <Typography variant="caption" color={BMW_THEME.textSecondary}>
            {user?.email || 'user@example.com'}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => { closeUserMenu(); logout(); }}
          sx={{ color: BMW_THEME.error }}
        >
          <ListItemIcon><ExitToApp fontSize="small" sx={{ color: BMW_THEME.error }} /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* push page content below fixed bar */}
      <Toolbar sx={{ minHeight: '70px !important' }}/>
    </>
  );
}

/* Enhanced NavButton Component */
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
          borderRadius: 2,
          color: active ? BMW_THEME.primary : BMW_THEME.textSecondary,
          background: active ? '#fff' : 'transparent',
          fontWeight: 600,
          fontSize: '0.875rem',
          boxShadow: active ? BMW_THEME.shadowSm : 'none',
          border: active ? `1px solid ${BMW_THEME.border}` : '1px solid transparent',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            background: '#fff',
            color: BMW_THEME.primary,
            boxShadow: BMW_THEME.shadowSm,
            border: `1px solid ${BMW_THEME.border}`
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
