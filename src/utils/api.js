import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL; // <- plus de localhost

if (!API_BASE_URL) {
  console.error("❌ VITE_API_URL n'est pas défini !");
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

// ========== USERS ==========
export const getUsers = () => api.get('/user'); // attention à la route
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
