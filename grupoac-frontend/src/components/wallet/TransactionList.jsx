import React, { useEffect, useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import TransactionItem from './TransactionItem';
import ReverseTransactionModal from './ReverseTransactionModal';

const TransactionList = () => {
  const { 
    transactions, 
    getTransactions, 
    loading, 
    transactionsPage, 
    totalPages 
  } = useWallet();
  
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getTransactions(1);
  }, [getTransactions]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      getTransactions(newPage);
    }
  };

  const openReverseModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-xl font-semibold text-secondary-700 mb-4">Histórico de Transações</h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : transactions && transactions.length > 0 ? (
        <>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <TransactionItem 
                key={transaction.id} 
                transaction={transaction} 
                onReverse={() => openReverseModal(transaction)}
              />
            ))}
          </div>
          
          {/* Paginação */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(transactionsPage - 1)}
              disabled={transactionsPage === 1 || loading}
              className={`px-4 py-2 text-sm rounded-md ${
                transactionsPage === 1 || loading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary-600 hover:text-primary-700'
              }`}
            >
              Anterior
            </button>
            
            <span className="text-sm text-secondary-600">
              Página {transactionsPage} de {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(transactionsPage + 1)}
              disabled={transactionsPage === totalPages || loading}
              className={`px-4 py-2 text-sm rounded-md ${
                transactionsPage === totalPages || loading
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary-600 hover:text-primary-700'
              }`}
            >
              Próxima
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-secondary-500">
          Nenhuma transação encontrada
        </div>
      )}
      
      {/* Modal de Estorno */}
      {isModalOpen && selectedTransaction && (
        <ReverseTransactionModal
          transaction={selectedTransaction}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TransactionList;