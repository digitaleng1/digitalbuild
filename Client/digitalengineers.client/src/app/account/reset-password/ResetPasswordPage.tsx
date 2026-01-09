import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Card, Button, Alert } from 'react-bootstrap';
import { Form } from '@/components/Form';
import PasswordInput from '@/components/Form/PasswordInput';
import * as yup from 'yup';
import authApi from '@/common/api/auth';
import { useAuthContext } from '@/common';
import { useToast } from '@/contexts/ToastContext';
import { getErrorMessage } from '@/utils';

const ResetPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { saveSession } = useAuthContext();
    const { showSuccess, showError } = useToast();

    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    const schema = yup.object().shape({
        newPassword: yup
            .string()
            .required('Please enter new password')
            .min(8, 'Password must be at least 8 characters')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one digit')
            .matches(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
        confirmNewPassword: yup
            .string()
            .oneOf([yup.ref('newPassword')], 'Passwords must match')
            .required('Please confirm new password'),
    });

    const handleSubmit = async (data: { newPassword: string; confirmNewPassword: string }) => {
        if (!userId || !token) {
            showError('Error', 'Invalid reset link');
            return;
        }

        setLoading(true);
        try {
            const tokenResponse = await authApi.resetPassword({
                userId,
                token,
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword,
            });

            saveSession(
                tokenResponse.user,
                tokenResponse.accessToken,
                tokenResponse.refreshToken,
                tokenResponse.expiresAt
            );

            setSuccess(true);
            showSuccess('Success', 'Password changed successfully! You are now logged in.');

            const redirectPath =
                tokenResponse.user.roles[0] === 'Provider'
                    ? '/specialist/projects'
                    : tokenResponse.user.roles[0] === 'Admin'
                        ? '/admin/projects'
                        : '/client/projects';

            setTimeout(() => navigate(redirectPath), 2000);
        } catch (err) {
            showError('Error', getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (!userId || !token) {
        return (
            <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xxl-4 col-lg-5">
                            <Card>
                                <Card.Body className="p-4">
                                    <Alert variant="danger">
                                        <h4>Invalid Reset Link</h4>
                                        <p>The password reset link is invalid or has expired.</p>
                                        <Button onClick={() => navigate('/account/login')}>
                                            Go to Login
                                        </Button>
                                    </Alert>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xxl-4 col-lg-5">
                            <Card>
                                <Card.Body className="p-4">
                                    <Alert variant="success">
                                        <h4>Password Changed Successfully!</h4>
                                        <p>You are now logged in. Redirecting...</p>
                                    </Alert>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5 position-relative">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xxl-4 col-lg-5">
                        <Card>
                            <Card.Body className="p-4">
                                <div className="text-center w-75 m-auto">
                                    <h4 className="text-dark-50 text-center mt-0 fw-bold">Reset Your Password</h4>
                                    <p className="text-muted mb-4">
                                        Enter your new password below. Make sure it's strong and secure.
                                    </p>
                                </div>

                                <Form schema={schema} onSubmit={handleSubmit}>
                                    <PasswordInput
                                        label="New Password"
                                        name="newPassword"
                                        placeholder="Enter new password"
                                        containerClass="mb-3"
                                    />
                                    <PasswordInput
                                        label="Confirm New Password"
                                        name="confirmNewPassword"
                                        placeholder="Confirm new password"
                                        containerClass="mb-3"
                                    />
                                    <div className="mb-3 text-center d-grid">
                                        <Button type="submit" disabled={loading}>
                                            {loading ? 'Changing Password...' : 'Change Password'}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
