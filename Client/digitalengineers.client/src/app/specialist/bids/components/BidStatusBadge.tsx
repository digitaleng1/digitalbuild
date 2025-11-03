import { Badge } from 'react-bootstrap';
import type { BidRequestStatus } from '@/types/bid';

interface BidStatusBadgeProps {
	status: BidRequestStatus;
}

const BidStatusBadge = ({ status }: BidStatusBadgeProps) => {
	const getBadgeConfig = () => {
		switch (status) {
			case 'Pending':
				return { 
					variant: 'warning', 
					icon: 'mdi-clock-outline',
					label: 'Pending'
				};
			case 'Responded':
				return { 
					variant: 'info', 
					icon: 'mdi-reply',
					label: 'Responded'
				};
			case 'Accepted':
				return { 
					variant: 'success', 
					icon: 'mdi-check-circle',
					label: 'Approved'
				};
			case 'Rejected':
				return { 
					variant: 'danger', 
					icon: 'mdi-close-circle',
					label: 'Rejected'
				};
			case 'Withdrawn':
				return { 
					variant: 'secondary', 
					icon: 'mdi-cancel',
					label: 'Withdrawn'
				};
			default:
				return { 
					variant: 'secondary', 
					icon: 'mdi-help-circle',
					label: status
				};
		}
	};

	const config = getBadgeConfig();

	return (
		<Badge bg={config.variant} className="me-1">
			<i className={`mdi ${config.icon} me-1`}></i>
			{config.label}
		</Badge>
	);
};

export default BidStatusBadge;
