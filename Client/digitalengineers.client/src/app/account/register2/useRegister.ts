import {authApi} from '@/common/api';
import {useNotificationContext} from '@/common/context';
import {useAuthContext} from '@/common/context/useAuthContext';
import type {RegisterDto, TokenResponse} from '@/types/auth.types';
import * as yup from 'yup';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from "react-router";

type RegisterFormData = {
    email: string;
    firstName?: string;
    lastName?: string;
    password: string;
    confirmPassword: string;
};

export default function useRegister() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {t} = useTranslation();

    const {isAuthenticated, saveSession} = useAuthContext();
    const {showNotification} = useNotificationContext();

    const schema = yup.object().shape({
        firstName: yup.string(),
        lastName: yup.string(),
        email: yup.string().email('Please enter valid email').required(t('Please enter email')),
        password: yup
            .string()
            .required(t('Please enter password'))
            .min(8, 'Password is too short - should be 8 chars minimum')
            .matches(/[a-zA-Z]/, 'Password can only contain latin letters'),
        confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
    });

    const register = async (data: RegisterFormData, role: 'Client' | 'Provider') => {
        setLoading(true);
        try {
            const registerDto: RegisterDto = {
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                role: role
            };

            const tokenResponse: TokenResponse = await authApi.register(registerDto);

            // Check if email confirmation is required
            if (!tokenResponse.accessToken) {
                // Email confirmation required
                showNotification({
                    message: 'Registration successful! Please check your email to confirm your account.',
                    type: 'success',
                });
                navigate(`/account/confirm-mail?email=${encodeURIComponent(data.email)}`);
            } else {
                // Auto-login successful
                saveSession(
                    tokenResponse.user,
                    tokenResponse.accessToken,
                    tokenResponse.refreshToken,
                    tokenResponse.expiresAt
                );

                showNotification({
                    message: 'Registration successful. Welcome aboard!',
                    type: 'success',
                });

                // Redirect based on role
                const redirectPath = role === 'Provider' ? '/specialist/projects' : '/client/projects';
                navigate(redirectPath);
            }
        } catch (e: any) {
            showNotification({message: e.toString(), type: 'error'});
        } finally {
            setLoading(false);
        }
    };

    return {loading, register, isAuthenticated, schema};
}
