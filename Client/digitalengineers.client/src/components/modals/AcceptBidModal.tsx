import React, { useState, useMemo } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { AcceptBidResponseDto } from '@/types/bid';

interface AcceptBidModalProps {
	show: boolean;
	onHide: () => void;
	onConfirm: (data: AcceptBidResponseDto) => void;
	proposedPrice: number;
	loading?: boolean;
}

const AcceptBidModal: React.FC<AcceptBidModalProps> = ({
	show,
	onHide,
	onConfirm,
	proposedPrice,
	loading = false
}) => {
	const [markupPercentage, setMarkupPercentage] = useState<number>(20);
	const [adminComment, setAdminComment] = useState<string>('');

	const finalPrice = useMemo(() => {
		return proposedPrice * (1 + markupPercentage / 100);
	}, [proposedPrice, markupPercentage]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onConfirm({
			adminMarkupPercentage: markupPercentage,
			adminComment: adminComment || undefined
		});
	};

	const handleClose = () => {
		setMarkupPercentage(20);
		setAdminComment('');
		onHide();
	};

	return (
		<Modal show={show} onHide={handleClose} centered>
			<Form onSubmit={handleSubmit}>
				<Modal.Header closeButton>
					<Modal.Title>Accept Bid Response</Modal.Title>
				</Modal.Header>
				
				<Modal.Body>
					<div className="mb-3">
						<Form.Label htmlFor="markupPercentage">
							Markup Percentage <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="number"
							id="markupPercentage"
							min={0}
							step={1}
							value={markupPercentage}
							onChange={(e) => setMarkupPercentage(Number(e.target.value))}
							required
							disabled={loading}
						/>
						<Form.Text className="text-muted">Default: 20%</Form.Text>
					</div>

					<div className="mb-3">
						<Form.Label htmlFor="adminComment">Admin Comment (Optional)</Form.Label>
						<Form.Control
							as="textarea"
							id="adminComment"
							rows={3}
							maxLength={1000}
							value={adminComment}
							onChange={(e) => setAdminComment(e.target.value)}
							placeholder="Internal notes (visible to admin only)"
							disabled={loading}
						/>
						<Form.Text className="text-muted">
							{adminComment.length}/1000 characters
						</Form.Text>
					</div>

					<div className="border rounded p-3 bg-light">
						<h6 className="mb-2">Price Calculation</h6>
						<div className="d-flex justify-content-between mb-1">
							<span>Proposed Price:</span>
							<strong>${proposedPrice.toLocaleString()}</strong>
						</div>
						<div className="d-flex justify-content-between mb-1">
							<span>Markup ({markupPercentage}%):</span>
							<strong>${(finalPrice - proposedPrice).toLocaleString()}</strong>
						</div>
						<hr className="my-2" />
						<div className="d-flex justify-content-between">
							<span className="fw-bold">Final Price:</span>
							<span className="fw-bold text-primary fs-5">
								${finalPrice.toLocaleString()}
							</span>
						</div>
					</div>
				</Modal.Body>
				
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose} disabled={loading}>
						Cancel
					</Button>
					<Button variant="success" type="submit" disabled={loading}>
						{loading ? 'Accepting...' : 'Accept Bid'}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
};

export default AcceptBidModal;
