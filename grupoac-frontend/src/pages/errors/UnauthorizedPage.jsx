import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-danger-600">401</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Acesso não autorizado</h2>
        <p className="mt-2 text-base text-gray-600">
          Você não tem permissão para acessar esta página.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;