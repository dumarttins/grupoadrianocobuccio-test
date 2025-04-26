import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Páginas de Autenticação
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Páginas da Aplicação
import DashboardPage from './pages/dashboard/DashboardPage';
import WalletPage from './pages/wallet/WalletPage';
import DepositPage from './pages/wallet/DepositPage';
import TransferPage from './pages/wallet/TransferPage';

// Páginas de Erro
import NotFoundPage from './pages/errors/NotFoundPage';
import UnauthorizedPage from './pages/errors/UnauthorizedPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota inicial - redireciona para o dashboard ou login */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      {/* Rotas de Autenticação */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Rotas Protegidas (dentro do MainLayout) */}
      <Route path="/" element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/transfer" element={<TransferPage />} />
      </Route>
      
      {/* Rota de 404 - Não Encontrado */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;