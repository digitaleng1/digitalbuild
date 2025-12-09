import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuthContext } from '@/common/context/useAuthContext';
import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import { useNavigate } from 'react-router';
import type { TokenResponse } from '@/types/auth.types';

declare global {
    interface Window {
        google?: any;
    }
}

const GoogleLoginButton = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { saveSession } = useAuthContext();
    const { showNotification } = useNotificationContext();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            if (!window.google) {
                throw new Error('Google SDK not loaded');
            }

            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                scope: 'email profile',
                callback: async (response: any) => {
                    try {
                        const tokenResponse = await authApi.externalLogin({
                            provider: 'Google',
                            idToken: response.access_token,
                        });

                        saveSession(
                            tokenResponse.user,
                            tokenResponse.accessToken,
                            tokenResponse.refreshToken,
                            tokenResponse.expiresAt
                        );

                        showNotification({
                            message: 'Successfully logged in with Google',
                            type: 'success',
                        });

                        const primaryRole = tokenResponse.user.roles[0];
                        const redirectPath = primaryRole === 'Provider' 
                            ? '/specialist/dashboard' 
                            : '/client/dashboard';
                        navigate(redirectPath);
                    } catch (error: any) {
                        const errorMessage = error.response?.data?.message || error.message || 'Google login failed';
                        showNotification({ message: errorMessage, type: 'error' });
                    } finally {
                        setLoading(false);
                    }
                },
            });

            client.requestAccessToken();
        } catch (error: any) {
            showNotification({ message: error.message, type: 'error' });
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline-primary"
            className="w-100 mb-2"
            onClick={handleGoogleLogin}
            disabled={loading}
        >
            <i className="mdi mdi-google me-2"></i>
            {loading ? t('Loading...') : t('Sign in with Google')}
        </Button>
    );
};

export default GoogleLoginButton;
