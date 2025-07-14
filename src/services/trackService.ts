// src/services/trackService.ts
import { API_BASE_URL } from '../config/apiConfig';

// Refined Track interface based on your schema
export interface Track {
    id: string; // From your backend `tracks` table
    title: string;
    description: string;
    icon_name: string; // Matches 'icon_name' from backend table
    path: string;
    reward_value: number; // Matches 'reward_value' from backend table
    // These status properties would come from the `user_tracks` table
    status: 'available' | 'in-progress' | 'completed'; // Make 'status' mandatory and strictly typed
    started_at?: string; // Optional, only if user has started it
    completed_at?: string; // Optional, only if user has completed it
}

const trackService = {
    /**
     * Fetches all tracks relevant to the authenticated user, including their status.
     */
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
                const errorText = await response.text(); // Get raw text for better debugging
                let errorData: { message: string } = { message: `HTTP error! Status: ${response.status}.` };
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData.message += ` Response: ${errorText.substring(0, 100)}...`;
                }
                console.error('API Error (getTracksForUser):', response.status, errorData);
                throw new Error(errorData.message || 'Failed to fetch tracks from API.');
            }

            const data: any[] = await response.json(); // Use 'any[]' initially to be flexible with backend response

            // Define valid statuses
            const validStatuses = ['available', 'in-progress', 'completed'];

            const parsedData: Track[] = data.map(track => ({
                id: track.id,
                title: track.title,
                description: track.description,
                icon_name: track.icon_name,
                path: track.path,
                reward_value: typeof track.reward_value === 'string'
                    ? parseFloat(track.reward_value)
                    : (track.reward_value ?? 0), // Use nullish coalescing to default to 0
                // Ensure status is one of the valid types, default to 'available' if not.
                status: (validStatuses.includes(track.status as string)
                    ? track.status
                    : 'available') as 'available' | 'in-progress' | 'completed',
                started_at: track.started_at || undefined, // Ensure undefined if null/empty string
                completed_at: track.completed_at || undefined, // Ensure undefined if null/empty string
            }));

            console.log('Tracks received from backend and parsed (trackService):', parsedData);
            return parsedData;
        } catch (error) {
            console.error('Error in getTracksForUser service:', error);
            throw error;
        }
    },

    /**
     * Marks a track as 'in-progress' for the user and optionally unlocks a reward.
     * @param trackId The ID of the track to start.
     * @param rewardAmount The amount of reward associated with this track. (Optional, as per backend logic)
     */
    async startTrackAndUnlockReward(trackId: string, rewardAmount?: number): Promise<any> { // rewardAmount is now optional
        try {
            const response = await fetch(`${API_BASE_URL}/user/tracks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ trackId, rewardAmount }), // Send rewardAmount if provided
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData: { message: string } = { message: `HTTP error! Status: ${response.status}.` };
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData.message += ` Response: ${errorText.substring(0, 100)}...`;
                }
                console.error('API Error (startTrackAndUnlockReward):', response.status, errorData);
                throw new Error(errorData.message || 'Failed to start track and unlock reward.');
            }

            const data = await response.json();
            console.log('Backend response for starting track and unlocking reward:', data);
            return data;
        } catch (error) {
            console.error('Error in startTrackAndUnlockReward service:', error);
            throw error;
        }
    },

    /**
     * Marks a track as 'completed' for the user.
     * @param trackId The ID of the track to complete.
     */
    async completeTrackAndUnlockReward(trackId: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/user/tracks/complete`, { // Assuming this is the correct endpoint for completion
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ trackId }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData: { message: string } = { message: `HTTP error! Status: ${response.status}.` };
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData.message += ` Response: ${errorText.substring(0, 100)}...`;
                }
                console.error('API Error (completeTrackAndUnlockReward):', response.status, errorData);
                throw new Error(errorData.message || 'Failed to mark track as complete.');
            }

            const data = await response.json();
            console.log('Backend response for marking track as complete:', data);
            return data;
        } catch (error) {
            console.error('Error in completeTrackAndUnlockReward service:', error);
            throw error;
        }
    },

    /**
     * Removes the progress of a specific track for the authenticated user.
     * @param trackId The ID of the track whose progress should be removed.
     */
    async removeTrackProgress(trackId: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/user/tracks/${trackId}`, {
                method: 'DELETE', // Using DELETE method for removal
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorData: { message: string } = { message: `HTTP error! Status: ${response.status}.` };
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData.message += ` Response: ${errorText.substring(0, 100)}...`;
                }
                console.error('API Error (removeTrackProgress):', response.status, errorData);
                throw new Error(errorData.message || 'Failed to remove track progress.');
            }

            // For a DELETE request, the response body might be empty or a simple success message
            // We'll try to parse it as JSON, but handle cases where it's not.
            let data = {};
            try {
                data = await response.json();
            } catch (e) {
                console.warn('No JSON response for DELETE /user/tracks/:trackId, assuming success.');
            }

            console.log('Backend response for removing track progress:', data);
            return data;
        } catch (error) {
            console.error('Error in removeTrackProgress service:', error);
            throw error;
        }
    },
};

export default trackService;