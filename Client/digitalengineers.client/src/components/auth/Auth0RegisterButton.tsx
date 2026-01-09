import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuthContext } from '@/common/context/useAuthContext';
import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import { useNavigate } from 'react-router';
import RoleSelectionModal from './RoleSelectionModal';

const Auth0RegisterButton = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const { saveSession } = useAuthContext();
    const { showNotification } = useNotificationContext();
    const navigate = useNavigate();

    const handleClick = () => {
        setShowRoleModal(true);
    };

    const handleRoleConfirm = async (role: 'Client' | 'Provider') => {
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

            await auth0Client.loginWithPopup();

            const idTokenClaims = await auth0Client.getIdTokenClaims();
            if (!idTokenClaims?.__raw) {
                throw new Error('Failed to get ID token from Auth0');
            }

            const tokenResponse = await authApi.externalLogin({
                provider: 'Auth0',
                idToken: idTokenClaims.__raw,
                role: role,
            });

            saveSession(
                tokenResponse.user,
                tokenResponse.accessToken,
                tokenResponse.refreshToken,
                tokenResponse.expiresAt
            );

            setShowRoleModal(false);

            showNotification({
                message: t('Successfully registered with Auth0'),
                type: 'success',
            });

            const primaryRole = tokenResponse.user.roles[0];
            const redirectPath = primaryRole === 'Provider'
                ? '/specialist/projects'
                : primaryRole === 'Admin' || primaryRole === 'SuperAdmin'
                    ? '/admin/projects'
                    : '/client/projects';
            navigate(redirectPath);
        } catch (error: unknown) {
            let errorMessage = t('Auth0 registration failed');

            if (error instanceof Error) {
                if ('error' in error) {
                    const auth0Error = error as { error: string; error_description?: string };
                    if (auth0Error.error === 'consent_required') {
                        errorMessage = t('Please grant permission to access your profile');
                    } else if (auth0Error.error === 'login_required') {
                        errorMessage = t('Please log in to continue');
                    } else if (auth0Error.error === 'access_denied') {
                        errorMessage = t('Access denied. Please try again.');
                    } else if (auth0Error.error_description) {
                        errorMessage = auth0Error.error_description;
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
            }

            const axiosError = error as { response?: { data?: { message?: string } } };
            if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            }

            showNotification({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                variant="outline-secondary"
                className="w-100 mb-2"
                onClick={handleClick}
                disabled={loading}
            >
                <i className="mdi mdi-shield-lock-outline me-2"></i>
                {t('Sign up with Auth0')}
            </Button>

            <RoleSelectionModal
                show={showRoleModal}
                onHide={() => setShowRoleModal(false)}
                onConfirm={handleRoleConfirm}
                loading={loading}
            />
        </>
    );
};

export default Auth0RegisterButton;
