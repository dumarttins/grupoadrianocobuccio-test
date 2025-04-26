import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  const { signed } = useAuth();

  // Se já estiver autenticado, redireciona para o dashboard
  if (signed) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-primary-600">
          Carteira Financeira
        </h1>
        <h2 className="mt-2 text-center text-xl text-gray-600">
          Faça login para acessar sua conta
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;