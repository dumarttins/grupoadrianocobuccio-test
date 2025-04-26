import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white py-4 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-2 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Carteira Financeira - Grupo Adriano Cobuccio
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-primary-600">
              Termos de Uso
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary-600">
              Privacidade
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-primary-600">
              Ajuda
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;