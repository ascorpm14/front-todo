import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ========== USERS ==========
export const getUsers = () => api.get('/users');
export const getOrCreateUser = (pseudo) => api.post('/user', { pseudo });

// ========== TASKS ==========
export const getAllTasks = () => api.get('/tasks');
export const getUserTasks = (userId) => api.get(`/tasks/user/${userId}`);
export const createTask = (taskData) => api.post('/tasks', taskData);
export const completeTask = (taskId, completedBy) =>
  api.put(`/tasks/${taskId}`, { completedBy });
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);

// ========== STATS ==========
export const getWeeklyStats = () => api.get('/stats/weekly');
export const getUserStats = (userId) => api.get(`/stats/user/${userId}`);
export const getChartData = (userId) => api.get(`/stats/chart/${userId}`);

export default api;
