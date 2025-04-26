import React from 'react';
import TransferForm from '../../components/wallet/TransferForm';

const TransferPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Realizar Transferência</h1>
      
      <div className="max-w-2xl mx-auto">
        <TransferForm />
      </div>
    </div>
  );
};

export default TransferPage;