import axios from 'axios';
import { getAuthToken } from './AuthToken';

// In dev, Vite proxies /api to the server; in Docker, nginx does. Set VITE_API_URL to
// call a server on another origin instead (e.g. https://my-api.example.com/api/v1).
export const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers['x-access-token'] = token;
  return config;
});

export const signUpRequest = data => api.post('/auth/signup', data);

export const loginRequest = data => api.post('/auth/signin', data);

export const newEntryRequest = data => api.post('/entries', data);

export const fetchEntriesRequest = () => api.get('/entries');

export const fetchEntryRequest = entryId => api.get(`/entries/${entryId}`);

export const updateEntryRequest = ({ entryId, ...data }) => api.put(`/entries/${entryId}`, data);

export const fetchUserProfile = () => api.get('/user/details');
