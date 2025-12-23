import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const API_URL = '/api'; // Use relative path for proxy to work

const client = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for handling cookies/sessions if needed
});

// Request interceptor (Optional: can be used for logging or other headers)
client.interceptors.request.use(
    (config) => {
        // No need to add Authorization header manually with cookies
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors (e.g., 401 Unauthorized)
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., redirect to login, clear token)
            useAuthStore.getState().logout();
            // Optional: Redirect to login page if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;
