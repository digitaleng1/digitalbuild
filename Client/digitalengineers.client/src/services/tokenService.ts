const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export const tokenService = {
    getAccessToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    getTokenExpiry(): string | null {
        return localStorage.getItem(TOKEN_EXPIRY_KEY);
    },

    setTokens(accessToken: string, refreshToken: string, expiresAt: string): void {
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt);
    },

    clearTokens(): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
    },

    isTokenExpired(): boolean {
        const expiry = this.getTokenExpiry();
        if (!expiry) return true;
        return new Date(expiry) <= new Date();
    }
};
