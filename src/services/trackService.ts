import { API_BASE_URL } from '../config/apiConfig';
import { handleApiResponse } from '../utils/apiErrorHandler';

export interface Track {
    id: string;
    title: string;
    description: string;
    icon_name: string;
    path: string;
    reward_value: number;
    status: 'available' | 'in-progress' | 'completed';
    started_at?: string;
    completed_at?: string;
}

// Nova interface para os detalhes do usuário retornados junto com as trilhas
interface UserDetailsForTracks {
    github_login: string;
    name: string | null;
    avatar_url: string | null;
}

// Nova interface para o formato de resposta da API de trilhas
interface GetTracksResponse {
    user: UserDetailsForTracks;
    tracks: Track[];
}

// Interface para as atividades recentes globais (reutilizando a de Dashboard.tsx para consistência)
interface GlobalRecentActivity {
    id: string;
    user: string;
    avatar_url?: string | null;
    action: string;
    value: number;
    timestamp: number;
    type: 'track_start' | 'track_complete';
    trackTitle: string;
}

const trackService = {
    async getTracksForUser(): Promise<GetTracksResponse> { // Atualizado o tipo de retorno
        try {
            const response = await fetch(`${API_BASE_URL}/user/tracks`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            const data: GetTracksResponse = await handleApiResponse(response); // Espera a nova estrutura

            const validStatuses = ['available', 'in-progress', 'completed'];

            // Certifica-se de que as trilhas dentro da resposta estão no formato correto
            const parsedTracks: Track[] = data.tracks.map(track => ({
                id: track.id,
                title: track.title,
                description: track.description,
                icon_name: track.icon_name,
                path: track.path,
                reward_value: typeof track.reward_value === 'string'
                    ? parseFloat(track.reward_value)
                    : (track.reward_value ?? 0),
                status: (validStatuses.includes(track.status as string)
                    ? track.status
                    : 'available') as 'available' | 'in-progress' | 'completed',
                started_at: track.started_at || undefined,
                completed_at: track.completed_at || undefined,
            }));

            console.log('Tracks received from backend and parsed (trackService):', { user: data.user, tracks: parsedTracks });
            return { user: data.user, tracks: parsedTracks }; // Retorna a nova estrutura
        } catch (error) {
            console.error('Error in getTracksForUser service:', error);
            throw error;
        }
    },

    async startTrackAndUnlockReward(trackId: string, rewardAmount?: number): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/user/tracks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ trackId, rewardAmount }),
                credentials: 'include',
            });

            const data = await handleApiResponse(response);
            console.log('Backend response for starting track and unlocking reward:', data);
            return data;
        } catch (error) {
            console.error('Error in startTrackAndUnlockReward service:', error);
            throw error;
        }
    },

    async completeTrackAndUnlockReward(trackId: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/user/tracks/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ trackId }),
                credentials: 'include',
            });

            const data = await handleApiResponse(response);
            console.log('Backend response for completing track and unlocking reward:', data);
            return data;
        } catch (error) {
            console.error('Error in completeTrackAndUnlockReward service:', error);
            throw error;
        }
    },

    /**
     * Removes user's progress for a specific track
     * @param trackId The ID of the track to remove progress for
     */
    async removeTrackProgress(trackId: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/user/tracks/${trackId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            const data = await handleApiResponse(response);
            console.log('Backend response for removing track progress:', data);
            return data;
        } catch (error) {
            console.error('Error in removeTrackProgress service:', error);
            throw error;
        }
    },

    // NOVA FUNÇÃO: Obter atividades recentes globais
    async getGlobalRecentActivities(): Promise<GlobalRecentActivity[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/tracks/global-activities`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // Esta rota pode não precisar de credenciais se for pública
                // credentials: 'include', 
            });

            const data: GlobalRecentActivity[] = await handleApiResponse(response);
            console.log('Global recent activities received from backend (trackService):', data);
            return data;
        } catch (error) {
            console.error('Error in getGlobalRecentActivities service:', error);
            throw error;
        }
    },
};

export default trackService;
