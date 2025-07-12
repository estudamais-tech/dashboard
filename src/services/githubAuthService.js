import { API_BASE_URL } from '../config/apiConfig';

const githubAuthService = {
  exchangeCodeForToken: async (code) => {
    const backendApiUrl = API_BASE_URL;

    try {
      const response = await fetch(`${backendApiUrl}/github-auth/exchange-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
        credentials: 'include',
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText || 'Erro desconhecido do backend.' };
        }
        console.error('Erro do backend ao trocar código:', response.status, errorData);
        throw new Error(errorData.message || 'Falha na autenticação com o GitHub via backend.');
      }

      const result = JSON.parse(responseText);
      return result;

    } catch (error) {
      console.error('Erro na comunicação com o backend:', error);
      throw new Error('Falha na comunicação com o servidor de autenticação.');
    }
  },
};

export default githubAuthService;