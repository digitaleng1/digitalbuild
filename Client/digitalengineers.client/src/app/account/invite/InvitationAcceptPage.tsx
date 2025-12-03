import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spinner, Alert } from 'react-bootstrap';
import specialistInvitationService from '@/services/specialistInvitationService';
import { useAuthContext } from '@/common/context/useAuthContext';
import { getErrorMessage } from '@/utils/errorHandler';

const InvitationAcceptPage = () => {
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();
	const { saveSession } = useAuthContext();
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
	const [errorMessage, setErrorMessage] = useState<string>('');

	useEffect(() => {
		const acceptInvitation = async () => {
			if (!token) {
				setStatus('error');
				setErrorMessage('Invalid invitation link');
				return;
			}

			try {
				// Validate invitation token
				const validation = await specialistInvitationService.validateInvitation(token);

				if (!validation.isValid) {
					setStatus('error');
					setErrorMessage(validation.errorMessage || 'Invalid invitation');
					return;
				}

				// Accept invitation and auto-login
				const result = await specialistInvitationService.acceptInvitation(token);

				// Save session
				saveSession(result.user, result.accessToken, result.refreshToken, result.expiresAt);

				setStatus('success');

				// Redirect to specialist dashboard after 2 seconds
				setTimeout(() => {
					navigate('/specialist/dashboard');
				}, 2000);
			} catch (error: any) {
				setStatus('error');
				setErrorMessage(getErrorMessage(error));
			}
		};

		acceptInvitation();
	}, [token, saveSession, navigate]);

	return (
		<div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-xxl-4 col-lg-5">
						<Card>
							<Card.Body className="p-4">
								<div className="text-center mb-4">
									<h4 className="text-uppercase mt-0">Specialist Invitation</h4>
								</div>

								{status === 'loading' && (
									<div className="text-center py-5">
										<Spinner animation="border" variant="primary" className="mb-3" />
										<p className="text-muted">Processing invitation...</p>
									</div>
								)}

								{status === 'success' && (
									<Alert variant="success">
										<i className="mdi mdi-check-circle me-2"></i>
										<strong>Welcome to Digital Engineers!</strong>
										<br />
										Your account has been activated. Redirecting to dashboard...
									</Alert>
								)}

								{status === 'error' && (
									<>
										<Alert variant="danger">
											<i className="mdi mdi-alert-circle me-2"></i>
											<strong>Error:</strong> {errorMessage}
										</Alert>
										<div className="text-center mt-3">
											<button className="btn btn-primary" onClick={() => navigate('/account/login')}>
												Go to Login
											</button>
										</div>
									</>
								)}
							</Card.Body>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InvitationAcceptPage;
