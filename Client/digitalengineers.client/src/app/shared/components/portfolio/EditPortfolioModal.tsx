import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useToast } from '@/contexts/ToastContext';
import portfolioService from '@/services/portfolioService';
import type { PortfolioItem } from '@/types/specialist';
import type { UpdatePortfolioItem } from '@/types/portfolio';

interface EditPortfolioModalProps {
	show: boolean;
	item: PortfolioItem;
	onHide: () => void;
	onSuccess: () => void;
}

const EditPortfolioModal = ({ show, item, onHide, onSuccess }: EditPortfolioModalProps) => {
	const { showSuccess, showError } = useToast();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<UpdatePortfolioItem>({
		title: item.title,
		description: item.description,
		projectUrl: item.projectUrl || '',
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (show) {
			setFormData({
				title: item.title,
				description: item.description,
				projectUrl: item.projectUrl || '',
			});
			setErrors({});
		}
	}, [show, item]);

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = 'Title is required';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Description is required';
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
		try {
			await portfolioService.updatePortfolioItem(item.id, formData);
			showSuccess('Success', 'Portfolio item updated successfully');
			onSuccess();
			onHide();
		} catch (error: any) {
			showError('Error', error.response?.data?.message || 'Failed to update portfolio item');
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		if (!loading) {
			onHide();
		}
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton={!loading}>
				<Modal.Title>Edit Portfolio Item</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body>
					<Form.Group className="mb-3">
						<Form.Label>
							Title <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="text"
							placeholder="Enter project title"
							value={formData.title}
							onChange={(e) => setFormData({ ...formData, title: e.target.value })}
							isInvalid={!!errors.title}
							disabled={loading}
							maxLength={100}
						/>
						<Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>
							Description <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							as="textarea"
							rows={4}
							placeholder="Describe your project"
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							isInvalid={!!errors.description}
							disabled={loading}
							maxLength={500}
						/>
						<Form.Text className="text-muted">{formData.description.length}/500 characters</Form.Text>
						<Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Project URL</Form.Label>
						<Form.Control
							type="url"
							placeholder="https://example.com"
							value={formData.projectUrl}
							onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
							disabled={loading}
						/>
						<Form.Text className="text-muted">Link to live project or case study</Form.Text>
					</Form.Group>

					<Alert variant="info" className="mb-0">
						<i className="mdi mdi-information-outline me-2"></i>
						To change the thumbnail, please delete and re-add this portfolio item.
					</Alert>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					<Button variant="primary" type="submit" disabled={loading}>
						{loading ? (
							<>
								<Spinner as="span" animation="border" size="sm" className="me-2" />
								Updating...
							</>
						) : (
							<>
								<i className="mdi mdi-content-save me-1"></i>
								Save Changes
							</>
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default EditPortfolioModal;
