import axios from 'axios';

// Criar instância do axios com URL base da API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor de requisição para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@carteira:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Se o erro for 401 (não autenticado), limpa dados da sessão e redireciona para login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('@carteira:token');
      localStorage.removeItem('@carteira:user');
      
      // Se o React Router estiver disponível no escopo global, redireciona
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;