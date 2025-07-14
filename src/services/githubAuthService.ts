// src/services/githubAuthService.ts
// Make sure this file is actually named 'githubAuthService.ts' in your file system.

import { API_BASE_URL } from '../config/apiConfig';

const githubAuthService = {
    /**
     * Exchanges a GitHub authorization code for user tokens and potentially user data.
     * @param code The authorization code received from GitHub.
     * @returns A promise that resolves with the backend response (e.g., user data, tokens).
     */
    exchangeCodeForToken: async (code: string): Promise<any> => { // These type annotations are valid in a .ts file
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
                let errorData: { message: string } = { message: `HTTP error! Status: ${response.status}.` };
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    errorData.message += ` Raw response: ${responseText.substring(0, 100)}...`;
                }
                console.error('Backend error exchanging code:', response.status, errorData);
                throw new Error(errorData.message || 'GitHub authentication failed via backend.');
            }

            const result = JSON.parse(responseText);
            return result;

        } catch (error) {
            console.error('Communication error with backend for GitHub auth:', error);
            throw new Error('Failed to communicate with the authentication server.');
        }
    },
};

export default githubAuthService;