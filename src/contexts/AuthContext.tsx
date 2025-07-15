import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

// Define a User interface consistente com o que seu backend retorna
interface User {
    id: number;
    name: string | null;
    avatar_url: string;
    github_login: string;
    email: string | null;
    onboarding_complete: boolean;
    course?: string | null;
    currentSemester?: number | null;
    totalSemesters?: number | null;
    areasOfInterest?: string[] | null;
    totalEconomy?: string;
    redeemedBenefits?: any[] | null;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoadingAuth: boolean;
    login: (user: User) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
    const navigate = useNavigate();
    const { toast } = useToast();
    const location = useLocation();

    // Rotas que não exigem autenticação (constante, não muda entre renders)
    const publicRoutes = ['/', '/privacy-policy'];

    const clearAuthState = useCallback(() => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
    }, []); // Dependências vazias: esta função é estável

    const checkAuthStatus = useCallback(async () => {
        setIsLoadingAuth(true); // Inicia o loading
        try {
            const response = await fetch('http://localhost:3001/api/check-auth', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.isAuthenticated && data.user) {
                    setIsAuthenticated(true);
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                } else {
                    // Se o backend disser que não está autenticado, limpa o estado
                    clearAuthState();
                }
            } else if (response.status === 401) {
                // Se receber 401, significa que o token é inválido/ausente
                clearAuthState();
            } else {
                // Outros erros HTTP
                console.error("Auth check failed with status:", response.status);
                clearAuthState();
            }
        } catch (error) {
            // Erros de rede ou outros erros durante a requisição
            console.error('Erro durante a verificação de autenticação:', error);
            clearAuthState();
        } finally {
            setIsLoadingAuth(false); // Finaliza o loading
        }
    }, [clearAuthState]); // checkAuthStatus depende apenas de clearAuthState, que é estável

    const login = useCallback(async (userData: User) => {
        if (userData && userData.id) {
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            // Pequeno atraso para garantir que o cookie HttpOnly seja processado pelo navegador
            // antes de re-verificar o status.
            await new Promise(resolve => setTimeout(resolve, 50));
            // Apenas re-checa o status para garantir consistência com o backend e atualizar o user object
            // A navegação será tratada pelo useEffect abaixo.
            await checkAuthStatus(); 

            toast({
                title: "Login bem-sucedido!",
                description: `Bem-vindo(a), ${userData.name || userData.github_login}.`,
                variant: "success",
            });
        } else {
            clearAuthState();
            toast({
                title: "Falha no Login",
                description: "Não foi possível autenticar. Dados de usuário inválidos.",
                variant: "destructive",
            });
        }
    }, [clearAuthState, checkAuthStatus, toast]); // checkAuthStatus é uma dependência estável

    const logout = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3001/api/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                toast({
                    title: "Logout realizado",
                    description: "Você foi desconectado(a).",
                    variant: "success",
                });
            } else {
                toast({
                    title: "Erro ao fazer logout",
                    description: "Não foi possível desconectar completamente.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Erro de Conexão",
                description: "Não foi possível conectar ao servidor para logout.",
                variant: "destructive",
            });
        } finally {
            clearAuthState();
            navigate('/'); // Navega para a home após o logout
        }
    }, [clearAuthState, navigate, toast]);

    // Efeito para a verificação inicial de autenticação ao carregar o provedor
    useEffect(() => {
        // Tenta carregar o usuário do localStorage primeiro
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                clearAuthState();
            }
        }
        // Sempre faz a verificação com o backend para validar o cookie
        checkAuthStatus();
    }, [checkAuthStatus, clearAuthState]); // checkAuthStatus e clearAuthState são estáveis

    // NOVO EFEITO: Lógica de navegação baseada no status de autenticação e onboarding
    useEffect(() => {
        // Só age se não estiver carregando a autenticação
        if (!isLoadingAuth) {
            const currentPath = location.pathname;

            if (isAuthenticated) {
                // Se autenticado e onboarding não completo, e não está na tela de onboarding, navega
                if (user && !user.onboarding_complete && currentPath !== '/onboarding') {
                    navigate('/onboarding');
                }
                // Se autenticado e onboarding completo, e está em uma rota pública ou onboarding, navega para dashboard
                else if (user && user.onboarding_complete && (publicRoutes.includes(currentPath) || currentPath === '/onboarding')) {
                    navigate('/dashboard');
                }
                // Caso contrário (autenticado, onboarding completo, e já em uma rota privada correta), não faz nada
            } else {
                // Se não autenticado e a rota atual NÃO é pública, redireciona para a home
                if (!publicRoutes.includes(currentPath)) {
                    navigate('/');
                }
            }
        }
    }, [isAuthenticated, isLoadingAuth, user, location.pathname, navigate, publicRoutes]); // Dependências controladas

    const contextValue: AuthContextType = {
        isAuthenticated,
        user,
        isLoadingAuth,
        login,
        logout,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
