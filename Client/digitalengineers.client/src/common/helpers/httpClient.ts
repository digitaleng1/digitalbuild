import { httpClient as client } from '../api/interceptors';

const ErrorCodeMessages: { [key: number]: string } = {
	401: 'Invalid credentials',
	403: 'Access Forbidden',
	404: 'Resource or page not found',
};

function HttpClient() {
	const _errorHandler = (error: any) => {
		if (error?.response?.status === 404 && error.response?.data?.type === 'UserNotFound') {
			return Promise.reject(error);
		}
		
		return Promise.reject(
			Object.keys(ErrorCodeMessages).includes(error?.response?.status)
				? ErrorCodeMessages[error.response.status]
				: error.response?.data?.message || error.message || error
		);
	};

	client.interceptors.response.use(
		(response) => response.data,
		_errorHandler
	);

	return {
		get: <T = any>(url: string, config = {}): Promise<T> => client.get(url, config),
		post: <T = any>(url: string, data: any, config = {}): Promise<T> => client.post(url, data, config),
		patch: <T = any>(url: string, data: any, config = {}): Promise<T> => client.patch(url, data, config),
		put: <T = any>(url: string, data: any, config = {}): Promise<T> => client.put(url, data, config),
		delete: <T = any>(url: string, config = {}): Promise<T> => client.delete(url, config),
		client,
	};
}

export default HttpClient();
