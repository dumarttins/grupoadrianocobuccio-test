import React from 'react';
import { useWallet } from '../../hooks/useWallet';

const TransactionItem = ({ transaction, onReverse }) => {
  const { 
    formatCurrency, 
    getTransactionTypeLabel, 
    getTransactionColorClass 
  } = useWallet();

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Verificar se a transação pode ser revertida
  const canBeReversed = () => {
    // Não permitir reversão de reversões
    if (transaction.type === 'reversal') {
      return false;
    }
    
    // Não permitir reverter transações que já foram revertidas
    if (transaction.has_reversal) {
      return false;
    }
    
    return true;
  };

  // Determinar ícone com base no tipo de transação
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-success-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
          </div>
        );
      case 'transfer_in':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-success-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
            </svg>
          </div>
        );
      case 'transfer_out':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-danger-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15.75l-6-6 6-6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15.75H8.25a2.25 2.25 0 01-2.25-2.25V8.25a2.25 2.25 0 012.25-2.25H9M15 12l-3-3m0 0l-3 3m3-3v10.5" />
            </svg>
          </div>
        );
      case 'reversal':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-warning-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-secondary-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="py-4 px-2 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-center space-x-4">
        {getTransactionIcon()}
        
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {getTransactionTypeLabel(transaction.type)}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {transaction.description || 'Sem descrição'}
          </p>
          <p className="text-xs text-gray-400">
            {formatDate(transaction.created_at)}
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <span className={`text-sm font-medium ${getTransactionColorClass(transaction.type)}`}>
            {['deposit', 'transfer_in'].includes(transaction.type) ? '+' : ''}
            {formatCurrency(transaction.amount)}
          </span>
          <p className="text-xs text-gray-500">
            Saldo: {formatCurrency(transaction.new_balance)}
          </p>
          
          {canBeReversed() && (
            <button 
              onClick={() => onReverse(transaction)}
              className="text-xs text-primary-600 hover:text-primary-800 mt-1"
            >
              Estornar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;