import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useState } from 'react';
import { useNotificationContext } from '@/common/context';
import {type User } from '@/types/User';
import { type AxiosResponse } from 'axios';
import { authApi } from '@/common/api';

export default function useRecoverPassword() {
	const [loading, setLoading] = useState(false);
	const { showNotification } = useNotificationContext();

	const { t } = useTranslation();

	/*
	 * form schema
	 */
	const schema = yup.object().shape({
		username: yup.string().required(t('Please enter Username')),
	});

	/*
	 * handle form submission
	 */
	const onSubmit = async ({ data }: any) => {
		const { email }: User = data;
		setLoading(true);
		try {
			const response: AxiosResponse<User> = await authApi.forgetPassword(email);
			console.log(response);
		} catch (error: any) {
			showNotification({ message: error.toString(), type: 'error' });
		} finally {
			setLoading(false);
		}
		// dispatch(forgotPassword(formData["username"]));
	};

	return { loading, schema, onSubmit };
}
