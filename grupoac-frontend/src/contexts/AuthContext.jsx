import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      setLoading(true);
      
      const storedUser = authService.getUser();
      const token = authService.getToken();
      
      if (token && storedUser) {
        setUser(storedUser);
        
        try {
          // Atualiza informações do usuário
          const updatedUser = await authService.getCurrentUser();
          setUser(updatedUser);
        } catch (error) {
          console.error('Erro ao buscar dados atualizados do usuário:', error);
          // Se houver falha, limpa a sessão
          await authService.logout();
          setUser(null);
        }
      }
      
      setLoading(false);
    }

    loadStoredData();
  }, []);

  async function signIn(credentials) {
    const response = await authService.login(credentials);
    setUser(response.user);
    return response;
  }

  async function signUp(userData) {
    const response = await authService.register(userData);
    setUser(response.user);
    return response;
  }

  async function signOut() {
    await authService.logout();
    setUser(null);
  }

  async function updateUserData() {
    try {
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}