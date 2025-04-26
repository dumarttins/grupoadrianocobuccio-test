import api from './api';

/**
 * Serviço para gerenciar autenticação e usuários
 */
class AuthService {
  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário (name, email, cpf, password, password_confirmation)
   * @returns {Promise} Promessa com dados do usuário registrado
   */
  async register(userData) {
    const response = await api.post('/register', userData);
    
    if (response.data && response.data.token) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    
    return response.data;
  }

  /**
   * Realiza login do usuário
   * @param {Object} credentials - Credenciais de login (email, password)
   * @returns {Promise} Promessa com dados da autenticação
   */
  async login(credentials) {
    const response = await api.post('/login', credentials);
    
    if (response.data && response.data.token) {
      this.setToken(response.data.token);
      this.setUser(response.data.user);
    }
    
    return response.data;
  }

  /**
   * Realiza logout do usuário
   * @returns {Promise} Promessa com confirmação do logout
   */
  async logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      this.clearSession();
    }
  }

  /**
   * Obtém informações do usuário atual
   * @returns {Promise} Promessa com dados do usuário
   */
  async getCurrentUser() {
    const response = await api.get('/user');
    
    if (response.data && response.data.user) {
      this.setUser(response.data.user);
    }
    
    return response.data.user;
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} Status de autenticação
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Salva token de autenticação no localStorage
   * @param {string} token - Token de autenticação
   */
  setToken(token) {
    localStorage.setItem('@carteira:token', token);
  }

  /**
   * Obtém token de autenticação do localStorage
   * @returns {string|null} Token de autenticação ou null
   */
  getToken() {
    return localStorage.getItem('@carteira:token');
  }

  /**
   * Salva dados do usuário no localStorage
   * @param {Object} user - Dados do usuário
   */
  setUser(user) {
    localStorage.setItem('@carteira:user', JSON.stringify(user));
  }

  /**
   * Obtém dados do usuário do localStorage
   * @returns {Object|null} Dados do usuário ou null
   */
  getUser() {
    const user = localStorage.getItem('@carteira:user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Limpa todos os dados da sessão do usuário
   */
  clearSession() {
    localStorage.removeItem('@carteira:token');
    localStorage.removeItem('@carteira:user');
  }
}

export default new AuthService();