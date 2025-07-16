import { API_BASE_URL } from '../config/apiConfig';

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

interface AuthResponse {
    message: string;
    user: User;
}

const githubAuthService = {
    exchangeCodeForToken: async (code: string): Promise<AuthResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/github-auth/exchange-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ code }),
                credentials: 'include',
            });

            const responseText = await response.text();

            if (!response.ok) {
                let errorData: { message: string } = { message: `Erro HTTP! Status: ${response.status}.` };
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    errorData.message += ` Resposta bruta: ${responseText.substring(0, 100)}...`;
                }
                console.error('[FRONTEND] Erro do backend ao trocar código:', response.status, errorData);
                throw new Error(errorData.message || 'A autenticação GitHub falhou via backend.');
            }

            const result: AuthResponse = JSON.parse(responseText);
            console.log('githubAuthService: Dados do usuário do backend recebidos:', result.user);
            return result;

        } catch (error) {
            console.error('[FRONTEND] Erro de comunicação com o backend para autenticação GitHub:', error);
            throw new Error('Falha na comunicação com o servidor de autenticação.');
        }
    },

    checkAuthStatus: async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
        try {
            const response = await fetch(`${API_BASE_URL}/check-auth`, {
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                if (data.isAuthenticated === false) {
                    return { isAuthenticated: false };
                }
                if (data.isAuthenticated && data.user) {
                    return { isAuthenticated: true, user: data.user as User };
                }
                return { isAuthenticated: false };
            }

            const result = await response.json();
            return { isAuthenticated: result.isAuthenticated, user: result.user as User };

        } catch (error) {
            console.error('Erro ao verificar status de autenticação:', error);
            return { isAuthenticated: false };
        }
    },

    logoutUser: async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro de Logout no Backend:', errorData.message);
                throw new Error(errorData.message || 'Falha ao fazer logout.');
            }
            console.log('Logout bem-sucedido.');
        } catch (error) {
            console.error('Erro de Logout:', error);
            throw new Error('Falha na comunicação com o servidor para logout.');
        }
    },
};

export default githubAuthService;
