import { CheckInput, Form, PasswordInput, TextInput } from '@/components/Form';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AccountWrapper from '../AccountWrapper';
import { Link } from 'react-router';
import useRegister from './useRegister';
import RoleSelector from '@/components/auth/RoleSelector';
import { useState } from 'react';

export type UserData = {
	email: string;
	password: string;
	confirmPassword: string;
	firstName?: string;
	lastName?: string;
};

const BottomLink = () => {
	const { t } = useTranslation();

	return (
		<Row className="mt-3">
			<Col className="text-center">
				<p className="text-muted">
					{t('Already have account?')}
					<Link to={'/account/login'} className="text-muted ms-1">
						<b>{t('Log In')}</b>
					</Link>
				</p>
			</Col>
		</Row>
	);
};

const RegisterForm = () => {
	const [selectedRole, setSelectedRole] = useState<'Client' | 'Provider'>('Client');
	const { loading, register, schema } = useRegister();
	const { t } = useTranslation();

	return (
		<AccountWrapper bottomLinks={<BottomLink />}>
			<div className="text-center w-75 m-auto">
				<h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Free Sign Up')}</h4>
				<p className="text-muted mb-4">
					{t("Don't have an account? Create your account, it takes less than a minute")}
				</p>
			</div>

			<Form
				onSubmit={(data) => register(data, selectedRole)}
				schema={schema}
				defaultValues={{
					email: '',
					firstName: '',
					lastName: '',
					password: '',
					confirmPassword: '',
				}}
			>
				<RoleSelector selectedRole={selectedRole} onRoleChange={setSelectedRole} />

				<TextInput
					label={t('First Name')}
					type="text"
					name="firstName"
					placeholder={t('Enter your first name')}
					containerClass="mb-3"
				/>

				<TextInput
					label={t('Last Name')}
					type="text"
					name="lastName"
					placeholder={t('Enter your last name')}
					containerClass="mb-3"
				/>

				<TextInput
					label={t('Email Address')}
					type="email"
					name="email"
					placeholder={t('Enter your email')}
					containerClass="mb-3"
				/>

				<PasswordInput
					label={t('Password')}
					name="password"
					placeholder={t('Enter password')}
					containerClass="mb-3"
				/>

				<PasswordInput
					label={t('Confirm Password')}
					name="confirmPassword"
					placeholder={t('Confirm password')}
					containerClass="mb-3"
				/>

				<CheckInput
					name="checkbox"
					type="checkbox"
					containerClass="mb-2"
					label={
						<>
							I accept <span className="text-muted cursor-pointer">Terms and Conditions</span>
						</>
					}
					defaultChecked
				/>

				<div className="mb-3 text-center">
					<Button variant="primary" type="submit" disabled={loading}>
						{t('Sign Up')}
					</Button>
				</div>
			</Form>
		</AccountWrapper>
	);
};

export default RegisterForm;
