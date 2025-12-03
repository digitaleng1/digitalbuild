import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import authApi from '@/common/api/auth';
import { useToast } from '@/contexts/ToastContext';
import { getErrorMessage } from '@/utils';

const SecuritySettings = () => {
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useToast();

    const handleChangePassword = async () => {
        setLoading(true);
        try {
            await authApi.initiatePasswordReset();
            showSuccess(
                'Success',
                'Password reset email has been sent. Please check your inbox.'
            );
        } catch (err) {
            showError('Error', getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <Card.Body>
                <h5>Password</h5>
                <p className="text-muted">
                    Change your password to keep your account secure
                </p>
                <Button
                    variant="primary"
                    onClick={handleChangePassword}
                    disabled={loading}
                >
                    {loading ? 'Sending Email...' : 'Change Password'}
                </Button>
            </Card.Body>
        </Card>
    );
};

export default SecuritySettings;
