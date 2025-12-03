import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import AccountWrapper from '../AccountWrapper';
import mailSent from '@/assets/images/svg/mail_sent.svg';

const ConfirmMailPage = () => {
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();
	const [email, setEmail] = useState('');
	const [resending, setResending] = useState(false);
	const { showNotification } = useNotificationContext();

	useEffect(() => {
		const emailParam = searchParams.get('email');
		if (emailParam) {
			setEmail(emailParam);
		}
	}, [searchParams]);

	const handleResend = async () => {
		if (!email) {
			showNotification({
				message: 'Email address not found',
				type: 'error',
			});
			return;
		}

		setResending(true);
		try {
			await authApi.resendEmailConfirmation(email);
			showNotification({
				message: 'Confirmation email sent! Please check your inbox.',
				type: 'success',
			});
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || error.message || 'Failed to resend email';
			showNotification({
				message: errorMessage,
				type: 'error',
			});
		} finally {
			setResending(false);
		}
	};

	return (
		<AccountWrapper>
			<div className="text-center m-auto">
				<img src={mailSent} alt="mail sent" height="64" />
				<h4 className="text-dark-50 text-center mt-4 fw-bold">{t('Please check your email')}</h4>
				<p className="text-muted mb-4">
					{t('A email has been sent to')}&nbsp;
					<b>{email || 'your email'}</b>.&nbsp;
					{t('Please check for an email from company and click on the included link to confirm your email.')}
				</p>
				
				{email && (
					<div className="mb-3">
						<button
							className="btn btn-outline-primary"
							onClick={handleResend}
							disabled={resending}
						>
							{resending ? (
								<>
									<span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
									Resending...
								</>
							) : (
								<>
									<i className="mdi mdi-email-sync me-1"></i>
									Resend Confirmation Email
								</>
							)}
						</button>
					</div>
				)}

				<p className="mb-0 text-center">
					<Link className="btn btn-primary" to="/account/login">
						<i className="mdi mdi-home me-1"></i> {t('Back to Login')}
					</Link>
				</p>
			</div>
		</AccountWrapper>
	);
};

export default ConfirmMailPage;
