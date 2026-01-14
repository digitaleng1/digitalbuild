import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuthContext } from '@/common/context/useAuthContext';
import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import { useNavigate } from 'react-router';
import UserNotFoundModal from './UserNotFoundModal';
import type { ApiErrorResponse } from '@/types/auth.types';

const Auth0LoginButton = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [showUserNotFoundModal, setShowUserNotFoundModal] = useState(false);
    const { saveSession } = useAuthContext();
    const { showNotification } = useNotificationContext();
    const navigate = useNavigate();

    const handleAuth0Login = async () => {
        setLoading(true);
        try {
            if (typeof window.auth0 === 'undefined') {
                throw new Error('Auth0 SDK not loaded. Please refresh the page.');
            }

            const domain = import.meta.env.VITE_AUTH0_DOMAIN;
            const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

            if (!domain || !clientId) {
                throw new Error('Auth0 configuration missing. Please contact support.');
            }

            const auth0Client = await window.auth0.createAuth0Client({
                domain,
                clientId,
                authorizationParams: {
                    redirect_uri: `${window.location.origin}/callback`,
                    scope: 'openid profile email',
                },
            });

            await auth0Client.loginWithPopup({ authorizationParams: { prompt: 'login' } });

            const idTokenClaims = await auth0Client.getIdTokenClaims();
            if (!idTokenClaims?.__raw) {
                throw new Error('Failed to get ID token from Auth0');
            }

            try {
                const tokenResponse = await authApi.externalLogin({
                    provider: 'Auth0',
                    idToken: idTokenClaims.__raw,
                    isRegistration: false,
                });

                saveSession(
                    tokenResponse.user,
                    tokenResponse.accessToken,
                    tokenResponse.refreshToken,
                    tokenResponse.expiresAt
                );

                showNotification({
                    message: t('Successfully logged in with Auth0'),
                    type: 'success',
                });

                const primaryRole = tokenResponse.user.roles[0];
                const redirectPath = primaryRole === 'Provider' 
                    ? '/specialist/projects' 
                    : primaryRole === 'Admin' || primaryRole === 'SuperAdmin'
                        ? '/admin/projects'
                        : '/client/projects';
                navigate(redirectPath);
            } catch (apiError: unknown) {
                const axiosError = apiError as { response?: { data?: ApiErrorResponse } };
                
                if (axiosError.response?.data?.type === 'UserNotFound') {
                    setShowUserNotFoundModal(true);
                    return;
                }

                const errorMessage = axiosError.response?.data?.message || t('Login failed. Please try again.');
                showNotification({ message: errorMessage, type: 'error' });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                if ('error' in error) {
                    const auth0Error = error as { error: string; error_description?: string };
                    if (auth0Error.error === 'access_denied') {
                        return;
                    }
                    
                    let errorMessage = t('Auth0 login failed');
                    if (auth0Error.error === 'consent_required') {
                        errorMessage = t('Please grant permission to access your profile');
                    } else if (auth0Error.error === 'login_required') {
                        errorMessage = t('Please log in to continue');
                    } else if (auth0Error.error_description) {
                        errorMessage = auth0Error.error_description;
                    }
                    
                    showNotification({ message: errorMessage, type: 'error' });
                } else if (error.message) {
                    showNotification({ message: error.message, type: 'error' });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outline-secondary"
                className="w-100 mb-2"
                onClick={handleAuth0Login}
                disabled={loading}
            >
                <i className="mdi mdi-shield-lock-outline me-2"></i>
                {loading ? t('Loading...') : t('Sign in with Auth0')}
            </Button>

            <UserNotFoundModal 
                show={showUserNotFoundModal}
                onHide={() => setShowUserNotFoundModal(false)}
            />
        </>
    );
};

export default Auth0LoginButton;
