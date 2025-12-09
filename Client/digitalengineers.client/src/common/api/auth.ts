import HttpClient from '../helpers/httpClient';
import type {
    RegisterDto,
    LoginDto,
    TokenResponse,
    ExternalLoginDto,
    RefreshTokenDto,
    ResendEmailConfirmationDto,
    ResetPasswordDto,
} from '@/types/auth.types';

function AuthService() {
    return {
        register: (data: RegisterDto): Promise<TokenResponse> => {
            return HttpClient.post<TokenResponse>('/api/auth/register', data);
        },

        login: (data: LoginDto): Promise<TokenResponse> => {
            return HttpClient.post<TokenResponse>('/api/auth/login', data);
        },

        refreshToken: (data: RefreshTokenDto): Promise<TokenResponse> => {
            return HttpClient.post<TokenResponse>('/api/auth/refresh-token', data);
        },

        externalLogin: (data: ExternalLoginDto): Promise<TokenResponse> => {
            return HttpClient.post<TokenResponse>('/api/auth/external-login', data);
        },

        revokeToken: (): Promise<any> => {
            return HttpClient.post('/api/auth/revoke-token', {});
        },

        logout: (): Promise<any> => {
            return HttpClient.post('/api/auth/revoke-token', {});
        },

        getMyAvatarUrl: (): Promise<{ profilePictureUrl: string | null }> => {
            return HttpClient.get<{ profilePictureUrl: string | null }>('/api/auth/me/avatar');
        },

        confirmEmail: (userId: string, token: string): Promise<TokenResponse> => {
            return HttpClient.get<TokenResponse>(
                `/api/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`
            );
        },

        resendEmailConfirmation: (email: string): Promise<any> => {
            const data: ResendEmailConfirmationDto = { email };
            return HttpClient.post('/api/auth/resend-email-confirmation', data);
        },

        initiatePasswordReset: (): Promise<{ message: string }> => {
            return HttpClient.post<{ message: string }>('/api/auth/initiate-password-reset', {});
        },

        forgotPassword: (email: string): Promise<{ message: string }> => {
            return HttpClient.post<{ message: string }>('/api/auth/forgot-password', { email });
        },

        resetPassword: (dto: ResetPasswordDto): Promise<TokenResponse> => {
            return HttpClient.post<TokenResponse>('/api/auth/reset-password', dto);
        },
    };
}

export default AuthService();
