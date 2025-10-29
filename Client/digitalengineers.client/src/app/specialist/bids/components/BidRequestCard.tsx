import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { BidRequestDto } from '@/types/bid';
import BidStatusBadge from './BidStatusBadge';

interface BidRequestCardProps {
	bidRequest: BidRequestDto;
}

const BidRequestCard = ({ bidRequest }: BidRequestCardProps) => {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	return (
		<Card className="mb-3">
			<Card.Body>
				<div className="d-flex justify-content-between align-items-start mb-2">
					<div className="flex-grow-1">
						<h5 className="mb-1">{bidRequest.title}</h5>
						<p className="text-muted mb-2 small">Project: {bidRequest.projectName}</p>
						<div className="d-flex align-items-center gap-2">
							<BidStatusBadge status={bidRequest.status} />
							{bidRequest.hasResponse && (
								<Badge bg="info">
									<i className="mdi mdi-reply me-1"></i>
									Response Sent
								</Badge>
							)}
						</div>
					</div>
					<Link to={`/specialist/bids/${bidRequest.id}`}>
						<Button variant="primary" size="sm">
							View Details
						</Button>
					</Link>
				</div>
				
				<p className="text-muted mb-2">{bidRequest.description}</p>
				
				<div className="d-flex justify-content-between align-items-center text-muted small">
					{bidRequest.proposedBudget !== undefined && bidRequest.proposedBudget !== null && (
						<span>
							<i className="mdi mdi-currency-usd me-1"></i>
							Budget: ${bidRequest.proposedBudget.toFixed(2)}
						</span>
					)}
					{bidRequest.deadline && (
						<span>
							<i className="mdi mdi-calendar-clock me-1"></i>
							Deadline: {formatDate(bidRequest.deadline)}
						</span>
					)}
					<span>
						<i className="mdi mdi-clock-outline me-1"></i>
						Created: {formatDate(bidRequest.createdAt)}
					</span>
				</div>
			</Card.Body>
		</Card>
	);
};

export default BidRequestCard;
