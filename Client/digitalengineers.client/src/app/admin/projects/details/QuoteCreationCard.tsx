import { useState, useEffect } from 'react';
import { Card, CardBody, Button, Form, Alert, Spinner, Table } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import { useProjectQuote } from '@/app/shared/hooks/useProjectQuote';

interface QuoteCreationCardProps {
	projectId: number;
	onQuoteSubmitted?: () => void;
}

const QuoteCreationCard = ({ projectId, onQuoteSubmitted }: QuoteCreationCardProps) => {
	const { quote, loading, fetchQuote, submitQuote } = useProjectQuote();
	const [quotedAmount, setQuotedAmount] = useState<string>('');
	const [quoteNotes, setQuoteNotes] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		fetchQuote(projectId);
	}, [projectId, fetchQuote]);

	useEffect(() => {
		if (quote) {
			setQuotedAmount(quote.suggestedAmount.toFixed(2));
			setQuoteNotes(quote.quoteNotes || '');
		}
	}, [quote]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const amount = parseFloat(quotedAmount);
		if (isNaN(amount) || amount <= 0) {
			return;
		}

		setIsSubmitting(true);
		try {
			await submitQuote(projectId, {
				quotedAmount: amount,
				quoteNotes: quoteNotes.trim() || undefined,
			});
			onQuoteSubmitted?.();
		} catch (error) {
			// Error handled by hook
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading && !quote) {
		return (
			<Card>
				<CardBody>
					<div className="text-center py-4">
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</div>
				</CardBody>
			</Card>
		);
	}

	if (!quote) {
		return null;
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	return (
		<Card>
			<CardBody>
				<CardTitle
					containerClass="d-flex justify-content-between align-items-center mb-3"
					title={
						<h4 className="header-title mb-0">
							<i className="mdi mdi-file-document-outline me-2"></i>
							Create Quote for Client
						</h4>
					}
				/>

				<Alert variant="info" className="mb-3">
					<i className="mdi mdi-information-outline me-2"></i>
					Review accepted bids and create a quote to send to the client
				</Alert>

				{/* Accepted Bids Summary */}
				<div className="mb-3">
					<h5 className="mb-2">Accepted Bids Summary:</h5>
					{quote.acceptedBids.length > 0 ? (
						<Table size="sm" bordered hover responsive>
							<thead className="table-light">
								<tr>
									<th>Specialist</th>
									<th>Role</th>
									<th className="text-end">Base Price</th>
									<th className="text-center">Markup</th>
									<th className="text-end">Final Price</th>
								</tr>
							</thead>
							<tbody>
								{quote.acceptedBids.map((bid) => (
									<tr key={bid.bidResponseId}>
										<td>{bid.specialistName}</td>
										<td>
											<small className="text-muted">{bid.role}</small>
										</td>
										<td className="text-end">{formatCurrency(bid.proposedPrice)}</td>
										<td className="text-center">
											<span className="badge bg-primary">+{bid.adminMarkupPercentage}%</span>
										</td>
										<td className="text-end fw-semibold">{formatCurrency(bid.finalPrice)}</td>
									</tr>
								))}
							</tbody>
							<tfoot className="table-light">
								<tr>
									<td colSpan={4} className="text-end fw-bold">Suggested Total:</td>
									<td className="text-end fw-bold text-success">
										{formatCurrency(quote.suggestedAmount)}
									</td>
								</tr>
							</tfoot>
						</Table>
					) : (
						<Alert variant="warning" className="mb-3">
							<i className="mdi mdi-alert-outline me-2"></i>
							No accepted bids yet. You can still create a quote using own resources.
						</Alert>
					)}
				</div>

				{/* Quote Form */}
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3">
						<Form.Label>
							Quoted Amount <span className="text-danger">*</span>
						</Form.Label>
						<Form.Control
							type="number"
							step="0.01"
							min="0.01"
							value={quotedAmount}
							onChange={(e) => setQuotedAmount(e.target.value)}
							placeholder="Enter quoted amount"
							required
							disabled={isSubmitting}
						/>
						<Form.Text className="text-muted">
							Suggested amount: {formatCurrency(quote.suggestedAmount)}
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Quote Notes (Optional)</Form.Label>
						<Form.Control
							as="textarea"
							rows={3}
							maxLength={1000}
							value={quoteNotes}
							onChange={(e) => setQuoteNotes(e.target.value)}
							placeholder="Add any notes for the client..."
							disabled={isSubmitting}
						/>
						<Form.Text className="text-muted">
							{quoteNotes.length}/1000 characters
						</Form.Text>
					</Form.Group>

					<div className="d-flex gap-2">
						<Button
							variant="secondary"
							onClick={() => {
								setQuotedAmount(quote.suggestedAmount.toFixed(2));
								setQuoteNotes('');
							}}
							disabled={isSubmitting}
						>
							Reset
						</Button>
						<Button
							variant="primary"
							type="submit"
							disabled={isSubmitting || !quotedAmount || parseFloat(quotedAmount) <= 0}
							className="flex-grow-1"
						>
							{isSubmitting ? (
								<>
									<Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
										className="me-2"
									/>
									Submitting...
								</>
							) : (
								<>
									<i className="mdi mdi-send me-2"></i>
									Submit Quote to Client
								</>
							)}
						</Button>
					</div>
				</Form>
			</CardBody>
		</Card>
	);
};

export default QuoteCreationCard;
