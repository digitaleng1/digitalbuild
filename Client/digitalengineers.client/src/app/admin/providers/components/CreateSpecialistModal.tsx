import { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { userManagementService } from '@/services/userManagementService';
import lookupService from '@/services/lookupService';
import type { CreateSpecialistRequest } from '@/types/user-management';
import type { ProfessionTypeDetailDto } from '@/types/lookup';
import ProfessionTypeSelector from '@/app/shared/components/create-project/ProfessionTypeSelector';

interface CreateSpecialistModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

interface FormData {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
}

const CreateSpecialistModal = ({ show, onHide, onSuccess }: CreateSpecialistModalProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [selectedProfessionTypeIds, setSelectedProfessionTypeIds] = useState<number[]>([]);
    const [selectedProfessionTypes, setSelectedProfessionTypes] = useState<ProfessionTypeDetailDto[]>([]);
    const [loadingTypes, setLoadingTypes] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        phoneNumber: '',
    });

    // Load selected profession types details
    useEffect(() => {
        const loadSelectedProfessionTypes = async () => {
            if (selectedProfessionTypeIds.length === 0) {
                setSelectedProfessionTypes([]);
                return;
            }

            setLoadingTypes(true);
            try {
                const types = await Promise.all(
                    selectedProfessionTypeIds.map((id) => lookupService.getProfessionTypeDetail(id))
                );
                setSelectedProfessionTypes(types);
            } catch (error: any) {
                console.error('Failed to load profession type details:', error);
            } finally {
                setLoadingTypes(false);
            }
        };

        loadSelectedProfessionTypes();
    }, [selectedProfessionTypeIds]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one digit';
        } else if (!/[^a-zA-Z0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one special character';
        }

        if (selectedProfessionTypeIds.length === 0) {
            newErrors.professionTypes = 'Please select at least one profession type';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const request: CreateSpecialistRequest = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                phoneNumber: formData.phoneNumber || undefined,
                professionTypeIds: selectedProfessionTypeIds,
            };
            
            await userManagementService.createSpecialist(request);
            resetForm();
            onSuccess();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to create specialist';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            phoneNumber: '',
        });
        setSelectedProfessionTypeIds([]);
        setSelectedProfessionTypes([]);
        setErrors({});
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onHide();
    };

    const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleProfessionTypesChange = (ids: number[]) => {
        setSelectedProfessionTypeIds(ids);
        if (errors.professionTypes) {
            setErrors(prev => ({ ...prev, professionTypes: '' }));
        }
    };

    const selectedProfessionTypesDisplay = useMemo(() => {
        return selectedProfessionTypes.map(pt => pt.name).join(', ');
    }, [selectedProfessionTypes]);

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Create New Specialist</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && (
                        <Alert variant="danger" dismissible onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {selectedProfessionTypes.length > 0 && (
                        <Alert variant="info" className="mb-3">
                            <i className="mdi mdi-information-outline me-2"></i>
                            User will be created with expertise in: <strong>{selectedProfessionTypesDisplay}</strong>
                        </Alert>
                    )}

                    <h5 className="mb-3">Personal Information</h5>
                    
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={handleChange('firstName')}
                                    isInvalid={!!errors.firstName}
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.firstName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={handleChange('lastName')}
                                    isInvalid={!!errors.lastName}
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            isInvalid={!!errors.email}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange('password')}
                            isInvalid={!!errors.password}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Must be at least 8 characters with uppercase, lowercase, digit and special character.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="tel"
                            placeholder="Enter phone number (optional)"
                            value={formData.phoneNumber}
                            onChange={handleChange('phoneNumber')}
                            disabled={loading}
                        />
                    </Form.Group>

                    <hr className="my-4" />

                    <h5 className="mb-3">Profession Types <span className="text-danger">*</span></h5>

                    <ProfessionTypeSelector
                        value={selectedProfessionTypeIds}
                        onChange={handleProfessionTypesChange}
                    />

                    {errors.professionTypes && (
                        <div className="text-danger small mt-2">
                            <i className="mdi mdi-alert-circle-outline me-1"></i>
                            {errors.professionTypes}
                        </div>
                    )}

                    <Alert variant="info" className="mt-3 mb-0">
                        <i className="mdi mdi-information-outline me-1"></i>
                        The specialist will receive an email with login credentials.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading || loadingTypes}>
                        {loading ? (
                            <>
                                <Spinner size="sm" className="me-1" />
                                Creating...
                            </>
                        ) : (
                            'Create Specialist'
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default CreateSpecialistModal;
