import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenService } from '@/services/tokenService';
import type { TokenResponse, RefreshTokenDto } from '@/types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const httpClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

httpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenService.getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return httpClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = tokenService.getRefreshToken();
            const accessToken = tokenService.getAccessToken();

            if (!refreshToken || !accessToken) {
                tokenService.clearTokens();
                localStorage.removeItem('_ACTIVE_USER');
                window.location.href = '/account/login';
                return Promise.reject(error);
            }

            try {
                const payload: RefreshTokenDto = {
                    accessToken,
                    refreshToken,
                };

                const { data } = await axios.post<TokenResponse>(
                    `${API_BASE_URL}/api/auth/refresh-token`,
                    payload
                );

                tokenService.setTokens(data.accessToken, data.refreshToken, data.expiresAt);
                
                const userSession = localStorage.getItem('_ACTIVE_USER');
                if (userSession) {
                    const user = JSON.parse(userSession);
                    user.accessToken = data.accessToken;
                    user.refreshToken = data.refreshToken;
                    user.expiresAt = data.expiresAt;
                    localStorage.setItem('_ACTIVE_USER', JSON.stringify(user));
                }
                
                processQueue(null, data.accessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                }

                return httpClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as AxiosError, null);
                tokenService.clearTokens();
                localStorage.removeItem('_ACTIVE_USER');
                window.location.href = '/account/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
