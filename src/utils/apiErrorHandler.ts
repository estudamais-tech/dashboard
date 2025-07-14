// src/utils/apiErrorHandler.ts
export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.message || `API request failed with status ${response.status}.`);
    }
    return response.json();
}