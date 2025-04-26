import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useNavigate } from 'react-router-dom';

const TransferForm = () => {
  const [receiverAccount, setReceiverAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { transfer, getBalance, wallet, formatCurrency } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    getBalance();
  }, [getBalance]);

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

  // Formatação para conta
  const formatAccountNumber = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.slice(0, 10);
  };

  const handleAccountChange = (e) => {
    const value = e.target.value;
    setReceiverAccount(formatAccountNumber(value));
  };

  const validateForm = () => {
    if (!receiverAccount || receiverAccount.length !== 10) {
      setError('Por favor, informe um número de conta válido (10 dígitos)');
      return false;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Por favor, informe um valor válido para transferência');
      return false;
    }
    
    if (wallet && parseFloat(amount) > wallet.balance) {
      setError('Saldo insuficiente para realizar esta transferência');
      return false;
    }
    
    if (wallet && receiverAccount === wallet.account_number) {
      setError('Não é possível transferir para a própria conta');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await transfer(receiverAccount, parseFloat(amount), description);
      
      setSuccess(`Transferência de ${formatCurrency(parseFloat(amount))} realizada com sucesso!`);
      setReceiverAccount('');
      setAmount('');
      setDescription('');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/wallet');
      }, 2000);
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao processar transferência');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-secondary-700 mb-4">Realizar Transferência</h2>
      
      {/* Saldo disponível */}
      <div className="bg-gray-50 p-3 rounded-md mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Saldo Disponível:</span>
          <span className="text-base font-semibold text-primary-700">
            {wallet ? formatCurrency(wallet.balance) : 'Carregando...'}
          </span>
        </div>
      </div>
      
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="receiverAccount">
            Conta do Destinatário
          </label>
          <input
            id="receiverAccount"
            type="text"
            value={receiverAccount}
            onChange={handleAccountChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Número da conta (10 dígitos)"
            maxLength={10}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
            Valor da Transferência
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
            placeholder="Ex: Pagamento de serviço"
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
            {loading ? 'Processando...' : 'Transferir'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;