import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Team API
export const teamAPI = {
  createTeam: (teamData) => api.post('/teams/create-team', teamData),
  getTeams: () => api.get('/teams/get-teams'),
  getTeam: (teamId) => api.get(`/teams/${teamId}`),
  addTeammate: (teamId, email) => api.post(`/teams/${teamId}/add-member`, { email }),
  joinTeam: (teamId) => api.post(`/teams/${teamId}/join`),
  leaveTeam: (teamId) => api.post(`/teams/${teamId}/leave`),
};

export default api;
