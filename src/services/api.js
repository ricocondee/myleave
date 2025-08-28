import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    const enhancedError = {
      message: error.response?.data?.message || error.message || 'An unknown error occurred',
      status: error.response?.status,
      originalError: error
    };
    if (import.meta.env.MODE !== 'production') {
      console.error('API Error:', enhancedError);
    }
    return Promise.reject(enhancedError);
  }
);

export const isDevelopment = import.meta.env.MODE === 'development';
