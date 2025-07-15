// src/services/userService.ts
import { API_BASE_URL } from '../config/apiConfig';
import { handleApiResponse } from '../utils/apiErrorHandler'; // Correct import for the utility function

export interface User {
    id: number;
    github_login: string;
    name: string | null;
    email: string | null;
    avatar_url: string | null; // AJUSTE: Permite que avatar_url seja null
    github_status: string;
    benefits_activated: number;
    course: string | null;
    currentSemester: number | null;
    totalSemesters: number | null;
    areasOfInterest: string[] | null; // Allow null as it can come as null from backend
    totalEconomy: string; // Backend sends this as a string
    redeemedBenefits: string[] | null; // Allow null as it can come as null from backend
    onboarding_complete: number; // Assuming 0 or 1
    // Add these properties to match what you set in studentData state
    totalSaved: number; // Calculated and stored as a number in frontend state
    totalPossibleBenefits: number; // Calculated and stored as a number in frontend state
}


// Define the interface for the count responses
interface CountResponse {
    total_users?: number;
    github_users_count?: number;
    active_benefits_count?: number;
    pending_students_count?: number;
    // Add any other count properties your backend might return
}

// Define the interface for the onboarding response if known
interface OnboardingResponse {
    message: string;
    // Add other properties if the backend returns them after onboarding
}

// Define the interface for the benefit update response if known
interface BenefitUpdateResponse {
    message: string;
    // Add other properties if the backend returns them after updating a benefit
}


const userService = {
    /**
     * Fetches the total count of all users.
     */
    async getTotalUsersCount(): Promise<number> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/count`);
            // Use handleApiResponse and explicitly type the expected data
            const data: CountResponse = await handleApiResponse(response);
            console.log('Total user count received:', data.total_users);
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

    /**
     * Fetches the count of users with linked GitHub accounts.
     */
    async getGithubUsersCount(): Promise<number> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/github-count`);
            const data: CountResponse = await handleApiResponse(response);
            console.log('GitHub user count received:', data.github_users_count);
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

    /**
     * Fetches a complete list of students.
     * Assumes backend returns an array of User objects, possibly wrapped in { students: User[] }.
     */
    async getAllStudents(): Promise<User[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            // The handleApiResponse<T> will infer T as { students?: User[] } | User[] based on usage
            const data: { students?: User[] } | User[] = await handleApiResponse(response);
            console.log('Raw student list received:', data);

            if (data && Array.isArray((data as { students: User[] }).students)) {
                console.log('Extracted student list from "students" property:', (data as { students: User[] }).students);
                return (data as { students: User[] }).students;
            } else if (Array.isArray(data)) {
                console.log('Backend returned array directly:', data);
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

    /**
     * Fetches the count of students with active benefits.
     */
    async getStudentsWithActiveBenefitsCount(): Promise<number> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/active-benefits-count`);
            const data: CountResponse = await handleApiResponse(response);
            console.log('Count of students with active benefits received:', data.active_benefits_count);
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

    /**
     * Fetches the count of students with pending GitHub status.
     */
    async getPendingStudentsCount(): Promise<number> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/pending-github-count`); // Corrected double await
            const data: CountResponse = await handleApiResponse(response);
            console.log('Pending students count received:', data.pending_students_count);
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

    /**
     * Sends onboarding data for a student to the backend.
     */
     async saveOnboardingData(onboardingData: { course: string; currentSemester: number; totalSemesters: number; areasOfInterest: string[]; }): Promise<OnboardingResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/onboard`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(onboardingData), // Dados enviados aqui
                credentials: 'include',
            });

            const data: OnboardingResponse = await handleApiResponse(response);
            console.log('Onboarding data saved successfully:', data);
            return data;
        } catch (error) {
            console.error('Error in saveOnboardingData service:', error);
            throw error;
        }
    },


    /**
     * Fetches specific dashboard data for the logged-in student.
     * Assumes backend returns a User object or a subset of it.
     */
    async getStudentDashboardData(): Promise<User> {
        try {
            const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include',
            });
            const data: User = await handleApiResponse(response); // Cast to User interface
            console.log('userService: Student dashboard data received:', data); // LOG EXISTENTE
            return data;
        } catch (error) {
            console.error('Error in getStudentDashboardData service:', error);
            throw error;
        }
    },

    /**
     * Updates the redemption status of a benefit for the logged-in student.
     * @param productId The ID of the benefit.
     * @param isRedeemed Boolean indicating if the benefit is redeemed.
     * @param monthlyValueUSD Monthly value of the benefit in USD.
     * @param monthsRemaining Number of months remaining for the benefit.
     */
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
            console.log('Benefit status updated successfully:', data);
            return data;
        } catch (error) {
            console.error('Error in updateBenefitStatus service:', error);
            throw error;
        }
    },
};

export default userService;
