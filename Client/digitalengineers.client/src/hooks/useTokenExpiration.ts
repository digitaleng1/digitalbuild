import { useEffect } from 'react';
import { useAuthContext } from '@/common/context/useAuthContext';
import { tokenService } from '@/services/tokenService';
import { useNavigate } from 'react-router';

export const useTokenExpiration = () => {
    const { removeSession, isAuthenticated } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) return;

        const checkTokenExpiration = () => {
            if (tokenService.isTokenExpired()) {
                removeSession();
                navigate('/account/login', { 
                    state: { message: 'Your session has expired. Please login again.' } 
                });
            }
        };

        const interval = setInterval(checkTokenExpiration, 60000);

        checkTokenExpiration();

        return () => clearInterval(interval);
    }, [isAuthenticated, removeSession, navigate]);
};
