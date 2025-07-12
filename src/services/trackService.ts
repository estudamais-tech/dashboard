// src/services/trackService.ts
import { API_BASE_URL } from '../config/apiConfig';

interface Track {
    id: string;
    title: string;
    description: string;
    icon: string;
    path: string;
    rewardValue: number;
    status: 'available' | 'in-progress' | 'completed';
}

const trackService = {
    async getTracksForUser(): Promise<Track[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/user/tracks`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    const textError = await response.text();
                    errorData = { message: `HTTP error! Status: ${response.status}. Response: ${textError.substring(0, 100)}...` };
                }
                console.error('Erro na API ao buscar trilhas:', response.status, errorData);
                throw new Error(errorData.message || 'Falha ao buscar as trilhas da API.');
            }

            const data: Track[] = await response.json();

            const parsedData = data.map(track => ({
                ...track,
                rewardValue: typeof track.rewardValue === 'string' ? parseFloat(track.rewardValue) : track.rewardValue,
            }));

            console.log('Trilhas recebidas do backend e parseadas:', parsedData);
            return parsedData;
        } catch (error) {
            console.error('Erro em getTracksForUser:', error);
            throw error;
        }
    },

    async startTrackAndUnlockReward(trackId: string, rewardAmount: number): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/user/track/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ trackId, rewardAmount }),
                credentials: 'include',
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    const textError = await response.text();
                    errorData = { message: `HTTP error! Status: ${response.status}. Response: ${textError.substring(0, 100)}...` };
                }
                console.error('Erro na API ao iniciar trilha e desbloquear recompensa:', response.status, errorData);
                throw new Error(errorData.message || 'Falha ao iniciar trilha e desbloquear recompensa.');
            }

            const data = await response.json();
            console.log('Resposta do backend ao iniciar trilha e desbloquear recompensa:', data);
            return data;
        } catch (error) {
            console.error('Erro em startTrackAndUnlockReward:', error);
            throw error;
        }
    },

    // --- NOVA FUNÇÃO: Marcar uma Trilha como Completa ---
    async completeTrack(trackId: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/user/track/complete`, { // Novo endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ trackId }),
                credentials: 'include',
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    const textError = await response.text();
                    errorData = { message: `HTTP error! Status: ${response.status}. Response: ${textError.substring(0, 100)}...` };
                }
                console.error('Erro na API ao marcar trilha como completa:', response.status, errorData);
                throw new Error(errorData.message || 'Falha ao marcar trilha como completa na API.');
            }

            const data = await response.json();
            console.log('Resposta do backend ao marcar trilha como completa:', data);
            return data;
        } catch (error) {
            console.error('Erro em completeTrack:', error);
            throw error;
        }
    },
};

export default trackService;