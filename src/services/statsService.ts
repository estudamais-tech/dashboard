import { API_BASE_URL } from '../config/apiConfig';
import { handleApiResponse } from '../utils/apiErrorHandler'; // Assuming this utility exists

export interface GlobalStats {
  total_usuarios: number;
  total_unlocked_value: string;
  total_beneficios_ativos?: number; // Added back, was in original GlobalStats
  total_economia_geral?: string; // Added back, was in original GlobalStats
  total_trilhas_iniciadas?: number; // Added back, was in original GlobalStats
  total_trilhas_concluidas?: number; // Added back, was in original GlobalStats
  updated_at?: string; // Added back, was in original GlobalStats
}

const statsService = {
  getGlobalStats: async (): Promise<GlobalStats> => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats/global`, {
        credentials: 'include',
      });

      return await handleApiResponse(response); // Use handleApiResponse
    } catch (error) {
      console.error('Stats Service Error:', error);
      throw error;
    }
  },
};

export default statsService; // Default export
