import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import { useState } from 'react';
import { useAuthContext } from '@/common/context/useAuthContext';
import { useQuery } from '@/hooks';
import type { LoginDto, TokenResponse } from '@/types/auth.types';
import * as yup from 'yup';
import { useNavigate } from "react-router";

export const loginFormSchema = yup.object({
	email: yup.string().email('Please enter valid email').required('Please enter email'),
	password: yup.string().required('Please enter password'),
});

export type LoginFormFields = yup.InferType<typeof loginFormSchema>;

export default function useLogin() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const { isAuthenticated, saveSession } = useAuthContext();
	const { showNotification } = useNotificationContext();

	const queryParams = useQuery();

	const login = async (values: LoginFormFields) => {
		setLoading(true);
		try {
			const loginDto: LoginDto = {
				email: values.email!,
				password: values.password!
			};
			
			const tokenResponse: TokenResponse = await authApi.login(loginDto);
			
			saveSession(
				tokenResponse.user,
				tokenResponse.accessToken,
				tokenResponse.refreshToken,
				tokenResponse.expiresAt
			);
			
			navigate(queryParams['redirectTo'] ?? '/dashboard/analytics');
		} catch (error: any) {
			showNotification({ message: error.toString(), type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return { loading, login, isAuthenticated };
}
