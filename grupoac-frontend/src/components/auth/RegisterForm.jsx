import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Formatação de CPF: 000.000.000-00
  const formatCPF = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length <= 3) {
      return cleanValue;
    }
    if (cleanValue.length <= 6) {
      return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3)}`;
    }
    if (cleanValue.length <= 9) {
      return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6)}`;
    }
    
    return `${cleanValue.slice(0, 3)}.${cleanValue.slice(3, 6)}.${cleanValue.slice(6, 9)}-${cleanValue.slice(9, 11)}`;
  };

  const handleCPFChange = (e) => {
    const value = e.target.value;
    setCpf(formatCPF(value));
  };

  const validateForm = () => {
    if (!name || !email || !cpf || !password || !passwordConfirmation) {
      setError('Por favor, preencha todos os campos');
      return false;
    }
    
    if (cpf.replace(/\D/g, '').length !== 11) {
      setError('CPF inválido');
      return false;
    }
    
    if (password !== passwordConfirmation) {
      setError('As senhas não conferem');
      return false;
    }
    
    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
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
      
      await signUp({
        name,
        email,
        cpf,
        password,
        password_confirmation: passwordConfirmation
      });
      
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.errors) {
        // Formatar erros de validação
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(', '));
      } else {
        setError(err.response?.data?.message || 'Erro ao registrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Criar Conta</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nome Completo
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Nome Completo"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="seu@email.com"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cpf">
            CPF
          </label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={handleCPFChange}
            maxLength={14}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="000.000.000-00"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="********"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password_confirmation">
            Confirmar Senha
          </label>
          <input
            id="password_confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="********"
            required
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Criando conta...' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;