import { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useToast } from '@/contexts/ToastContext';
import portfolioService from '@/services/portfolioService';
import type { CreatePortfolioItem } from '@/types/portfolio';

interface AddPortfolioModalProps {
	show: boolean;
	specialistId: number;
	onHide: () => void;
	onSuccess: () => void;
}

const AddPortfolioModal = ({ show, specialistId, onHide, onSuccess }: AddPortfolioModalProps) => {
	const { showSuccess, showError } = useToast();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<CreatePortfolioItem>({
		title: '',
		description: '',
		projectUrl: '',
		thumbnail: undefined,
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (!file.type.startsWith('image/')) {
				setErrors({ ...errors, thumbnail: 'Please select an image file' });
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				setErrors({ ...errors, thumbnail: 'File size must be less than 5MB' });
				return;
			}
			setFormData({ ...formData, thumbnail: file });
			setErrors({ ...errors, thumbnail: '' });
		}
	};

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
			await portfolioService.createPortfolioItem(specialistId, formData);
			showSuccess('Success', 'Portfolio item added successfully');
			setFormData({
				title: '',
				description: '',
				projectUrl: '',
				thumbnail: undefined,
			});
			onSuccess();
			onHide();
		} catch (error: any) {
			showError('Error', error.response?.data?.message || 'Failed to add portfolio item');
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		if (!loading) {
			setFormData({
				title: '',
				description: '',
				projectUrl: '',
				thumbnail: undefined,
			});
			setErrors({});
			onHide();
		}
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Modal.Header closeButton={!loading}>
				<Modal.Title>Add Portfolio Item</Modal.Title>
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

					<Form.Group className="mb-3">
						<Form.Label>Thumbnail Image</Form.Label>
						<Form.Control
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							isInvalid={!!errors.thumbnail}
							disabled={loading}
						/>
						<Form.Text className="text-muted">Max file size: 5MB. Supported: JPG, PNG, GIF</Form.Text>
						<Form.Control.Feedback type="invalid">{errors.thumbnail}</Form.Control.Feedback>
					</Form.Group>

					{formData.thumbnail && (
						<Alert variant="info" className="mb-0">
							<i className="mdi mdi-image me-2"></i>
							Selected: {formData.thumbnail.name}
						</Alert>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					<Button variant="primary" type="submit" disabled={loading}>
						{loading ? (
							<>
								<Spinner as="span" animation="border" size="sm" className="me-2" />
								Adding...
							</>
						) : (
							<>
								<i className="mdi mdi-plus me-1"></i>
								Add Portfolio Item
							</>
						)}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default AddPortfolioModal;
