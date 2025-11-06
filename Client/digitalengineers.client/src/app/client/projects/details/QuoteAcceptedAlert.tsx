import { Alert } from 'react-bootstrap';
import type { ProjectDetailsDto } from '@/types/project';

interface QuoteAcceptedAlertProps {
	project: ProjectDetailsDto;
}

const QuoteAcceptedAlert = ({ project }: QuoteAcceptedAlertProps) => {
	if (!project.quotedAmount || project.status !== 'QuoteAccepted') {
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
		<Alert variant="success" className="mb-4">
			<div className="d-flex align-items-start">
				<i className="mdi mdi-check-circle-outline fs-2 me-3"></i>
				<div className="flex-grow-1">
					<h4 className="alert-heading mb-2">
						<i className="mdi mdi-party-popper me-2"></i>
						Quote Accepted!
					</h4>
					<p className="mb-3">
						Congratulations! You have accepted the quote for{' '}
						<strong className="text-success">{formatCurrency(project.quotedAmount)}</strong>.
					</p>
					
					{project.quoteAcceptedAt && (
						<p className="mb-2">
							<small className="text-muted">
								<i className="mdi mdi-calendar-check me-1"></i>
								Accepted on: {formatDate(project.quoteAcceptedAt)}
							</small>
						</p>
					)}

					<hr className="my-3" />

					<div className="mb-0">
						<h6 className="mb-2">
							<i className="mdi mdi-information-outline me-2"></i>
							Next Steps:
						</h6>
						<ol className="mb-0 ps-3">
							<li className="mb-1">
								The admin will now assign specialists to your project
							</li>
							<li className="mb-1">
								You will receive information about the initial payment
							</li>
							<li className="mb-1">
								Once payment is confirmed, work will begin
							</li>
						</ol>
					</div>
				</div>
			</div>
		</Alert>
	);
};

export default QuoteAcceptedAlert;
