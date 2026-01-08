
import emailSentImg from '@/assets/images/svg/mail_sent.svg';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AccountWrapper2 from '../AccountWrapper2';
import {useNavigate} from "react-router";


const BottomLink = () => {
	return (
		<footer className="footer footer-alt">
			<p className="text-muted">2025 - {new Date().getFullYear()} © Novobid - novobid.com BY: Digital Engineers</p>
		</footer>
	);
};
const ConfirmMailPage2 = () => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const handleSubmit = () => {
		navigate('/');
	};
	return (
		<AccountWrapper2 bottomLinks={<BottomLink />}>
			<div>
				<div className="text-center m-auto">
					<img src={emailSentImg} alt="mail sent image" height={64} />
					<h4 className="text-dark-50 text-center mt-4 fw-bold">{t('Please check your email')}</h4>
					<p className="text-muted mb-4">
						A email has been send to <b>youremail@domain.com</b>. Please check for an email from company and click on the included link to reset your
						password.
					</p>
				</div>
				<div className="mb-0 d-grid text-center">
					<Button variant="primary" type="submit" onClick={handleSubmit}>
						<i className="mdi mdi-home me-1" />
						{t('Back to Home')}
					</Button>
				</div>
			</div>
		</AccountWrapper2>
	);
};

export default ConfirmMailPage2;
