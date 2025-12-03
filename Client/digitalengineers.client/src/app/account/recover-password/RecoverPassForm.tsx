import { useTranslation } from 'react-i18next';
import AccountWrapper from '../AccountWrapper';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import useRecoverPassword from './useRecoverPassword';
import {Link} from "react-router";
import { Form, TextInput } from '@/components/Form';

export type UserData = {
	email: string;
};

const BottomLink = () => {
	const { t } = useTranslation();

	return (
		<Row className="mt-3">
			<Col className="text-center">
				<p className="text-muted">
					{t('Back to')}
					<Link to={'/account/login'} className="text-muted ms-1">
						<b>{t('Log In')}</b>
					</Link>
				</p>
			</Col>
		</Row>
	);
};

const RecoverPassForm = () => {
	const { t } = useTranslation();
	const { loading, success, onSubmit, schema } = useRecoverPassword();

	if (success) {
		return (
			<AccountWrapper bottomLinks={<BottomLink />}>
				<Alert variant="success">
					<h4>{t('Check Your Email')}</h4>
					<p>{t('If your email is registered, you will receive a password reset link.')}</p>
				</Alert>
			</AccountWrapper>
		);
	}

	return (
		<AccountWrapper bottomLinks={<BottomLink />}>
			<div className="text-center w-75 m-auto">
				<h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Forgot Your Password?')}</h4>
				<p className="text-muted mb-4">{t("Enter your email address and we'll send you a link to reset your password.")}</p>
			</div>

			<Form onSubmit={onSubmit} schema={schema}>
				<TextInput label={t('Email Address')} type="email" name="email" placeholder={t('Enter your email')} containerClass={'mb-3'} />

				<div className="mb-0 text-center">
					<Button variant="primary" type="submit" disabled={loading}>
						{loading ? t('Sending...') : t('Send Reset Link')}
					</Button>
				</div>
			</Form>
		</AccountWrapper>
	);
};

export default RecoverPassForm;
