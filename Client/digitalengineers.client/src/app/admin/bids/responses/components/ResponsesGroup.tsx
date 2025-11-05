import { Card } from 'react-bootstrap';
import type { GroupedBidResponses, BidResponseDto } from '@/types/admin-bid';
import BidResponsesTable from './BidResponsesTable';

interface ResponsesGroupProps {
	group: GroupedBidResponses;
	onApprove: (response: BidResponseDto) => void;
	onReject: (response: BidResponseDto) => void;
	onMessage: (response: BidResponseDto) => void;
}

const ResponsesGroup = ({ group, onApprove, onReject, onMessage }: ResponsesGroupProps) => {
	return (
		<Card className="mb-3">
			<Card.Header>
				<h4 className="header-title mb-0">
					{group.licenseTypeName}
					<span className="badge bg-primary ms-2">{group.responses.length}</span>
				</h4>
			</Card.Header>
			<Card.Body className="p-0">
				<BidResponsesTable
					responses={group.responses}
					onApprove={onApprove}
					onReject={onReject}
					onMessage={onMessage}
				/>
			</Card.Body>
		</Card>
	);
};

export default ResponsesGroup;
