import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import { useAuthContext } from '@/common/context/useAuthContext';
import type { RegisterDto, TokenResponse } from '@/types/auth.types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import * as yup from 'yup';

export default function useRegister() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();

	const { saveSession } = useAuthContext();
	const { showNotification } = useNotificationContext();

	const schema = yup.object().shape({
		firstName: yup.string().optional(),
		lastName: yup.string().optional(),
		email: yup.string().email('Please enter valid email').required(t('Please enter email')),
		password: yup
			.string()
			.required(t('Please enter password'))
			.min(8, 'Password must be at least 8 characters')
			.matches(/[a-z]/, 'Password must contain at least one lowercase letter')
			.matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.matches(/[0-9]/, 'Password must contain at least one digit')
			.matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref('password')], 'Passwords must match')
			.required('Please confirm password'),
	});

	const register = async (data: any, role: 'Client' | 'Provider') => {
		setLoading(true);
		try {
			const payload: RegisterDto = {
				email: data.email,
				password: data.password,
				confirmPassword: data.confirmPassword,
				firstName: data.firstName,
				lastName: data.lastName,
				role,
			};

			const tokenResponse: TokenResponse = await authApi.register(payload);

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

			const redirectPath = role === 'Provider' ? '/provider/dashboard' : '/client/dashboard';
			navigate(redirectPath);
		} catch (e: any) {
			const errorMessage = e.response?.data?.message || e.message || 'Registration failed';
			showNotification({ message: errorMessage, type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return { loading, register, schema };
}
