import axios from 'axios';

const api = axios.create({
  baseURL: process.env.BASE_URL,
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
