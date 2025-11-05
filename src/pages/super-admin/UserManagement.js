import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  InputAdornment,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  Stack,
  Toolbar
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Search,
  FilterList,
  Person,
  Business,
  Email as EmailIcon,
  Security
} from '@mui/icons-material';
import { listUsers, createUser, updateUser, deleteUser } from '../../services/users';

const BMW_THEME = {
  primary: '#1C69D4',
  primaryDark: '#0D47A1',
  secondary: '#37474F',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#546E7A',
  border: '#E0E0E0',
  hover: '#F5F5F5'
};

// ✅ REMOVED super_admin option - only dealer_admin remains
const ROLE_OPTS = [
  { value: 'dealer_admin', label: 'Dealer Admin' }
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    role: 'dealer_admin', // Default to dealer_admin
    password: '',
    dealer_id: '',
    showroom_name: ''
  });
  const [error, setError] = useState('');

  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('username');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const data = await listUsers();
      const dealerAdmins = data.filter(user => user.role === 'dealer_admin');
      setUsers(dealerAdmins);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!open) {
      setForm({ username: '', email: '', role: 'dealer_admin', password: '', dealer_id: '', showroom_name: '' });
      setEditingUser(null);
      setError('');
    }
  }, [open]);

  const handleCreate = async () => {
    setError('');
    if (!form.username || !form.email || !form.password || !form.showroom_name) {
      setError('Username, email, password, and showroom name are required');
      return;
    }
    try {
      await createUser(form);
      setOpen(false);
      load();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.error || 'Failed to create user');
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    setError('');

    if (!form.username || !form.email || !form.showroom_name) {
      setError('Username, email, and showroom name are required');
      return;
    }

    try {
      const updateData = { ...form };
      if (!updateData.password) {
        delete updateData.password;
      }
      if (updateData.dealer_id === '') {
        updateData.dealer_id = null;
      }

      await updateUser(editingUser._id || editingUser.id, updateData);
      setOpen(false);
      load();
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.response?.data?.error || 'Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this administrator?')) {
      try {
        await deleteUser(id);
        load();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'dealer_admin',
      password: '',
      dealer_id: user.dealer_id || '',
      showroom_name: user.showroom_name || ''
    });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (editingUser) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  // Table sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filtering and sorting
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.dealer_id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[orderBy] || '';
    const bValue = b[orderBy] || '';

    if (order === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return '#FF9800';
      case 'dealer_admin': return BMW_THEME.primary;
      default: return BMW_THEME.textSecondary;
    }
  };

  const isEditMode = Boolean(editingUser);
  const dialogTitle = isEditMode ? 'Edit Administrator' : 'Create New Administrator';
  const submitButtonText = isEditMode ? 'Update' : 'Create';

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: BMW_THEME.text, mb: 1 }}>
          Administrator Management
        </Typography>
        <Typography variant="body1" sx={{ color: BMW_THEME.textSecondary }}>
          Manage system administrators and dealer admins
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper elevation={0} sx={{ mb: 3, border: `1px solid ${BMW_THEME.border}` }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 2 }}>
          <TextField
            placeholder="Search users..."
            size="small"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: BMW_THEME.textSecondary }} />
                </InputAdornment>
              )
            }}
            sx={{ flexGrow: 1, minWidth: 250 }}
          />

          <TextField
            select
            size="small"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 150 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterList sx={{ color: BMW_THEME.textSecondary }} />
                </InputAdornment>
              )
            }}
          >
            <MenuItem value="all">All Roles</MenuItem>
            {/* ✅ Removed super_admin from filter dropdown too */}
            <MenuItem value="dealer_admin">Dealer Admin</MenuItem>
          </TextField>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{
              bgcolor: BMW_THEME.primary,
              '&:hover': { bgcolor: BMW_THEME.primaryDark },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            New Administrator
          </Button>
        </Toolbar>
      </Paper>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      ) : filteredUsers.length === 0 ? (
        <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: `1px solid ${BMW_THEME.border}` }}>
          <Person sx={{ fontSize: 64, color: BMW_THEME.border, mb: 2 }} />
          <Typography variant="h6" sx={{ color: BMW_THEME.textSecondary, mb: 1 }}>
            {searchQuery || roleFilter !== 'all' ? 'No users found' : 'No administrators yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: BMW_THEME.textSecondary, mb: 3 }}>
            {searchQuery || roleFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first administrator to get started'}
          </Typography>
          {!searchQuery && roleFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{ bgcolor: BMW_THEME.primary }}
            >
              Create Administrator
            </Button>
          )}
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ border: `1px solid ${BMW_THEME.border}` }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: BMW_THEME.surface }}>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'username'}
                      direction={orderBy === 'username' ? order : 'asc'}
                      onClick={() => handleRequestSort('username')}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Username
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleRequestSort('email')}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Email
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Role
                    </Typography>
                  </TableCell>
                   <TableCell>
                    <TableSortLabel
                      active={orderBy === 'showroom_name'}
                      direction={orderBy === 'showroom_name' ? order : 'asc'}
                      onClick={() => handleRequestSort('showroom_name')}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Showroom Name
                      </Typography>
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'dealer_id'}
                      direction={orderBy === 'dealer_id' ? order : 'asc'}
                      onClick={() => handleRequestSort('dealer_id')}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Dealer ID
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                 
                  <TableCell align="right">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Actions
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow
                    key={user._id || user.id}
                    hover
                    sx={{ '&:hover': { bgcolor: BMW_THEME.hover } }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            bgcolor: BMW_THEME.primary,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {user.username}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: BMW_THEME.textSecondary }}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Dealer Admin" // ✅ Simplified since only dealer_admin remains
                        size="small"
                        sx={{
                          bgcolor: `${BMW_THEME.primary}15`,
                          color: BMW_THEME.primary,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: BMW_THEME.text }}>
                        {user.showroom_name || '—'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{
                        fontFamily: 'monospace',
                        color: user.dealer_id ? BMW_THEME.text : BMW_THEME.textSecondary
                      }}>
                        {user.dealer_id || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit user">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(user)}
                            sx={{
                              color: BMW_THEME.primary,
                              '&:hover': { bgcolor: `${BMW_THEME.primary}10` }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete user">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(user._id || user.id)}
                            sx={{
                              color: '#D32F2F',
                              '&:hover': { bgcolor: '#D32F2F10' }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{
          bgcolor: BMW_THEME.surface,
          borderBottom: `1px solid ${BMW_THEME.border}`,
          fontWeight: 600
        }}>
          {dialogTitle}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: BMW_THEME.textSecondary }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: BMW_THEME.textSecondary }} />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              helperText={isEditMode ? "Leave blank to keep current password" : "Required for new users"}
              required={!isEditMode}
            />

            <TextField
              fullWidth
              select
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security sx={{ color: BMW_THEME.textSecondary }} />
                  </InputAdornment>
                )
              }}
            >
              {/* ✅ Now only shows "Dealer Admin" option */}
              {ROLE_OPTS.map(r => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Dealer ID"
              value={form.dealer_id}
              onChange={(e) => setForm({ ...form, dealer_id: e.target.value })}
              helperText="Optional: Assign to specific dealership"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: BMW_THEME.textSecondary }} />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label="Showroom Name"
              value={form.showroom_name}
              onChange={(e) => setForm({ ...form, showroom_name: e.target.value })}
              required
              helperText="Enter the dealership/showroom name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: BMW_THEME.textSecondary }} />
                  </InputAdornment>
                )
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: BMW_THEME.surface }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{ color: BMW_THEME.textSecondary }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: BMW_THEME.primary,
              '&:hover': { bgcolor: BMW_THEME.primaryDark },
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {submitButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
