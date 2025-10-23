
import {Link} from "react-router";

import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AccountWrapper from '../AccountWrapper';
import useLockScreen from './useLockScreen';

import { Form, PasswordInput } from '@/components/Form';

// images
import avatar1 from '@/assets/images/users/avatar-1.jpg';

const BottomLink = () => {
	const { t } = useTranslation();

	return (
		<Row className="mt-3">
			<Col className="text-center">
				<p className="text-muted">
					{t('Not you? return')}
					<Link to={'/account/login'} className="text-muted ms-1">
						<b>{t('Sign In')}</b>
					</Link>
				</p>
			</Col>
		</Row>
	);
};

const LockScreenForm = () => {
	const { t } = useTranslation();
	const { schema, onSubmit } = useLockScreen();

	return (
		<AccountWrapper bottomLinks={<BottomLink />}>
			<div className="text-center w-75 m-auto">
				<img src={avatar1} height={64} alt="user avatar" className="rounded-circle shadow" />
				<h4 className="text-dark-50 text-center mt-3 fw-bold">{t('Hi ! Michael ')}</h4>
				<p className="text-muted mb-4">{t('Enter your password to access the admin.')}</p>
			</div>

			<Form onSubmit={onSubmit} schema={schema}>
				<PasswordInput label={t('Password')} name="password" placeholder={t('Enter your password')} containerClass={'mb-3'} />

				<div className="mb-0 text-center">
					<Button variant="primary" type="submit">
						{t('Log In')}
					</Button>
				</div>
			</Form>
		</AccountWrapper>
	);
};

export default LockScreenForm;
