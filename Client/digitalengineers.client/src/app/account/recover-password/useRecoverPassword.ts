import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useNotificationContext } from '@/common/context';
import { authApi } from '@/common/api';

export default function useRecoverPassword() {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const { showNotification } = useNotificationContext();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const schema = yup.object().shape({
		email: yup.string().email('Please enter a valid email').required('Please enter your email'),
	});

	const onSubmit = async (data: { email: string }) => {
		const { email } = data;
		setLoading(true);
		try {
			await authApi.forgotPassword(email);
			
			setSuccess(true);
			
			showNotification({
				message: 'If your email is registered, you will receive a password reset link.',
				type: 'success',
			});

			setTimeout(() => {
				navigate(`/account/confirm-mail?email=${encodeURIComponent(email)}&type=password-reset`);
			}, 2000);
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Failed to send reset link';
			showNotification({ message: errorMessage, type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return { loading, success, schema, onSubmit };
}
