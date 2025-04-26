import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook para utilizar o contexto de autenticação
 * @returns {Object} Contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}