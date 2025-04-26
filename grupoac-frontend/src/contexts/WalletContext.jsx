import React, { createContext, useState, useCallback } from 'react';
import walletService from '../services/walletService';

export const WalletContext = createContext({});

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletService.getBalance();
      setWallet(response.wallet);
      return response.wallet;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar saldo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deposit = useCallback(async (amount, description) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletService.deposit({ amount, description });
      setWallet(prev => ({ ...prev, balance: response.new_balance }));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar depósito');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const transfer = useCallback(async (receiverAccount, amount, description) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletService.transfer({ 
        receiver_account: receiverAccount, 
        amount, 
        description 
      });
      setWallet(prev => ({ ...prev, balance: response.new_balance }));
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar transferência');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactions = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletService.getTransactions(page);
      setTransactions(response.transactions.data);
      setTransactionsPage(response.transactions.current_page);
      setTotalPages(Math.ceil(response.transactions.total / response.transactions.per_page));
      return response.transactions;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao buscar transações');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reverseTransaction = useCallback(async (transactionId, description) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletService.reverseTransaction(transactionId, description);
      setWallet(prev => ({ ...prev, balance: response.new_balance }));
      
      // Atualiza a lista de transações após reversão
      await getTransactions(transactionsPage);
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao reverter transação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getTransactions, transactionsPage]);

  const formatCurrency = useCallback((value) => {
    return walletService.formatCurrency(value);
  }, []);

  const getTransactionTypeLabel = useCallback((type) => {
    return walletService.translateTransactionType(type);
  }, []);

  const getTransactionColorClass = useCallback((type) => {
    return walletService.getTransactionColorClass(type);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        transactionsPage,
        totalPages,
        loading,
        error,
        getBalance,
        deposit,
        transfer,
        getTransactions,
        reverseTransaction,
        formatCurrency,
        getTransactionTypeLabel,
        getTransactionColorClass
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}