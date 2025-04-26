import { useContext } from 'react';
import { WalletContext } from '../contexts/WalletContext';

/**
 * Hook para utilizar o contexto da carteira
 * @returns {Object} Contexto da carteira
 */
export function useWallet() {
  const context = useContext(WalletContext);
  
  if (!context) {
    throw new Error('useWallet deve ser usado dentro de um WalletProvider');
  }
  
  return context;
}