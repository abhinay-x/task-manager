import axios from 'axios';

const rawBaseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1').trim();
const sanitizedBaseUrl = rawBaseUrl.replace(/\/$/, '');
const API_BASE_URL = sanitizedBaseUrl.endsWith('/api/v1')
  ? sanitizedBaseUrl
  : `${sanitizedBaseUrl}/api/v1`;

const API = axios.create({ baseURL: API_BASE_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`;
  }
  return req;
});

export const signup = (formData) => API.post('/auth/signup', formData);
export const login = (formData) => API.post('/auth/login', formData);

export const getMe = () => API.get('/me');
export const updateMe = (formData) => API.put('/me', formData);

export const getTasks = () => API.get('/tasks');
export const createTask = (taskData) => API.post('/tasks', taskData);
export const getTaskById = (id) => API.get(`/tasks/${id}`);
export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

export default API;
