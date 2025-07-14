// src/services/statsService.ts
import { API_BASE_URL } from '../config/apiConfig'; // Importa o BASE_URL consistente

// Defina a interface para os dados que você espera receber do endpoint de stats globais
export interface GlobalStats {
    total_users: number;
    total_unlocked_value: string; // Vem como string do DECIMAL do MySQL
}

const statsService = {
    /**
     * Busca as estatísticas globais do backend (total de usuários, valor total liberado).
     * @returns Promise<GlobalStats>
     */
    getGlobalStats: async (): Promise<GlobalStats> => {
        try {
            // Usa fetch com o API_BASE_URL e o endpoint específico
            const response = await fetch(`${API_BASE_URL}/stats/global`, { // Endpoint ajustado
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include', // Importante para enviar e receber cookies de sessão/autenticação
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData: { message: string } = { message: `HTTP error! Status: ${response.status}.` };
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData.message += ` Response: ${errorText.substring(0, 100)}...`;
                }
                console.error('[FRONTEND] Erro na API (getGlobalStats):', response.status, errorData);
                throw new Error(errorData.message || 'Falha ao buscar estatísticas globais da API.');
            }

            const data: GlobalStats = await response.json(); // Já tipa como GlobalStats
            console.log('[FRONTEND] Dados de estatísticas globais recebidos:', data);
            return data;
        } catch (error) {
            console.error('[FRONTEND] Erro ao buscar estatísticas globais:', error);
            throw error;
        }
    },

    // Você pode adicionar outras funções relacionadas a estatísticas aqui no futuro
};

export default statsService;