import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <Link to="/">
              <span className="text-2xl font-bold text-primary-600">Carteira Financeira</span>
            </Link>
          </div>
          
          {user ? (
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <span>Olá, {user.name.split(' ')[0]}</span>
                <svg
                  className={`ml-2 h-5 w-5 text-gray-400 ${isMenuOpen ? 'transform rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              {isMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/wallet"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Minha Carteira
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                to="/login"
                className="inline-block bg-primary-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-90"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="inline-block ml-4 py-2 px-4 border border-transparent rounded-md text-base font-medium text-primary-600 hover:bg-gray-50"
              >
                Registrar
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;