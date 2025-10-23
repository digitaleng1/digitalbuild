
import { Form, TextInput } from '@/components/Form';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import AccountWrapper2 from '../AccountWrapper2';
import {Link} from "react-router";

const BottomLink = () => {
	const { t } = useTranslation();
	return (
		<footer className="footer footer-alt">
			<p className="text-muted">
				{t('Back to')}
				<Link to="/account/login2" className="text-muted ms-1">
					<b>{t('Log In')}</b>
				</Link>
			</p>
		</footer>
	);
};

const RecoverPasswordForm = () => {
	const formSchema = yup.object({
		email: yup.string().email('Enter a valid email').required('Please enter password'),
	});

	return (
		<AccountWrapper2 bottomLinks={<BottomLink />}>
			<h4>Reset Password</h4>
			<p className="text-muted mb-4">Enter your email address and we&apos;ll send you an email with instructions to reset your password.</p>
			<Form schema={formSchema} onSubmit={() => {}}>
				<TextInput name="email" containerClass="mb-3" label="Email Address" type="email" placeholder="Enter your email" />
				<div className="mb-0 text-center d-grid">
					<Button variant="primary" type="submit">
						<i className="mdi mdi-lock-reset" />
						&nbsp;Reset Password
					</Button>
				</div>
			</Form>
		</AccountWrapper2>
	);
};

export default RecoverPasswordForm;
