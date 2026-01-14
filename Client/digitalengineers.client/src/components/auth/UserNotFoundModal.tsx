import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

interface UserNotFoundModalProps {
    show: boolean;
    onHide: () => void;
}

const UserNotFoundModal = ({ show, onHide }: UserNotFoundModalProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleRegister = () => {
        onHide();
        navigate('/account/register');
    };

    const handleSupport = () => {
        window.location.href = 'mailto:support@digitalengineers.com';
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t('Account Not Found')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="mb-3">
                    {t("We couldn't find an account associated with this email address in our system.")}
                </p>
                <p className="mb-0">
                    {t('Please register a new account or contact our support team for assistance.')}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="light" onClick={onHide}>
                    {t('Close')}
                </Button>
                <Button variant="secondary" onClick={handleSupport}>
                    <i className="mdi mdi-email-outline me-1"></i>
                    {t('Contact Support')}
                </Button>
                <Button variant="primary" onClick={handleRegister}>
                    <i className="mdi mdi-account-plus me-1"></i>
                    {t('Go to Registration')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserNotFoundModal;
