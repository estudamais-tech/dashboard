// src/services/githubAuthService.js

/**
 * Troca um código de autorização do GitHub por um token de acesso
 * e dados do usuário, fazendo uma requisição ao seu servidor backend.
 *
 * @param {string} code O código de autorização recebido do GitHub.
 * @returns {Promise<{message: string, user: {name: string, avatar_url: string, github_login: string}}>} Um objeto contendo a mensagem de sucesso e os dados do usuário.
 */
export const exchangeCodeForToken = async (code) => {
  console.log('GitHubAuthService: Iniciando troca de código com o backend.');
  console.log('GitHubAuthService: Código enviado:', code);

  // Certifique-se de que esta URL corresponde à URL do seu backend Node.js
  // e ao endpoint que você configurou para a troca de código.
  const BACKEND_API_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL || 'http://localhost:3001/api';
  console.log('GitHubAuthService: URL do Backend:', `${BACKEND_API_URL}/github-auth/exchange-code`);

  try {
    const response = await fetch(`${BACKEND_API_URL}/github-auth/exchange-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
      credentials: 'include', // Essencial para que o navegador envie e receba cookies HttpOnly
    });

    // Lê a resposta como texto primeiro para depuração, caso não seja JSON válido
    const responseText = await response.text();
    console.log('GitHubAuthService: Resposta bruta do backend (texto):', responseText);

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = JSON.parse(responseText); // Tenta parsear se for JSON
      } catch (e) {
        // Se não for JSON, usa o texto bruto como mensagem de erro
        errorData = { message: responseText || 'Erro desconhecido do backend.' };
      }
      console.error('GitHubAuthService: Erro do backend ao trocar código:', response.status, errorData);
      throw new Error(errorData.message || 'Falha na autenticação com o GitHub via backend.');
    }

    const result = JSON.parse(responseText); // Agora parseia como JSON
    console.log('GitHubAuthService: Dados parseados do backend:', result);
    return result;

  } catch (error) {
    console.error('GitHubAuthService: Erro na comunicação com o backend (catch):', error);
    throw new Error('Falha na comunicação com o servidor de autenticação.');
  }
};
