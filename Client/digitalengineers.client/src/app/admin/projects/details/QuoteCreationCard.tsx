import { useState, useEffect } from 'react';
import { Card, CardBody, Button, Form, Alert, Spinner, Table } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import { useProjectQuote } from '@/app/shared/hooks/useProjectQuote';
import { ProjectStatus, ProjectManagementType, type ProjectDetailsDto } from '@/types/project';

interface QuoteCreationCardProps {
	projectId: number;
	project: ProjectDetailsDto;
	onQuoteSubmitted?: () => void;
	hideMargin?: boolean; // Hide margin fields for client view
}

const QuoteCreationCard = ({ projectId, project, onQuoteSubmitted, hideMargin = false }: QuoteCreationCardProps) => {
	const { quote, loading, fetchQuote, submitQuote } = useProjectQuote();
	const [quotedAmount, setQuotedAmount] = useState<string>('');
	const [quoteNotes, setQuoteNotes] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Determine mode based on project status
	const isQuotePending = project.status === ProjectStatus.QuotePending;
	const isQuoteSubmitted = project.status === ProjectStatus.QuoteSubmitted;
	const isQuoteRejected = project.status === ProjectStatus.QuoteRejected;
	const isQuoteAccepted = project.status === ProjectStatus.QuoteAccepted;
	const isInProgress = project.status === ProjectStatus.InProgress;
	
	// For ClientManaged projects in InProgress status, allow editing
	const canEdit = isQuotePending || isQuoteRejected || (hideMargin && isInProgress);

	useEffect(() => {
		fetchQuote(projectId);
	}, [projectId, fetchQuote]);

	useEffect(() => {
		if (quote) {
			// For QuotePending/QuoteRejected - use suggested amount if no quote exists
			// For QuoteSubmitted/QuoteAccepted - use existing quotedAmount
			if (canEdit && quote.quotedAmount === null) {
				setQuotedAmount(quote.suggestedAmount.toFixed(2));
			} else if (quote.quotedAmount !== null) {
				setQuotedAmount(quote.quotedAmount.toFixed(2));
			}
			setQuoteNotes(quote.quoteNotes || '');
		}
	}, [quote, canEdit]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const amount = parseFloat(quotedAmount);
		if (isNaN(amount) || amount <= 0) {
			return;
		}

		setIsSubmitting(true);
		try {
			const quoteData = {
				quotedAmount: amount,
				quoteNotes: quoteNotes.trim() || undefined,
			};

			if (canEdit) {
				await submitQuote(projectId, quoteData);
			}
			
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

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// View Mode - for QuoteSubmitted/QuoteAccepted (read-only)
	const showViewMode = !canEdit;

	return (
		<Card className={isQuoteAccepted ? 'border-success' : isQuoteSubmitted ? 'border-primary' : ''}>
			<CardBody>
				<CardTitle
					containerClass="d-flex justify-content-between align-items-center mb-3"
					title={
						<h4 className="header-title mb-0">
							<i className="mdi mdi-file-document-outline me-2"></i>
							{hideMargin 
								? 'Set Project Price'
								: isQuotePending 
									? 'Create Quote for Client' 
									: isQuoteRejected 
										? 'Resubmit Quote to Client' 
										: 'Project Quote'}
						</h4>
					}
				/>

				{isQuotePending && (
					<Alert variant="info" className="mb-3">
						<i className="mdi mdi-information-outline me-2"></i>
						{hideMargin 
							? 'Set a price for your project based on accepted bids' 
							: 'Review accepted bids and create a quote to send to the client'}
					</Alert>
				)}

				{isQuoteSubmitted && (
					<Alert variant="primary" className="mb-3">
						<i className="mdi mdi-check-circle me-2"></i>
						Quote submitted to client. Waiting for response.
					</Alert>
				)}

				{isQuoteRejected && (
					<Alert variant="danger" className="mb-3">
						<i className="mdi mdi-close-circle me-2"></i>
						Quote was rejected by client. Review and resubmit with changes.
					</Alert>
				)}

				{isQuoteAccepted && (
					<Alert variant="success" className="mb-3">
						<i className="mdi mdi-check-circle me-2"></i>
						Quote accepted by client!
					</Alert>
				)}

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
									{!hideMargin && <th className="text-center">Markup</th>}
									<th className="text-end">{hideMargin ? 'Price' : 'Final Price'}</th>
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
										{!hideMargin && (
											<td className="text-center">
												<span className="badge bg-primary">+{bid.adminMarkupPercentage}%</span>
											</td>
										)}
										<td className="text-end fw-semibold">{formatCurrency(bid.finalPrice)}</td>
									</tr>
								))}
							</tbody>
							<tfoot className="table-light">
								<tr>
									<td colSpan={hideMargin ? 3 : 4} className="text-end fw-bold">Suggested Total:</td>
									<td className="text-end fw-bold text-success">
										{formatCurrency(quote.suggestedAmount)}
									</td>
								</tr>
							</tfoot>
						</Table>
					) : (
						<Alert variant="warning" className="mb-3">
							<i className="mdi mdi-alert-outline me-2"></i>
							No accepted bids yet.
						</Alert>
					)}
				</div>

				{/* View Mode */}
				{showViewMode && (
					<>
						<div className="mb-3 p-3 bg-light rounded">
							<h6 className="text-muted mb-2">Quoted Amount:</h6>
							<h3 className="mb-0 text-success">{formatCurrency(parseFloat(quotedAmount))}</h3>
						</div>

						{quoteNotes && (
							<div className="mb-3">
								<h6 className="text-muted mb-2">Quote Notes:</h6>
								<p className="mb-0">{quoteNotes}</p>
							</div>
						)}

						{quote.quoteSubmittedAt && (
							<div className="mb-3">
								<small className="text-muted">
									<i className="mdi mdi-calendar me-1"></i>
									Submitted: {formatDate(quote.quoteSubmittedAt)}
								</small>
							</div>
						)}
					</>
				)}

				{/* Edit/Create Form */}
				{canEdit && (
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
							<Form.Label>{hideMargin ? 'Price Notes (Optional)' : 'Quote Notes (Optional)'}</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								maxLength={1000}
								value={quoteNotes}
								onChange={(e) => setQuoteNotes(e.target.value)}
								placeholder={hideMargin ? 'Add any notes about the project price...' : 'Add any notes for the client...'}
								disabled={isSubmitting}
							/>
							<Form.Text className="text-muted">
								{quoteNotes.length}/1000 characters
							</Form.Text>
						</Form.Group>

						<div className="d-flex gap-2">
							{canEdit && (
								<Button
									variant="secondary"
									onClick={() => {
										setQuotedAmount(quote.suggestedAmount.toFixed(2));
										setQuoteNotes('');
									}}
									disabled={isSubmitting}
								>
									Reset to Suggested
								</Button>
							)}
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
										{hideMargin ? 'Setting Price...' : 'Submitting...'}
									</>
								) : (
									<>
										<i className="mdi mdi-send me-2"></i>
										{hideMargin ? 'Set Project Price' : 'Submit Quote to Client'}
									</>
								)}
							</Button>
						</div>
					</Form>
				)}
			</CardBody>
		</Card>
	);
};

export default QuoteCreationCard;
