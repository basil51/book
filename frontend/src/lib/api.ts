//src/lib/api.ts
import axios from 'axios';

// Use environment variable or construct from BASE_DOMAIN
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // For client-side, use relative path since we're using rewrites
  if (typeof window !== 'undefined') {
    return '/api';
  }
  // For server-side, construct from BASE_DOMAIN
  const baseDomain = process.env.BASE_DOMAIN || process.env.NEXT_PUBLIC_BASE_DOMAIN || 'sparkco.localhost';
  return `http://api.book.${baseDomain}`;
};

const api = axios.create({
  baseURL: getApiUrl(),
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
