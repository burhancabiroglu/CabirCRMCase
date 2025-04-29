import axios from 'axios';

// ----------------------------------------------------------------------

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Örn: Token süresi dolmuşsa logout veya refresh işlemi yapılabilir
    if (error.response?.status === 401) {
      console.warn('Unauthorized: Token expired or invalid');
      // logout işlemi burada tetiklenebilir
    }
    return Promise.reject(error);
  }
);

export default instance;