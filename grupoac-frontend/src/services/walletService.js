import api from './api';

/**
 * Serviço para operações de carteira financeira
 */
class WalletService {
  /**
   * Obtém saldo atual da carteira
   * @returns {Promise} Promessa com informações do saldo
   */
  async getBalance() {
    const response = await api.get('/wallet/balance');
    return response.data;
  }

  /**
   * Realiza depósito na carteira
   * @param {Object} depositData - Dados do depósito
   * @param {number} depositData.amount - Valor do depósito
   * @param {string} [depositData.description] - Descrição do depósito (opcional)
   * @returns {Promise} Promessa com detalhes da transação
   */
  async deposit(depositData) {
    const response = await api.post('/wallet/deposit', depositData);
    return response.data;
  }

  /**
   * Realiza transferência para outra carteira
   * @param {Object} transferData - Dados da transferência
   * @param {string} transferData.receiver_account - Número da conta do destinatário
   * @param {number} transferData.amount - Valor da transferência
   * @param {string} [transferData.description] - Descrição da transferência (opcional)
   * @returns {Promise} Promessa com detalhes das transações
   */
  async transfer(transferData) {
    const response = await api.post('/wallet/transfer', transferData);
    return response.data;
  }

  /**
   * Obtém histórico de transações da carteira
   * @param {number} [page=1] - Número da página para paginação
   * @returns {Promise} Promessa com lista de transações
   */
  async getTransactions(page = 1) {
    const response = await api.get(`/wallet/transactions`, {
      params: { page }
    });
    return response.data;
  }

  /**
   * Reverte uma transação
   * @param {number} transactionId - ID da transação a ser revertida
   * @param {string} [description] - Descrição da reversão (opcional)
   * @returns {Promise} Promessa com detalhes da reversão
   */
  async reverseTransaction(transactionId, description) {
    const response = await api.post(`/wallet/transactions/${transactionId}/reverse`, { description });
    return response.data;
  }

  /**
   * Formata um valor monetário para exibição
   * @param {number} value - Valor a ser formatado
   * @returns {string} Valor formatado como moeda (R$)
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Traduz o tipo de transação para português
   * @param {string} type - Tipo de transação
   * @returns {string} Descrição em português
   */
  translateTransactionType(type) {
    const types = {
      'deposit': 'Depósito',
      'withdrawal': 'Saque',
      'transfer_in': 'Transferência Recebida',
      'transfer_out': 'Transferência Enviada',
      'reversal': 'Estorno'
    };
    
    return types[type] || type;
  }

  /**
   * Determina a classe CSS com base no tipo de transação
   * @param {string} type - Tipo de transação
   * @returns {string} Nome da classe CSS
   */
  getTransactionColorClass(type) {
    switch (type) {
      case 'deposit':
      case 'transfer_in':
        return 'text-success-600';
      case 'withdrawal':
      case 'transfer_out':
        return 'text-danger-600';
      case 'reversal':
        return 'text-warning-600';
      default:
        return 'text-secondary-600';
    }
  }
}

export default new WalletService();