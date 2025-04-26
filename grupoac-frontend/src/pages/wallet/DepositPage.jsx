import React from 'react';
import DepositForm from '../../components/wallet/DepositForm';

const DepositPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Realizar Depósito</h1>
      
      <div className="max-w-2xl mx-auto">
        <DepositForm />
      </div>
    </div>
  );
};

export default DepositPage;