import { Alert } from 'react-bootstrap';
import type { ProjectDetailsDto } from '@/types/project';

interface PendingAlertProps {
	project: ProjectDetailsDto;
}

const PendingAlert = ({ project }: PendingAlertProps) => {
	if (project.status !== 'QuotePending') {
		return null;
	}

	const formatDate = (dateString?: string) => {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const calculateDaysSinceCreated = () => {
		const createdDate = new Date(project.createdAt);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - createdDate.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	};

	const daysSinceCreated = calculateDaysSinceCreated();

	return (
		<Alert variant="warning" className="mb-4">
			<div className="d-flex align-items-start">
				<i className="mdi mdi-clock-outline fs-2 me-3"></i>
				<div className="flex-grow-1">
					<h4 className="alert-heading mb-2">
						<i className="mdi mdi-timer-sand me-2"></i>
						Project Under Review
					</h4>
					<p className="mb-3">
						Your project has been submitted successfully and our team is currently reviewing your requirements.
					</p>
					
					<p className="mb-2">
						<small className="text-muted">
							<i className="mdi mdi-calendar me-1"></i>
							Submitted on: {formatDate(project.createdAt)}
						</small>
					</p>

					{daysSinceCreated > 0 && (
						<p className="mb-2">
							<small className="text-muted">
								<i className="mdi mdi-update me-1"></i>
								{daysSinceCreated} {daysSinceCreated === 1 ? 'day' : 'days'} ago
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
								We'll prepare a detailed quote for your project soon
							</li>
							<li className="mb-1">
								You'll be notified when the quote is ready for review
							</li>
							<li className="mb-1">
								Estimated review time: 24-48 hours
							</li>
						</ol>
					</div>
				</div>
			</div>
		</Alert>
	);
};

export default PendingAlert;
