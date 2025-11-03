// src/services/dealerUsers.js
import api from './api';

/*
  Dealer Users service
  These functions help dealer_admin manage only their own team's users.
  It uses the same /users backend endpoints but keeps everything scoped to their dealer_id.
*/

// 🔹 Get all users under a specific dealer
export const listDealerUsers = async (dealerId) => {
  try {
    if (!dealerId) {
      throw new Error('Dealer ID is required');
    }
    
    //console.log(`🔄 [listDealerUsers] Fetching users for dealer: "${dealerId}"`);
    const res = await api.get(`/users/by-dealer/${dealerId}`);
    //console.log(`✅ [listDealerUsers] Found ${res.data.length} users for dealer "${dealerId}"`);
    return res.data;
  } catch (err) {
    //console.error('❌ [listDealerUsers] Error fetching dealer users:', err);
    //console.error('❌ [listDealerUsers] Error response:', err.response?.data);
    throw err;
  }
};
// 🔹 Get user statistics including video counts
export const getDealerUserStats = async (dealerId) => {
  try {
    const res = await api.get(`/dashboard/dealer/${dealerId}/user-stats`);
    return res.data;
  } catch (err) {
    //console.error('Error fetching dealer user stats:', err);
    throw err;
  }
};

// ... rest of your functions remain the same
export const createDealerUser = async (userData) => {
  try {
    const payload = {
      ...userData,
      role: 'dealer_user', // fixed role for dealer-admin created users
    };
    const res = await api.post('/users/', payload);
    return res.data;
  } catch (err) {
    //console.error('Error creating dealer user:', err);
    throw err;
  }
};

export const updateDealerUser = async (id, data) => {
  try {
    const payload = { ...data };
    if (!payload.password) {
      delete payload.password; // don't send empty passwords on update
    }
    const res = await api.put(`/users/${id}`, payload);
    return res.data;
  } catch (err) {
    //console.error('Error updating dealer user:', err);
    throw err;
  }
};

export const deleteDealerUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) {
    //console.error('Error deleting dealer user:', err);
    throw err;
  }
};

export const listMyDealerUsers = async () => {
  try {
    console.log(`🔄 [listMyDealerUsers] Fetching users for current dealer`);
    const res = await api.get('/users/my-dealer');
    console.log(`✅ [listMyDealerUsers] Found ${res.data.length} users`);
    return res.data;
  } catch (err) {
    console.error('❌ [listMyDealerUsers] Error fetching dealer users:', err);
    throw err;
  }
};