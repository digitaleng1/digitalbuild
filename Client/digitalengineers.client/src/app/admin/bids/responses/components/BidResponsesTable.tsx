import { Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { BidResponseDto } from '@/types/admin-bid';

interface BidResponsesTableProps {
	responses: BidResponseDto[];
	onApprove: (response: BidResponseDto) => void;
	onReject: (response: BidResponseDto) => void;
	onMessage: (responseId: number) => void;
}

const BidResponsesTable = ({ responses, onApprove, onReject, onMessage }: BidResponsesTableProps) => {
	const getStatusVariant = (status: string) => {
		switch (status.toLowerCase()) {
			case 'pending':
				return 'warning';
			case 'responded':
				return 'info';
			case 'accepted':
				return 'success';
			case 'rejected':
				return 'danger';
			case 'withdrawn':
				return 'secondary';
			default:
				return 'secondary';
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	return (
		<div className="table-responsive">
			<Table hover className="table-centered mb-0">
				<thead>
					<tr>
						<th>Specialist</th>
						<th>Proposal</th>
						<th>Availability</th>
						<th>Status</th>
						<th>Submitted At</th>
						<th className="text-center">Action</th>
					</tr>
				</thead>
				<tbody>
					{responses.map((response) => (
						<tr key={response.id}>
							<td>
								<div className="d-flex align-items-center">
									<img
										src={response.specialistProfilePicture || '/assets/images/users/avatar-default.jpg'}
										alt={response.specialistName}
										className="rounded-circle me-2"
										style={{ width: '32px', height: '32px', objectFit: 'cover' }}
									/>
									<div>
										<div className="fw-semibold">{response.specialistName}</div>
										<div className="text-muted small">{response.specialistEmail}</div>
									</div>
								</div>
							</td>
							<td>
								<div>
									<div className="fw-semibold">${response.proposedPrice.toLocaleString()}</div>
									<div className="text-muted small">{response.estimatedDays} days</div>
								</div>
							</td>
							<td>
								<Badge bg={response.isAvailable ? 'success' : 'secondary'}>
									{response.isAvailable ? 'Available' : 'Unavailable'}
								</Badge>
							</td>
							<td>
								<Badge bg={getStatusVariant(response.status)}>{response.status}</Badge>
							</td>
							<td>{formatDate(response.submittedAt)}</td>
							<td className="table-action text-center">
								{/* Responded = specialist responded, can approve/reject */}
								{response.status.toLowerCase() === 'responded' && (
									<>
										<Link
											to="#"
											className="action-icon text-success"
											onClick={(e) => {
												e.preventDefault();
												onApprove(response);
											}}
											title="Approve"
										>
											<i className="mdi mdi-check-circle"></i>
										</Link>
										<Link
											to="#"
											className="action-icon text-danger"
											onClick={(e) => {
												e.preventDefault();
												onReject(response);
											}}
											title="Reject"
										>
											<i className="mdi mdi-close-circle"></i>
										</Link>
										<Link
											to="#"
											className="action-icon"
											onClick={(e) => {
												e.preventDefault();
												onMessage(response.id);
											}}
											title="Send Message"
										>
											<i className="mdi mdi-message-text"></i>
										</Link>
									</>
								)}
								{/* Accepted = already approved, can only reject (cancel) */}
								{response.status.toLowerCase() === 'accepted' && (
									<>
										<Link
											to="#"
											className="action-icon text-danger"
											onClick={(e) => {
												e.preventDefault();
												onReject(response);
											}}
											title="Cancel Approval"
										>
											<i className="mdi mdi-close-circle"></i>
										</Link>
										<Link
											to="#"
											className="action-icon"
											onClick={(e) => {
												e.preventDefault();
												onMessage(response.id);
											}}
											title="Send Message"
										>
											<i className="mdi mdi-message-text"></i>
										</Link>
									</>
								)}
								{/* Rejected/Withdrawn = can only message */}
								{(response.status.toLowerCase() === 'rejected' || response.status.toLowerCase() === 'withdrawn') && (
									<Link
										to="#"
										className="action-icon"
										onClick={(e) => {
											e.preventDefault();
											onMessage(response.id);
										}}
										title="Send Message"
									>
										<i className="mdi mdi-message-text"></i>
									</Link>
								)}
								{/* Pending = specialist hasn't responded yet, no actions available */}
								{response.status.toLowerCase() === 'pending' && (
									<span className="text-muted small">No response yet</span>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

export default BidResponsesTable;
