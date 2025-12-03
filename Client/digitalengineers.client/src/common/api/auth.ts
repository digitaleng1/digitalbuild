import { httpClient } from './interceptors';
import type {
    RegisterDto,
    LoginDto,
    TokenResponse,
    ExternalLoginDto,
    RefreshTokenDto,
    ResendEmailConfirmationDto,
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

        getMyAvatarUrl: () => {
            return httpClient.get<{ profilePictureUrl: string | null }>('/api/auth/me/avatar');
        },

        confirmEmail: (userId: string, token: string) => {
            return httpClient.get<TokenResponse>(
                `/api/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`
            );
        },

        resendEmailConfirmation: (email: string) => {
            const data: ResendEmailConfirmationDto = { email };
            return httpClient.post('/api/auth/resend-email-confirmation', data);
        },
    };
}

export default AuthService();
