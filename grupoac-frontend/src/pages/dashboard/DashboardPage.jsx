import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWallet } from '../../hooks/useWallet';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

// Registrar componentes do ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const DashboardPage = () => {
  const { user } = useAuth();
  const { wallet, transactions, getBalance, getTransactions, formatCurrency } = useWallet();
  const [transactionStats, setTransactionStats] = useState({
    deposits: 0,
    transfersIn: 0,
    transfersOut: 0,
    reversals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getBalance();
        await getTransactions();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getBalance, getTransactions]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const stats = transactions.reduce(
        (acc, transaction) => {
          switch (transaction.type) {
            case 'deposit':
              acc.deposits += transaction.amount;
              break;
            case 'transfer_in':
              acc.transfersIn += transaction.amount;
              break;
            case 'transfer_out':
              acc.transfersOut += transaction.amount;
              break;
            case 'reversal':
              acc.reversals += transaction.amount;
              break;
            default:
              break;
          }
          return acc;
        },
        { deposits: 0, transfersIn: 0, transfersOut: 0, reversals: 0 }
      );
      
      setTransactionStats(stats);
    }
  }, [transactions]);

  // Dados para o gráfico de transações
  const transactionChartData = {
    labels: ['Depósitos', 'Recebimentos', 'Envios', 'Estornos'],
    datasets: [
      {
        label: 'Valor',
        data: [
          transactionStats.deposits,
          transactionStats.transfersIn,
          transactionStats.transfersOut,
          transactionStats.reversals,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',  // verde
          'rgba(14, 165, 233, 0.7)',  // azul
          'rgba(239, 68, 68, 0.7)',   // vermelho
          'rgba(245, 158, 11, 0.7)',  // âmbar
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Preparar dados para o gráfico de linha (últimas 5 transações)
  const getLineChartData = () => {
    if (!transactions || transactions.length === 0) return null;
    
    const lastTransactions = [...transactions].slice(0, 5).reverse();
    
    return {
      labels: lastTransactions.map(t => new Date(t.created_at).toLocaleDateString('pt-BR')),
      datasets: [
        {
          label: 'Saldo após transação',
          data: lastTransactions.map(t => t.new_balance),
          fill: false,
          borderColor: 'rgb(14, 165, 233)',
          tension: 0.1
        }
      ]
    };
  };

  const lineChartData = getLineChartData();

  // Opções para o gráfico de linha
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolução do Saldo'
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Card de Boas-vindas e Saldo */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Olá, {user?.name}</h2>
              <p className="text-gray-600 mb-4">Bem-vindo(a) à sua área financeira.</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base text-gray-600">Seu Saldo Atual:</span>
                  <span className="text-2xl font-bold text-primary-700">
                    {wallet ? formatCurrency(wallet.balance) : 'Carregando...'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Número da Conta:</span>
                  <span className="font-medium">{wallet?.account_number || '-'}</span>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <Link
                  to="/deposit"
                  className="flex-1 py-2 px-4 bg-success-500 hover:bg-success-600 text-white rounded-md text-center"
                >
                  Depositar
                </Link>
                <Link
                  to="/transfer"
                  className="flex-1 py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-center"
                >
                  Transferir
                </Link>
              </div>
            </div>
            
            {/* Gráfico de Transações */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Distribuição de Transações</h2>
              <div className="h-64 flex items-center justify-center">
                {transactions && transactions.length > 0 ? (
                  <Doughnut data={transactionChartData} />
                ) : (
                  <p className="text-gray-500">Nenhuma transação encontrada</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Gráfico de Evolução do Saldo */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Evolução do Saldo</h2>
            <div className="h-64">
              {lineChartData ? (
                <Line data={lineChartData} options={lineOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Dados insuficientes para gerar o gráfico</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Últimas Transações */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Últimas Transações</h2>
              <Link to="/wallet" className="text-primary-600 hover:text-primary-700 text-sm">
                Ver todas
              </Link>
            </div>
            
            {transactions && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 
                              transaction.type === 'transfer_in' ? 'bg-blue-100 text-blue-800' : 
                              transaction.type === 'transfer_out' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {transaction.type === 'deposit' ? 'Depósito' : 
                             transaction.type === 'transfer_in' ? 'Recebido' : 
                             transaction.type === 'transfer_out' ? 'Enviado' : 'Estorno'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right 
                          ${transaction.type === 'deposit' || transaction.type === 'transfer_in' ? 'text-green-600' : 'text-red-600'}">
                          {formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">Nenhuma transação encontrada</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;