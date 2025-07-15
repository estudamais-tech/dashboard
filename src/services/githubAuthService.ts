// src/services/githubAuthService.ts

import { API_BASE_URL } from '../config/apiConfig';

// Define the User interface based on what your backend returns
// This should match the 'user' object structure in your backend's checkAuth and exchangeGitHubCode responses
interface User {
    id: number;
    name: string | null;
    avatar_url: string | null; // AJUSTE: Permite que avatar_url seja null
    github_login: string;
    email: string | null;
    onboarding_complete: boolean;
    course?: string | null;
    currentSemester?: number | null;
    totalSemesters?: number | null;
    areasOfInterest?: string[] | null; // Assuming this is parsed into an array by your backend
    totalEconomy?: string; // Comes as string from DECIMAL
    redeemedBenefits?: any[] | null; // Assuming this is parsed into an array by your backend
    // Add any other user-related fields returned by your backend
}

// Define the expected response structure from the backend's /github-auth/exchange-code endpoint
interface AuthResponse {
    message: string;
    user: User;
    // The 'token' itself is likely set as an HttpOnly cookie,
    // so it might not be explicitly returned in the JSON body.
    // If your backend *does* return it in the body, you can add:
    // token?: string;
}

const githubAuthService = {
    /**
     * Exchanges a GitHub authorization code for user tokens and user data from the backend.
     * @param code The authorization code received from GitHub.
     * @returns A promise that resolves with the backend's AuthResponse (user data, message).
     */
    exchangeCodeForToken: async (code: string): Promise<AuthResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/github-auth/exchange-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ code }),
                credentials: 'include', // Essential for sending and receiving HttpOnly cookies
            });

            // Get the response text first to handle potential non-JSON errors
            const responseText = await response.text();

            if (!response.ok) {
                let errorData: { message: string } = { message: `HTTP error! Status: ${response.status}.` };
                try {
                    // Try to parse error message if it's JSON
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    // If not JSON, use raw text for debugging
                    errorData.message += ` Raw response: ${responseText.substring(0, 100)}...`;
                }
                console.error('[FRONTEND] Backend error exchanging code:', response.status, errorData);
                throw new Error(errorData.message || 'GitHub authentication failed via backend.');
            }

            // Parse the successful response as AuthResponse
            const result: AuthResponse = JSON.parse(responseText);
            console.log('githubAuthService: Backend user data received:', result.user); // NOVO LOG
            return result;

        } catch (error) {
            console.error('[FRONTEND] Communication error with backend for GitHub auth:', error);
            throw new Error('Failed to communicate with the authentication server.');
        }
    },
};

export default githubAuthService;
