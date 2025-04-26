import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useNavigate } from 'react-router-dom';

const DepositForm = () => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { deposit, formatCurrency } = useWallet();
  const navigate = useNavigate();

  // Formatar valor monetário no input
  const formatAmount = (value) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue === '') return '';
    
    const floatValue = parseFloat(numericValue) / 100;
    return floatValue.toFixed(2);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    // Aceitar apenas números e ponto
    if (/^[\d.]*$/.test(value)) {
      setAmount(formatAmount(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Por favor, informe um valor válido para depósito');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await deposit(parseFloat(amount), description);
      
      setSuccess(`Depósito de ${formatCurrency(parseFloat(amount))} realizado com sucesso!`);
      setAmount('');
      setDescription('');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/wallet');
      }, 2000);
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao processar depósito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-secondary-700 mb-4">Realizar Depósito</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Valor do Depósito
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="0,00"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Descrição (opcional)
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: Depósito mensal"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/wallet')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processando...' : 'Depositar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DepositForm;