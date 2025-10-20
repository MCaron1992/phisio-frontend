import axios from 'axios';

const api = axios.create({
  baseURL: 'https://energy-analytics-api.cloudbits.it/api/v1',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
