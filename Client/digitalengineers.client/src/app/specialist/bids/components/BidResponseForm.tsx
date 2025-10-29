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
		proposedRate: 0,
		estimatedHours: 0,
		coverLetter: ''
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSubmit(formData);
	};

	const totalEstimate = formData.proposedRate * formData.estimatedHours;

	return (
		<Card>
			<Card.Header>
				<h5 className="mb-0">Submit Your Proposal</h5>
			</Card.Header>
			<Card.Body>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>Proposed Hourly Rate ($)</Form.Label>
						<InputGroup>
							<InputGroup.Text>$</InputGroup.Text>
							<Form.Control
								type="number"
								min="0"
								step="0.01"
								required
								value={formData.proposedRate || ''}
								onChange={(e) => setFormData({ ...formData, proposedRate: parseFloat(e.target.value) || 0 })}
								placeholder="Enter your hourly rate"
							/>
						</InputGroup>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Estimated Hours</Form.Label>
						<Form.Control
							type="number"
							min="1"
							required
							value={formData.estimatedHours || ''}
							onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 0 })}
							placeholder="Enter estimated hours"
						/>
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
							<strong>Total Estimate:</strong> ${totalEstimate.toFixed(2)}
						</div>
						<Button type="submit" variant="primary" disabled={isSubmitting || totalEstimate === 0}>
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
