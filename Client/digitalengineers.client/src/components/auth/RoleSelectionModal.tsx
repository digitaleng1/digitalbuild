import { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface RoleSelectionModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: (role: 'Client' | 'Provider') => void;
    loading?: boolean;
}

const RoleSelectionModal = ({ show, onHide, onConfirm, loading = false }: RoleSelectionModalProps) => {
    const { t } = useTranslation();
    const [selectedRole, setSelectedRole] = useState<'Client' | 'Provider' | null>(null);

    useEffect(() => {
        if (!show) {
            setSelectedRole(null);
        }
    }, [show]);

    const handleConfirm = () => {
        if (selectedRole) {
            onConfirm(selectedRole);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{t('Choose Your Role')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted mb-3">{t('How do you want to use Novobid?')}</p>

                <Row className="g-3">
                    <Col xs={12} md={6}>
                        <Card
                            className={`h-100 cursor-pointer border-2 ${selectedRole === 'Client' ? 'border-primary bg-light' : 'border-light'}`}
                            onClick={() => setSelectedRole('Client')}
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <Card.Body className="text-center py-4">
                                <i className="mdi mdi-briefcase-search mdi-48px text-primary mb-2 d-block"></i>
                                <h5 className="mb-2">{t('Client')}</h5>
                                <p className="text-muted small mb-0">
                                    {t("I'm looking for professional services")}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={12} md={6}>
                        <Card
                            className={`h-100 cursor-pointer border-2 ${selectedRole === 'Provider' ? 'border-success bg-light' : 'border-light'}`}
                            onClick={() => setSelectedRole('Provider')}
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <Card.Body className="text-center py-4">
                                <i className="mdi mdi-account-hard-hat mdi-48px text-success mb-2 d-block"></i>
                                <h5 className="mb-2">{t('Provider')}</h5>
                                <p className="text-muted small mb-0">
                                    {t('I offer professional services')}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    {t('Cancel')}
                </Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={!selectedRole || loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-1" />
                            {t('Loading...')}
                        </>
                    ) : (
                        t('Continue with Auth0')
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RoleSelectionModal;
