import React, { useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';

const BalanceCard = () => {
  const { wallet, getBalance, formatCurrency, loading } = useWallet();

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <div className="bg-white rounded-xl shadow-card p-6 mb-6">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium text-secondary-600 mb-1">Saldo Disponível</h2>
        
        {loading ? (
          <div className="flex items-center justify-center h-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-primary-700">
              {wallet ? formatCurrency(wallet.balance) : 'R$ 0,00'}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="text-secondary-500">Conta</span>
            <p className="font-medium">{wallet?.account_number || '-'}</p>
          </div>
          <button 
            onClick={() => getBalance()} 
            className="text-primary-600 hover:text-primary-700"
            disabled={loading}
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;