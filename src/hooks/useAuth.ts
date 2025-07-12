// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Ajuste este caminho para o seu AuthContext real

/**
 * Hook personalizado para acessar o contexto de autenticação.
 * Retorna o estado de autenticação (isAuthenticated, isLoadingAuth)
 * e funções relacionadas à autenticação (se existirem no seu contexto).
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
