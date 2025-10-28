import type { AxiosError } from 'axios';

export interface ApiErrorResponse {
	title?: string;
	message?: string;
	status?: number;
	traceId?: string;
	errors?: Record<string, string[]>;
}

export const getErrorMessage = (error: unknown): string => {
	if (!error) return 'An unknown error occurred';

	const axiosError = error as AxiosError<ApiErrorResponse>;

	// Check if it's an axios error with response
	if (axiosError.response?.data) {
		const data = axiosError.response.data;

		// Приоритет: message > title > validation errors
		if (data.message) {
			return data.message;
		}

		if (data.title) {
			return data.title;
		}

		// If there are validation errors, format them
		if (data.errors) {
			const errorMessages = Object.entries(data.errors)
				.map(([field, messages]) => `${field}: ${messages.join(', ')}`)
				.join('; ');
			return errorMessages || 'Validation error occurred';
		}
	}

	// Check for axios error message
	if (axiosError.message) {
		return axiosError.message;
	}

	// Fallback to generic error
	if (error instanceof Error) {
		return error.message;
	}

	return 'An unexpected error occurred';
};

export const getErrorTitle = (error: unknown): string => {
	const axiosError = error as AxiosError<ApiErrorResponse>;

	// Сначала проверяем title из response.data
	if (axiosError.response?.data?.title) {
		return axiosError.response.data.title;
	}

	// Затем определяем по статусу
	if (axiosError.response?.status) {
		switch (axiosError.response.status) {
			case 400:
				return 'Bad Request';
			case 401:
				return 'Unauthorized';
			case 403:
				return 'Forbidden';
			case 404:
				return 'Not Found';
			case 409:
				return 'Conflict';
			case 422:
				return 'Validation Error';
			case 500:
				return 'Server Error';
			case 503:
				return 'Service Unavailable';
			default:
				return 'Error';
		}
	}

	return 'Error';
};
