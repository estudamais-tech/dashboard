// src/utils/apiErrorHandler.ts
export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorText = await response.text();
        let errorData: { message: string } = { message: `HTTP error! Status: ${response.status}.` };
        try {
            errorData = JSON.parse(errorText);
        } catch (e) {
            errorData.message += ` Raw response: ${errorText.substring(0, 100)}...`;
        }
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    return await response.json();
}
