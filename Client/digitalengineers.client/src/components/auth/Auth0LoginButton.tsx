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
        auth0?: any;
    }
}

const Auth0LoginButton = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const { saveSession } = useAuthContext();
    const { showNotification } = useNotificationContext();
    const navigate = useNavigate();

    const handleAuth0Login = async () => {
        setLoading(true);
        try {
            if (!window.auth0) {
                throw new Error('Auth0 SDK not loaded');
            }

            const auth0Client = await window.auth0.createAuth0Client({
                domain: import.meta.env.VITE_AUTH0_DOMAIN,
                clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
                authorizationParams: {
                    redirect_uri: window.location.origin,
                },
            });

            await auth0Client.loginWithPopup();

            const idToken = await auth0Client.getIdTokenClaims();

            const result = await authApi.externalLogin({
                provider: 'Auth0',
                idToken: idToken.__raw,
            });

            const tokenResponse: TokenResponse = result.data;

            saveSession(
                tokenResponse.user,
                tokenResponse.accessToken,
                tokenResponse.refreshToken,
                tokenResponse.expiresAt
            );

            showNotification({
                message: 'Successfully logged in with Auth0',
                type: 'success',
            });

            const primaryRole = tokenResponse.user.roles[0];
            const redirectPath = primaryRole === 'Provider' 
                ? '/specialist/dashboard' 
                : '/client/dashboard';
            navigate(redirectPath);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Auth0 login failed';
            showNotification({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline-secondary"
            className="w-100 mb-2"
            onClick={handleAuth0Login}
            disabled={loading}
        >
            <i className="mdi mdi-shield-lock-outline me-2"></i>
            {loading ? t('Loading...') : t('Sign in with Auth0')}
        </Button>
    );
};

export default Auth0LoginButton;
