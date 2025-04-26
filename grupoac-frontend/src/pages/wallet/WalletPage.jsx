import React from 'react';
import { Link } from 'react-router-dom';
import BalanceCard from '../../components/wallet/BalanceCard';
import TransactionList from '../../components/wallet/TransactionList';

const WalletPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Minha Carteira</h1>
        
        <div className="flex space-x-4">
          <Link
            to="/deposit"
            className="py-2 px-4 bg-success-500 hover:bg-success-600 text-white rounded-md"
          >
            Depositar
          </Link>
          <Link
            to="/transfer"
            className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
          >
            Transferir
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BalanceCard />
        </div>
        
        <div className="md:col-span-2">
          <TransactionList />
        </div>
      </div>
    </div>
  );
};

export default WalletPage;