import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

import githubAuthService from '../services/githubAuthService';

export interface User {
    id: number;
    name: string | null;
    avatar_url: string;
    github_login: string;
    email?: string | null;
    onboarding_complete: boolean | number;
    course?: string | null;
    currentSemester?: number | null;
    totalSemesters?: number | null;
    areasOfInterest?: string[] | null;
    points?: number;
    level?: number;
    totalEconomy?: string;
    totalPossibleBenefits?: number;
    redeemedBenefits?: any[] | null;
    has_seen_confetti: boolean;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoadingAuth: boolean;
    login: (user: User) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    exchangeCodeAndLogin: (code: string) => Promise<void>;
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

    const publicRoutes = ['/', '/privacy-policy'];

    const clearAuthState = useCallback(() => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('user');
    }, []);

    const checkAuthStatus = useCallback(async () => {
        setIsLoadingAuth(true);
        try {
            const data = await githubAuthService.checkAuthStatus();

            if (data.isAuthenticated && data.user) {
                setIsAuthenticated(true);
                setUser(data.user as User);
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                clearAuthState();
            }
        } catch (error) {
            console.error('Erro durante a verificação de autenticação via service:', error);
            clearAuthState();
        } finally {
            setIsLoadingAuth(false);
        }
    }, [clearAuthState]);

    const login = useCallback(async (userData: User) => {
        if (userData && userData.id) {
            setIsAuthenticated(true);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            await new Promise(resolve => setTimeout(resolve, 50));

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
    }, [clearAuthState, toast]);

    const logout = useCallback(async () => {
        try {
            await githubAuthService.logoutUser();
            toast({
                title: "Logout realizado",
                description: "Você foi desconectado(a).",
                variant: "success",
            });
        } catch (error) {
            console.error('Erro ao fazer logout via service:', error);
            toast({
                title: "Erro de Conexão",
                description: "Não foi possível conectar ao servidor para logout.",
                variant: "destructive",
            });
        } finally {
            clearAuthState();
            navigate('/');
        }
    }, [clearAuthState, navigate, toast]);

    const exchangeCodeAndLogin = useCallback(async (code: string) => {
        setIsLoadingAuth(true);
        try {
            const data = await githubAuthService.exchangeCodeForToken(code);
            if (data && data.user) {
                await login(data.user);
            } else {
                toast({
                    title: "Autenticação GitHub falhou",
                    description: "Não foi possível obter os dados do usuário após a troca do código.",
                    variant: "destructive",
                });
                clearAuthState();
            }
        } catch (error) {
            console.error('Error exchanging GitHub code and logging in:', error);
            toast({
                title: "Erro de autenticação",
                description: "Não foi possível processar o código do GitHub. Tente novamente.",
                variant: "destructive",
            });
            clearAuthState();
        } finally {
            setIsLoadingAuth(false);
        }
    }, [login, toast, clearAuthState]);

    useEffect(() => {
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
        checkAuthStatus();
    }, [checkAuthStatus, clearAuthState]);

    useEffect(() => {
        if (!isLoadingAuth) {
            const currentPath = location.pathname;

            if (isAuthenticated) {
                const isOnboardingComplete = user?.onboarding_complete === true || user?.onboarding_complete === 1;

                if (user && !isOnboardingComplete && currentPath !== '/onboarding') {
                    navigate('/onboarding');
                }
                else if (user && isOnboardingComplete && (publicRoutes.includes(currentPath) || currentPath === '/onboarding')) {
                    navigate('/dashboard');
                }
            } else {
                if (!publicRoutes.includes(currentPath)) {
                    navigate('/');
                }
            }
        }
    }, [isAuthenticated, isLoadingAuth, user, location.pathname, navigate, publicRoutes]);

    const contextValue: AuthContextType = {
        isAuthenticated,
        user,
        isLoadingAuth,
        login,
        logout,
        checkAuthStatus,
        exchangeCodeAndLogin,
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
