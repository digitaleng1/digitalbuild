
import { CheckInput, Form, PasswordInput, TextInput } from '@/components/Form';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AccountWrapper2 from '../AccountWrapper2';
import useLogin, { loginFormSchema } from './useLogin';
import {Link} from "react-router";
import SocialLogin from '../SocialLogin';

const BottomLink = () => {
	const { t } = useTranslation();

	return (
		<footer className="footer footer-alt">
			<p className="text-muted">
				{t("Don't have an account?")}
				<Link to={'/account/register2'} className="text-muted ms-1">
					<b>{t('Sign Up')}</b>
				</Link>
			</p>
		</footer>
	);
};
const LoginForm = () => {
	const { t } = useTranslation();
	const { loading, login } = useLogin();

	return (
		<AccountWrapper2 bottomLinks={<BottomLink />}>
			<h4 className="mt-0">{t('Sign In')}</h4>
			<p className="text-muted mb-4">{t('Enter your email address and password to access account.')}</p>

			<Form onSubmit={login} schema={loginFormSchema} defaultValues={{ email: 'hyper@coderthemes.com', password: 'digital-engineers' }}>
				<TextInput label={t('Email Address')} type="email" name="email" placeholder={t('Enter your email')} containerClass={'mb-3'} />
				<PasswordInput label={t('Password')} name="password" placeholder={t('Enter your password')} containerClass={'mb-3'}>
					<Link to="/account/forget-password2" className="text-muted float-end">
						<small>{t('Forgot your password?')}</small>
					</Link>
				</PasswordInput>

				<CheckInput name="checkbox-signin" type="checkbox" label="Remeber me" containerClass="mb-3" defaultChecked />

				<div className="d-grid mb-0 text-center">
					<Button variant="primary" type="submit" disabled={loading}>
						<i className="mdi mdi-login"></i> {t('Log In')}
					</Button>
				</div>

				<SocialLogin />
			</Form>
		</AccountWrapper2>
	);
};

export default LoginForm;
