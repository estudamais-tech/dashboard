import { API_BASE_URL } from '../config/apiConfig';
import { handleApiResponse } from '../utils/apiErrorHandler';

export interface User {
    id: number;
    github_login: string;
    name: string | null;
    email: string | null;
    avatar_url: string | null;
    github_status?: string;
    benefits_activated: number;
    course: string | null;
    currentSemester: number | null;
    totalSemesters: number | null;
    areasOfInterest: string[] | null;
    totalEconomy: string;
    redeemedBenefits: string[] | null;
    onboarding_complete: number;
    totalSaved?: number;
    totalPossibleBenefits?: number;
    has_seen_confetti: boolean;
}

interface CountResponse {
    total_users?: number;
    github_users_count?: number;
    active_benefits_count?: number;
    pending_students_count?: number;
}

interface OnboardingResponse {
    message: string;
}

interface BenefitUpdateResponse {
    message: string;
}

const userService = {
    async getTotalUsersCount(): Promise<number> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/count`);
            const data: CountResponse = await handleApiResponse(response);
            if (typeof data.total_users === 'number') {
                return data.total_users;
            } else {
                throw new Error('Unexpected data format for total users count: total_users is missing or not a number.');
            }
        } catch (error) {
            console.error('Error in getTotalUsersCount service:', error);
            throw error;
        }
    },

    async getGithubUsersCount(): Promise<number> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/github-count`);
            const data: CountResponse = await handleApiResponse(response);
            if (typeof data.github_users_count === 'number') {
                return data.github_users_count;
            } else {
                throw new Error('Unexpected data format for GitHub users count: github_users_count is missing or not a number.');
            }
        } catch (error) {
            console.error('Error in getGithubUsersCount service:', error);
            throw error;
        }
    },

    async getAllStudents(): Promise<User[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            const data: { students?: User[] } | User[] = await handleApiResponse(response);
            if (data && Array.isArray((data as { students: User[] }).students)) {
                return (data as { students: User[] }).students;
            } else if (Array.isArray(data)) {
                return data;
            } else {
                console.error('Unexpected response format for getAllStudents:', data);
                throw new Error('Unexpected student data format from backend.');
            }
        } catch (error) {
            console.error('Error in getAllStudents service:', error);
            throw error;
        }
    },

    async getStudentsWithActiveBenefitsCount(): Promise<number> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/active-benefits-count`);
            const data: CountResponse = await handleApiResponse(response);
            if (typeof data.active_benefits_count === 'number') {
                return data.active_benefits_count;
            } else {
                throw new Error('Unexpected data format for active benefits count: active_benefits_count is missing or not a number.');
            }
        } catch (error) {
            console.error('Error in getStudentsWithActiveBenefitsCount service:', error);
            throw error;
        }
    },

    async getPendingStudentsCount(): Promise<number> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/pending-github-count`);
            const data: CountResponse = await handleApiResponse(response);
            if (typeof data.pending_students_count === 'number') {
                return data.pending_students_count;
            } else {
                throw new Error('Unexpected data format for pending students count: pending_students_count is missing or not a number.');
            }
        } catch (error) {
            console.error('Error in getPendingStudentsCount service:', error);
            throw error;
        }
    },

    async saveOnboardingData(onboardingData: { course: string; currentSemester: number; totalSemesters: number; areasOfInterest: string[]; }): Promise<OnboardingResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/onboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(onboardingData),
                credentials: 'include',
            });

            const data: OnboardingResponse = await handleApiResponse(response);
            return data;
        } catch (error) {
            console.error('Error in saveOnboardingData service:', error);
            throw error;
        }
    },

    async getStudentDashboardData(): Promise<User> {
        try {
            const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include',
            });
            const data: User = await handleApiResponse(response);
            return data;
        } catch (error) {
            console.error('Error in getStudentDashboardData service:', error);
            throw error;
        }
    },

    async updateBenefitStatus(productId: string, isRedeemed: boolean, monthlyValueUSD: number, monthsRemaining: number): Promise<BenefitUpdateResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/student/benefits/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ isRedeemed, monthlyValueUSD, monthsRemaining }),
                credentials: 'include',
            });

            const data: BenefitUpdateResponse = await handleApiResponse(response);
            return data;
        } catch (error) {
            console.error('Error in updateBenefitStatus service:', error);
            throw error;
        }
    },

    async markConfettiAsSeen(userId: number): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/confetti-seen`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ has_seen_confetti: true })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to mark confetti as seen');
            }
        } catch (error) {
            console.error('Error marking confetti as seen:', error);
            throw error;
        }
    },
};

export default userService;
