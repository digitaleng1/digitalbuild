
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import * as yup from 'yup';

import AccountWrapper2 from '../AccountWrapper2';
import SocialLogin from '../SocialLogin';

import { Form, PasswordInput } from '@/components/Form';

// images
import avatar1 from '@/assets/images/users/avatar-1.jpg';
import {Link} from "react-router";


const BottomLink = () => {
	const { t } = useTranslation();
	return (
		<footer className="footer footer-alt">
			<p className="text-muted">
				{t('Not you? return')}
				<Link to="/account/login2" className="text-muted ms-1">
					<b>{t('Sign In')}</b>
				</Link>
			</p>
		</footer>
	);
};
const LockScreenPage = () => {
	const formSchema = yup.object({
		password: yup.string().required('Please enter password'),
	});
	return (
		<AccountWrapper2 bottomLinks={<BottomLink />}>
			<div>
				<div className="text-center w-75 m-auto">
					<img src={avatar1} height={64} alt="user-image" className="rounded-circle shadow" />
					<h4 className="text-dark-50 text-center mt-3 fw-bold">Hi ! Michael </h4>
					<p className="text-muted mb-4">Enter your password to access the admin.</p>
				</div>
				<Form onSubmit={() => {}} schema={formSchema}>
					<PasswordInput name="password" placeholder="Enter your password" label="Password" containerClass="mb-3" />

					<div className="mb-0 text-center d-grid">
						<Button variant="primary" type="submit">
							<i className="mdi mdi-login" />
							&nbsp; Log In
						</Button>
					</div>
					<SocialLogin />
				</Form>
			</div>
		</AccountWrapper2>
	);
};

export default LockScreenPage;
