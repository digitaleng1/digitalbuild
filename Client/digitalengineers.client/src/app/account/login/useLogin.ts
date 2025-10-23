import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import { useState } from 'react';
import { useAuthContext } from '@/common/context/useAuthContext';
import { useQuery } from '@/hooks';
import type { LoginDto, TokenResponse } from '@/types/auth.types';
import * as yup from 'yup';
import { useNavigate } from 'react-router';

export const loginFormSchema = yup.object({
	email: yup.string().email('Please enter valid email').required('Please enter email'),
	password: yup.string().required('Please enter password'),
});

export type LoginFormFields = yup.InferType<typeof loginFormSchema>;

export default function useLogin() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const { saveSession } = useAuthContext();
	const { showNotification } = useNotificationContext();

	const queryParams = useQuery();

	const login = async (values: LoginFormFields) => {
		setLoading(true);
		try {
			const payload: LoginDto = {
				email: values.email,
				password: values.password,
			};

			const tokenResponse: TokenResponse = await authApi.login(payload);

			saveSession(
				tokenResponse.user,
				tokenResponse.accessToken,
				tokenResponse.refreshToken,
				tokenResponse.expiresAt
			);

			showNotification({
				message: 'Login successful. Welcome back!',
				type: 'success',
			});

			if (queryParams['redirectTo']) {
				navigate(queryParams['redirectTo']);
			} else {
				const primaryRole = tokenResponse.user.roles[0];
				
				if (primaryRole === 'Admin' || primaryRole === 'SuperAdmin') {
					navigate('/admin/dashboard');
				} else if (primaryRole === 'Provider') {
					navigate('/provider/dashboard');
				} else {
					navigate('/client/dashboard');
				}
			}
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Login failed';
			showNotification({ message: errorMessage, type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return { loading, login };
}
