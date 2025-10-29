import { Badge } from 'react-bootstrap';
import type { BidRequestStatus } from '@/types/bid';

interface BidStatusBadgeProps {
	status: BidRequestStatus;
}

const BidStatusBadge = ({ status }: BidStatusBadgeProps) => {
	const getBadgeVariant = () => {
		switch (status) {
			case 'Pending':
				return 'warning';
			case 'Accepted':
				return 'success';
			case 'Rejected':
				return 'danger';
			case 'Cancelled':
				return 'secondary';
			default:
				return 'secondary';
		}
	};

	return (
		<Badge bg={getBadgeVariant()} className="me-1">
			{status}
		</Badge>
	);
};

export default BidStatusBadge;
