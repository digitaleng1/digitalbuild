import { httpClient as client } from '../api/interceptors';

const ErrorCodeMessages: { [key: number]: string } = {
	401: 'Invalid credentials',
	403: 'Access Forbidden',
	404: 'Resource or page not found',
	};

function HttpClient() {
	const _errorHandler = (error: any) =>
		Promise.reject(
			Object.keys(ErrorCodeMessages).includes(error?.response?.status)
				? ErrorCodeMessages[error.response.status]
				: error.response?.data?.message || error.message || error
		);

	client.interceptors.response.use(
		(response) => response.data,
		_errorHandler
	);

	return {
		get: (url: string, config = {}) => client.get(url, config),
		post: (url: string, data: any, config = {}) => client.post(url, data, config),
		patch: (url: string, data: any, config = {}) => client.patch(url, data, config),
		put: (url: string, data: any, config = {}) => client.put(url, data, config),
		delete: (url: string, config = {}) => client.delete(url, config),
		client,
	};
}

export default HttpClient();
