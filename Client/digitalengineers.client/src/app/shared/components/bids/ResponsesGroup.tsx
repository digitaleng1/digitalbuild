import { useState, useMemo } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { GroupedBidResponses, BidResponseDto } from '@/types/admin-bid';
import BidResponsesTable from './BidResponsesTable';
import CompareSpecialistsModal from './CompareSpecialistsModal';

interface ResponsesGroupProps {
	group: GroupedBidResponses;
	onApprove: (response: BidResponseDto) => void;
	onReject: (response: BidResponseDto) => void;
	onMessage: (response: BidResponseDto) => void;
	onViewProposal: (response: BidResponseDto) => void;
}

const ResponsesGroup = ({ 
	group, 
	onApprove, 
	onReject, 
	onMessage,
	onViewProposal
}: ResponsesGroupProps) => {
	const [selectedBidRequestIds, setSelectedBidRequestIds] = useState<number[]>([]);
	const [showCompareModal, setShowCompareModal] = useState(false);

	const handleToggleSelect = (bidRequestId: number) => {
		setSelectedBidRequestIds((prev) =>
			prev.includes(bidRequestId) 
				? prev.filter((id) => id !== bidRequestId) 
				: [...prev, bidRequestId]
		);
	};

	const selectedResponses = useMemo(() => {
		return group.responses.filter((r) => selectedBidRequestIds.includes(r.bidRequestId));
	}, [group.responses, selectedBidRequestIds]);

	const handleOpenCompare = () => {
		setShowCompareModal(true);
	};

	const handleCloseCompare = () => {
		setShowCompareModal(false);
	};

	return (
		<>
			<Card className="mb-3">
				<Card.Header>
					<div className="d-flex justify-content-between align-items-center">
						<h4 className="header-title mb-0">
							{group.licenseTypeName}
							<span className="badge bg-primary ms-2">{group.responses.length}</span>
						</h4>
						
						{selectedBidRequestIds.length >= 2 && (
							<Button variant="primary" size="sm" onClick={handleOpenCompare}>
								<Icon icon="mdi:chart-bar" className="me-1" />
								Compare {selectedBidRequestIds.length} Specialists
							</Button>
						)}
					</div>
				</Card.Header>
				<Card.Body className="p-0">
					<BidResponsesTable
						responses={group.responses}
						onApprove={onApprove}
						onReject={onReject}
						onMessage={onMessage}
						onViewProposal={onViewProposal}
						selectedBidRequestIds={selectedBidRequestIds}
						onToggleSelect={handleToggleSelect}
					/>
				</Card.Body>
			</Card>

			<CompareSpecialistsModal
				show={showCompareModal}
				onHide={handleCloseCompare}
				selectedResponses={selectedResponses}
			/>
		</>
	);
};

export default ResponsesGroup;
