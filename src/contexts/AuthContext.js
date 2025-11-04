import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { setAuthToken } from '../services/api';
import { updateUserProfile } from '../services/users';

export const AuthContext = createContext(null);

const API_BASE = 'https://videoapi.focusengineeringapp.com';

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token;
  const role = user?.role;

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const form = new URLSearchParams();
      form.append('username', username);
      form.append('password', password);

      const res = await axios.post(`${API_BASE}/token`, form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const access = res.data?.access_token;
      if (!access) throw new Error('Invalid token response');

      setToken(access);
      setAuthToken(access);

      const me = await axios.get(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      setUser(me.data);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
  }, []);

  // UPDATED: Use the imported function instead of direct axios call
  const updateProfile = useCallback(async (profileData) => {
  setLoading(true);
  try {
    const updatedUser = await updateUserProfile(profileData);

    setUser(prevUser => ({
      ...prevUser,
      ...updatedUser
    }));

    return updatedUser;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        'Failed to update profile';
    throw new Error(errorMessage);
  } finally {
    setLoading(false);
  }
}, []); // No token dependency needed since it's handled in api.js
  useEffect(() => {
    // Whenever token changes, update global axios header
    setAuthToken(token);
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      isAuthenticated,
      loading,
      login,
      logout,
      updateProfile, 
      API_BASE,
    }),
    [token, user, role, isAuthenticated, loading, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
