import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// 1. Definir a interface para o que o seu contexto de autenticação irá fornecer
interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  userAvatar: string | null;
  githubLogin: string | null;
  userEmail: string | null; // NOVO: Adicionado userEmail à interface
  isLoadingAuth: boolean;
  login: (userData: any) => Promise<void>; // Ajuste 'any' para o tipo real dos dados do usuário se souber
  logout: () => Promise<void>;
  setIsLoadingAuth: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthStatus: () => Promise<void>;
  // Adicione outras propriedades e funções do seu contexto aqui
}

// 2. Crie o contexto com a interface definida e um valor padrão adequado
// Agora exportamos o AuthContext para que outros arquivos possam importá-lo
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [githubLogin, setGithubLogin] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // NOVO: Estado para userEmail
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const clearAuthState = useCallback(() => {
    setIsAuthenticated(false);
    setUserName(null);
    setUserAvatar(null);
    setGithubLogin(null);
    setUserEmail(null); // NOVO: Limpar userEmail
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('githubLogin');
    localStorage.removeItem('userEmail'); // NOVO: Remover userEmail do localStorage
    console.log('AuthContext: Estado local e localStorage limpos.');
  }, []);

  const checkAuthStatus = useCallback(async () => {
    setIsLoadingAuth(true);
    console.log('AuthContext: Verificando status de autenticação no backend...');
    console.log('AuthContext: Cookies visíveis no frontend (não HttpOnly):', document.cookie);

    try {
      const response = await fetch('http://localhost:3001/api/check-auth', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated) {
          console.log('AuthContext: Autenticado pelo backend. Dados do usuário:', data.user.login);
          setUserName(data.user.name);
          setUserAvatar(data.user.avatar_url);
          setGithubLogin(data.user.github_login);
          setUserEmail(data.user.email); // NOVO: Definir userEmail
          setIsAuthenticated(true);

          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('userAvatar', data.user.avatar_url);
          localStorage.setItem('githubLogin', data.user.github_login);
          localStorage.setItem('userEmail', data.user.email); // NOVO: Salvar userEmail no localStorage

          console.log('AuthContext: Received onboarding_complete from backend:', data.user.onboarding_complete);

          if (data.user.onboarding_complete) {
            console.log('AuthContext: Onboarding completo, redirecionando para /dashboard/');
            if (!location.pathname.startsWith('/dashboard/') && !location.pathname.startsWith('/dashboard')) {
              navigate('/dashboard/');
            }
          } else {
            console.log('AuthContext: Onboarding pendente, redirecionando para /onboarding');
            if (location.pathname !== '/onboarding' && location.pathname !== '/') {
              navigate('/onboarding');
            }
          }
        } else {
          console.log('AuthContext: Backend informou que não há autenticação.');
          clearAuthState();
        }
      } else if (response.status === 401) {
        console.log('AuthContext: Não autorizado pelo backend (401). Cookie inválido ou ausente.');
        clearAuthState();
      } else {
        console.error('AuthContext: Erro ao verificar autenticação no backend:', response.status, response.statusText);
        clearAuthState();
      }
    } catch (error) {
      console.error('AuthContext: Erro de rede ao verificar autenticação:', error);
      clearAuthState();
    } finally {
      setIsLoadingAuth(false);
      console.log('AuthContext: checkAuthStatus finalizado. isLoadingAuth = false.');
    }
  }, [clearAuthState, navigate, location.pathname]);

  const login = useCallback(async (userData: any) => { // Ajuste 'any' para o tipo real dos dados do usuário
    console.log('AuthContext: Função login chamada com dados:', userData);
    if (userData && userData.name && userData.avatar_url && userData.github_login) {
      setUserName(userData.name);
      setUserAvatar(userData.avatar_url);
      setGithubLogin(userData.github_login);
      setUserEmail(userData.email); // NOVO: Definir userEmail no login
      setIsAuthenticated(true);

      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userAvatar', userData.avatar_url);
      localStorage.setItem('githubLogin', userData.github_login);
      localStorage.setItem('userEmail', userData.email); // NOVO: Salvar userEmail no localStorage no login
      console.log('AuthContext: Dados salvos no localStorage. Verificando cookie...');

      await new Promise(resolve => setTimeout(resolve, 100));
      await checkAuthStatus();

      toast({
        title: "Login bem-sucedido!",
        description: `Bem-vindo(a), ${userData.name}.`,
        variant: "success",
      });

      if (userData.onboarding_complete) {
        console.log('AuthContext: Onboarding completo após login, redirecionando para /onboarding');
        navigate('/dashboard/');
      } else {
        console.log('AuthContext: Onboarding pendente após login, redirecionando para /onboarding');
        navigate('/onboarding');
      }

    } else {
      console.error('AuthContext: Tentativa de login com dados de usuário inválidos.', userData);
      clearAuthState();
      toast({
        title: "Falha no Login",
        description: "Não foi possível autenticar. Dados inválidos.",
        variant: "destructive",
      });
    }
  }, [clearAuthState, checkAuthStatus, navigate, toast]);

  const logout = useCallback(async () => {
    console.log('AuthContext: Iniciando logout. Notificando backend para limpar cookie.');
    try {
      const response = await fetch('http://localhost:3001/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('AuthContext: Logout bem-sucedido no backend (cookie limpo).');
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado(a).",
          variant: "success",
        });
      } else {
        console.error('AuthContext: Erro ao fazer logout no backend:', response.status, response.statusText);
        toast({
          title: "Erro ao fazer logout",
          description: "Não foi possível desconectar completamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('AuthContext: Erro de rede durante o logout:', error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao servidor para logout.",
        variant: "destructive",
      });
    } finally {
      clearAuthState();
      console.log('AuthContext: Dados locais limpos. Estado de autenticação redefinido.');
      navigate('/');
    }
  }, [clearAuthState, navigate, toast]);

  useEffect(() => {
    console.log('AuthContext: Executando useEffect inicial para checkAuthStatus.');
    checkAuthStatus();
  }, [checkAuthStatus]);

  const contextValue: AuthContextType = { // Garante que o valor do contexto corresponda à interface
    isAuthenticated,
    userName,
    userAvatar,
    githubLogin,
    userEmail, // NOVO: Incluir userEmail no valor do contexto
    isLoadingAuth,
    login,
    logout,
    setIsLoadingAuth,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
