import { Alert } from 'react-bootstrap';
import type { ProjectDetailsDto } from '@/types/project';

interface QuoteSubmittedAlertProps {
	project: ProjectDetailsDto;
}

const QuoteSubmittedAlert = ({ project }: QuoteSubmittedAlertProps) => {
	if (!project.quotedAmount || project.status !== 'QuoteSubmitted') {
		return null;
	}

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(amount);
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<Alert variant="info" className="mb-4">
			<div className="d-flex align-items-start">
				<i className="mdi mdi-email-check fs-2 me-3"></i>
				<div className="flex-grow-1">
					<h4 className="alert-heading mb-2">
						<i className="mdi mdi-file-search-outline me-2"></i>
						Quote Ready for Review!
					</h4>
					<p className="mb-3">
						We've prepared a detailed quote for your project: <strong className="text-info">{formatCurrency(project.quotedAmount)}</strong>
					</p>
					
					{project.quoteSubmittedAt && (
						<p className="mb-2">
							<small className="text-muted">
								<i className="mdi mdi-calendar-clock me-1"></i>
								Submitted on: {formatDate(project.quoteSubmittedAt)}
							</small>
						</p>
					)}

					{project.quoteNotes && (
						<div className="mb-3">
							<h6 className="mb-1">
								<i className="mdi mdi-message-text-outline me-1"></i>
								Notes:
							</h6>
							<p className="mb-0 small text-muted">{project.quoteNotes}</p>
						</div>
					)}

					<hr className="my-3" />

					<div className="mb-0">
						<h6 className="mb-2">
							<i className="mdi mdi-information-outline me-2"></i>
							Next Steps:
						</h6>
						<ol className="mb-0 ps-3">
							<li className="mb-1">
								Review the quote details below carefully
							</li>
							<li className="mb-1">
								Accept or reject the quote using the buttons on the right
							</li>
							<li className="mb-1">
								Contact us if you have any questions about the quote
							</li>
						</ol>
					</div>
				</div>
			</div>
		</Alert>
	);
};

export default QuoteSubmittedAlert;
