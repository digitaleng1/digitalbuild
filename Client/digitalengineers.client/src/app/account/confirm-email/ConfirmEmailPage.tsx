import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '@/common/api';
import { useAuthContext } from '@/common/context/useAuthContext';
import { useNotificationContext } from '@/common/context';
import AccountWrapper from '../AccountWrapper';

const ConfirmEmailPage = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { saveSession } = useAuthContext();
	const { showNotification } = useNotificationContext();

	useEffect(() => {
		const confirmEmail = async () => {
			const userId = searchParams.get('userId');
			const token = searchParams.get('token');

			if (!userId || !token) {
				setError('Invalid confirmation link');
				setLoading(false);
				return;
			}

			try {
				// Call API (auto-login on backend)
				const tokenResponse = await authApi.confirmEmail(userId, token);

				// Save session (like login)
				saveSession(
					tokenResponse.user,
					tokenResponse.accessToken,
					tokenResponse.refreshToken,
					tokenResponse.expiresAt
				);

				setSuccess(true);
				showNotification({
					message: 'Email confirmed successfully! Welcome!',
					type: 'success',
				});

				// Redirect to dashboard based on role
				const primaryRole = tokenResponse.user.roles[0];
				const redirectPath =
					primaryRole === 'Admin' || primaryRole === 'SuperAdmin'
						? '/admin/projects'
						: primaryRole === 'Provider'
							? '/specialist/projects'
							: '/client/projects';

				setTimeout(() => navigate(redirectPath), 2000);
			} catch (err: any) {
				const errorMessage = err.response?.data?.message || err.message || 'Email confirmation failed';
				setError(errorMessage);
				showNotification({
					message: errorMessage,
					type: 'error',
				});
			} finally {
				setLoading(false);
			}
		};

		confirmEmail();
	}, [searchParams, saveSession, navigate, showNotification]);

	return (
		<AccountWrapper>
			<div className="text-center m-auto">
				{loading && (
					<>
						<div className="spinner-border text-primary mb-3" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
						<h4 className="text-dark-50 text-center fw-bold">Processing email confirmation...</h4>
						<p className="text-muted">Please wait while we confirm your email address.</p>
					</>
				)}

				{success && (
					<div className="alert alert-success" role="alert">
						<i className="mdi mdi-check-circle me-2"></i>
						<h4 className="alert-heading">Email confirmed successfully!</h4>
						<p className="mb-0">Redirecting to your control panel...</p>
					</div>
				)}

				{error && (
					<div className="alert alert-danger" role="alert">
						<i className="mdi mdi-alert-circle me-2"></i>
						<h4 className="alert-heading">Confirmation failed</h4>
						<p>{error}</p>
						<hr />
						<button className="btn btn-primary" onClick={() => navigate('/account/login')}>
							<i className="mdi mdi-arrow-left me-1"></i>
							Go to Login
						</button>
					</div>
				)}
			</div>
		</AccountWrapper>
	);
};

export default ConfirmEmailPage;
