import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';

const ReverseTransactionModal = ({ transaction, onClose }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { 
    reverseTransaction, 
    formatCurrency,
    getTransactionTypeLabel 
  } = useWallet();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      await reverseTransaction(transaction.id, description);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao estornar transação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6 shadow-xl">
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Estornar Transação</h2>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <p className="text-sm text-gray-500 mb-2">Detalhes da Transação</p>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Tipo:</span>
            <span className="text-sm">{getTransactionTypeLabel(transaction.type)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Valor:</span>
            <span className="text-sm">{formatCurrency(transaction.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Data:</span>
            <span className="text-sm">{new Date(transaction.created_at).toLocaleString('pt-BR')}</span>
          </div>
          {transaction.description && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Descrição:</span>
              <span className="text-sm">{transaction.description}</span>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Motivo do Estorno (opcional)
            </label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Informe o motivo do estorno..."
            ></textarea>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white bg-danger-600 border border-transparent rounded-md shadow-sm hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processando...' : 'Confirmar Estorno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReverseTransactionModal;