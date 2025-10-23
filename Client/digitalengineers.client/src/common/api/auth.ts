import { httpClient } from './interceptors';
import type {
    RegisterDto,
    LoginDto,
    TokenResponse,
    ExternalLoginDto,
    RefreshTokenDto,
} from '@/types/auth.types';

function AuthService() {
    return {
        register: (data: RegisterDto) => {
            return httpClient.post<TokenResponse>('/api/auth/register', data);
        },

        login: (data: LoginDto) => {
            return httpClient.post<TokenResponse>('/api/auth/login', data);
        },

        refreshToken: (data: RefreshTokenDto) => {
            return httpClient.post<TokenResponse>('/api/auth/refresh-token', data);
        },

        externalLogin: (data: ExternalLoginDto) => {
            return httpClient.post<TokenResponse>('/api/auth/external-login', data);
        },

        revokeToken: () => {
            return httpClient.post('/api/auth/revoke-token', {});
        },

        logout: () => {
            return httpClient.post('/api/auth/revoke-token', {});
        },
    };
}

export default AuthService();
