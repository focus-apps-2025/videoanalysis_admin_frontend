import api from './api';

export async function listUsers() {
  const res = await api.get('/users/');
  return res.data;
}

export async function createUser(payload) {
  const res = await api.post('/users/', payload);
  return res.data;
}

export async function updateUser(userId, payload) {
  const res = await api.put(`/users/${userId}`, payload);
  return res.data;
}

export async function deleteUser(userId) {
  await api.delete(`/users/${userId}`);
}

export async function updateUserProfile(payload) {
  const res = await api.put('/users/me', payload);
  return res.data;
}


