import { useState } from 'react';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import type { CreateBidResponseDto } from '@/types/bid';

interface BidResponseFormProps {
	bidRequestId: number;
	onSubmit: (response: CreateBidResponseDto) => Promise<void>;
	isSubmitting?: boolean;
}

const BidResponseForm = ({ bidRequestId, onSubmit, isSubmitting = false }: BidResponseFormProps) => {
	const [formData, setFormData] = useState<CreateBidResponseDto>({
		bidRequestId,
		proposedPrice: 0,
		estimatedDays: 0,
		coverLetter: ''
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSubmit(formData);
	};

	return (
		<Card className="mt-3">
			<Card.Header>
				<h5 className="mb-0">Submit Your Proposal</h5>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Proposed Price ($)</Form.Label>
						<InputGroup>
							<InputGroup.Text>$</InputGroup.Text>
							<Form.Control
								type="number"
								min="0"
								step="0.01"
								required
								value={formData.proposedPrice || ''}
								onChange={(e) => setFormData({ ...formData, proposedPrice: parseFloat(e.target.value) || 0 })}
								placeholder="Enter total project price"
							/>
						</InputGroup>
						<Form.Text className="text-muted">
							Total price for the entire project
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Estimated Days</Form.Label>
						<Form.Control
							type="number"
							min="1"
							max="365"
							required
							value={formData.estimatedDays || ''}
							onChange={(e) => setFormData({ ...formData, estimatedDays: parseInt(e.target.value) || 0 })}
							placeholder="Enter estimated days to complete"
						/>
						<Form.Text className="text-muted">
							Number of days needed to complete the project
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Cover Letter</Form.Label>
						<Form.Control
							as="textarea"
							rows={5}
							required
							value={formData.coverLetter}
							onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
							placeholder="Describe your experience and approach to this project..."
						/>
						<Form.Text className="text-muted">
							Explain why you're the best fit for this project
						</Form.Text>
					</Form.Group>

					<div className="d-flex justify-content-between align-items-center">
						<div className="text-muted">
							<strong>Total:</strong> ${formData.proposedPrice.toFixed(2)}
							<br />
							<small>Estimated completion: {formData.estimatedDays} day{formData.estimatedDays !== 1 ? 's' : ''}</small>
						</div>
						<Button type="submit" variant="primary" disabled={isSubmitting || formData.proposedPrice === 0 || formData.estimatedDays === 0}>
							{isSubmitting ? (
								<>
									<span className="spinner-border spinner-border-sm me-2" />
									Submitting...
								</>
							) : (
								'Submit Proposal'
							)}
						</Button>
					</div>
				</Form>
			</Card.Body>
		</Card>
	);
};

export default BidResponseForm;
