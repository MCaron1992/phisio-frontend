import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(c => c.startsWith('token='));

    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('Nessun token trovato nei cookie');
    }
  }

  return config;
});

export default api;
