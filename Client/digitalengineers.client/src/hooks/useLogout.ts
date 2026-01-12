import { useNavigate } from 'react-router';
import { useAuthContext } from '@/common/context/useAuthContext';
import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';

export const useLogout = () => {
    const navigate = useNavigate();
    const { removeSession } = useAuthContext();
    const { showNotification } = useNotificationContext();

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout API call failed:', error);
        }

        // Clear Auth0 SSO session if SDK is available
        try {
            if (typeof window.auth0 !== 'undefined') {
                const domain = import.meta.env.VITE_AUTH0_DOMAIN;
                const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

                if (domain && clientId) {
                    const auth0Client = await window.auth0.createAuth0Client({
                        domain,
                        clientId,
                        authorizationParams: {
                            redirect_uri: `${window.location.origin}/callback`,
                        },
                    });

                    // Logout from Auth0 without redirect (just clear session)
                    await auth0Client.logout({ openUrl: false });
                }
            }
        } catch (auth0Error) {
            console.error('Auth0 logout failed:', auth0Error);
        }

        removeSession();
        showNotification({
            message: 'You have been logged out successfully',
            type: 'success',
        });
        
        // Force redirect to main page (bypass React Router)
        window.location.href = '/main';
    };

    return { logout };
};
