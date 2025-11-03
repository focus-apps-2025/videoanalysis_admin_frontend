import axios from 'axios';

const API_BASE = 'http://72.60.96.50:5000';
const api = axios.create({ baseURL: API_BASE });

// Dynamically attach token from context
export const setAuthToken = (token) => {
  // clear any old interceptors to avoid duplicates
  api.interceptors.request.handlers = [];
  api.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export { API_BASE };
export default api;
