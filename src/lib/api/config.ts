import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

const tokenManager = {
  getToken: () => localStorage.getItem('auth_token'),
  setToken: token => localStorage.setItem('auth_token', token),
  removeToken: () => localStorage.removeItem('auth_token'),
};

axiosInstance.interceptors.request.use(
  config => {
    const token = tokenManager.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }

    console.log('Richiesta:', config.method?.toUpperCase(), config.url);
    return config;
  },
  error => {
    console.error(' Errore nella richiesta:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => {
    console.log('Risposta ricevuta:', response.status, response.config.url);

    const newToken = response.headers['authorization'] || response.data.token;
    if (newToken) {
      tokenManager.setToken(newToken.replace('Bearer ', ''));
    }

    return response;
  },
  async error => {
    const originalRequest = error.config;

    console.error(
      'Errore nella risposta:',
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(
            `${axiosInstance.defaults.baseURL}/auth/refresh`,
            {
              refresh_token: refreshToken,
            }
          );

          const newToken = response.data.access_token;
          tokenManager.setToken(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Errore nel refresh del token:', refreshError);
      }

      tokenManager.removeToken();
      localStorage.removeItem('refresh_token');

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      console.warn('⚠Accesso negato - Permessi insufficienti');
    }

    if (error.code === 'NETWORK_ERROR' || !error.response) {
      console.error('🌐 Errore di connessione');
    }

    if (error.response?.status === 422) {
      console.warn('⚠️ Errori di validazione:', error.response.data.errors);
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async credentials => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { access_token, refresh_token, user } = response.data;

      tokenManager.setToken(access_token);
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token);
      }

      return { token: access_token, user };
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    } finally {
      tokenManager.removeToken();
      localStorage.removeItem('refresh_token');
    }
  },

  isAuthenticated: () => {
    return !!tokenManager.getToken();
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/user');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const initializeCSRF = async () => {
  try {
    await axiosInstance.get('/sanctum/csrf-cookie');
    console.log('✅ CSRF cookie inizializzato');
  } catch (error) {
    console.error("❌ Errore nell'inizializzazione CSRF:", error);
  }
};

export default axiosInstance;
