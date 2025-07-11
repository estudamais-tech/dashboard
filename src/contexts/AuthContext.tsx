import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"; // ADICIONADO: Import do hook useToast

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [githubLogin, setGithubLogin] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast(); // ADICIONADO: Inicialização do hook de toast

  // Função para limpar o estado local e redirecionar
  const clearAuthState = useCallback(() => {
    setIsAuthenticated(false);
    setUserName(null);
    setUserAvatar(null);
    setGithubLogin(null);
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('githubLogin');
    console.log('AuthContext: Estado local e localStorage limpos.');
  }, []);

  // Função interna para verificar o status de autenticação no backend
  const checkAuthStatus = useCallback(async () => {
    setIsLoadingAuth(true); 
    console.log('AuthContext: Verificando status de autenticação no backend...');
    console.log('AuthContext: Cookies visíveis no frontend (não HttpOnly):', document.cookie); // Para depuração

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
          setIsAuthenticated(true);
          // Atualiza localStorage com dados do backend para garantir consistência
          localStorage.setItem('userName', data.user.name);
          localStorage.setItem('userAvatar', data.user.avatar_url);
          localStorage.setItem('githubLogin', data.user.github_login);
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
  }, [clearAuthState]);

  // Função de login: Agora aceita os dados do usuário diretamente.
  const login = useCallback(async (userData) => { // Tornar assíncrona para await checkAuthStatus
    console.log('AuthContext: Função login chamada com dados:', userData);
    if (userData && userData.name && userData.avatar_url && userData.github_login) {
      setUserName(userData.name);
      setUserAvatar(userData.avatar_url);
      setGithubLogin(userData.github_login);
      setIsAuthenticated(true);
      
      // Salvar no localStorage imediatamente
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userAvatar', userData.avatar_url);
      localStorage.setItem('githubLogin', userData.github_login);
      console.log('AuthContext: Dados salvos no localStorage. Verificando cookie...');

      // Pequeno atraso para dar tempo ao navegador de processar o Set-Cookie
      await new Promise(resolve => setTimeout(resolve, 100)); 
      await checkAuthStatus(); // Força uma nova verificação do cookie
      
      // ADICIONADO: Toast de sucesso no login
      toast({
        title: "Login bem-sucedido!",
        description: `Bem-vindo(a), ${userData.name}.`,
          variant: "success", 
      });

    } else {
      console.error('AuthContext: Tentativa de login com dados de usuário inválidos.', userData);
      clearAuthState();
      // ADICIONADO: Toast de falha no login
      toast({
        title: "Falha no Login",
        description: "Não foi possível autenticar. Dados inválidos.",
        variant: "destructive",
      });
    }
    // setIsLoadingAuth(false); // Movido para finally de checkAuthStatus
  }, [clearAuthState, checkAuthStatus, toast]); // ADICIONADO 'toast' às dependências

  // Função de logout: faz requisição ao backend e limpa estado local
  const logout = useCallback(async () => { // Transformado em useCallback
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
        // ADICIONADO: Toast de sucesso no logout
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado(a).",
          variant: "success", 
        });
      } else {
        console.error('AuthContext: Erro ao fazer logout no backend:', response.status, response.statusText);
        // ADICIONADO: Toast de erro no logout via backend
        toast({
          title: "Erro ao fazer logout",
          description: "Não foi possível desconectar completamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('AuthContext: Erro de rede durante o logout:', error);
      // ADICIONADO: Toast de erro de rede no logout
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
  }, [clearAuthState, navigate, toast]); // ADICIONADO 'toast' às dependências

  // Efeito para verificar o estado de autenticação na montagem inicial do AuthProvider
  useEffect(() => {
    console.log('AuthContext: Executando useEffect inicial para checkAuthStatus.');
    checkAuthStatus();
  }, [checkAuthStatus]); 

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, userAvatar, githubLogin, isLoadingAuth, login, logout, setIsLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// correto