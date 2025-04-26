import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Hook para fazer requisições com Axios
 * @param {Object} config - Configuração para a requisição
 * @param {string} config.url - URL da requisição
 * @param {string} [config.method='get'] - Método HTTP
 * @param {Object} [config.data=null] - Dados para enviar (POST, PUT, etc)
 * @param {Object} [config.params=null] - Parâmetros de query string
 * @param {boolean} [config.immediate=true] - Se true, faz a requisição imediatamente
 * @returns {Object} Estado da requisição e função para executar
 */
export function useAxios({ url, method = 'get', data = null, params = null, immediate = true }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeRequest = async (customData = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await api.request({
        url,
        method,
        data: customData || data,
        params,
      });
      
      setResponse(result.data);
      return result.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      executeRequest();
    }
  }, []);

  return { response, error, loading, executeRequest };
}