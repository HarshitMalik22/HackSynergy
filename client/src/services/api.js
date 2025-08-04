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
    // Skip token check for auth endpoints
    if (config.url.includes('/auth/')) {
      return config;
    }
    
    const token = localStorage.getItem('token');
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      headers: config.headers
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set with token');
    } else {
      console.warn('No authentication token found in localStorage');
      // Optionally redirect to login if needed
      // window.location.href = '/login';
    }
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error Response:', {
        url: error.config.url,
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        console.error('Authentication error - redirecting to login');
        // You might want to redirect to login page here
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
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
  getProfile: () => api.get('/users/getUser'),
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
