export interface RegisterDto {
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
    role: 'Client' | 'Provider';
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: UserDto;
}

export interface UserDto {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
}

export interface RefreshTokenDto {
    accessToken: string;
    refreshToken: string;
}

export interface ExternalLoginDto {
    provider: 'Google' | 'Auth0';
    idToken: string;
}

export interface ApiErrorResponse {
    message: string;
}
