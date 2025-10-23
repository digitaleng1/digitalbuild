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
        } finally {
            removeSession();
            showNotification({
                message: 'You have been logged out successfully',
                type: 'success',
            });
            navigate('/account/login');
        }
    };

    return { logout };
};
