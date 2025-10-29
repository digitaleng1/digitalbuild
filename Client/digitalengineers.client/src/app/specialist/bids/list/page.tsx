import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import bidService from '@/services/bidService';
import type { BidRequestDto } from '@/types/bid';
import BidRequestCard from '../components/BidRequestCard';

const BidsList = () => {
	const [bids, setBids] = useState<BidRequestDto[]>([]);
	const [filteredBids, setFilteredBids] = useState<BidRequestDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<string>('all');

	useEffect(() => {
		loadBids();
	}, []);

	useEffect(() => {
		filterBids();
	}, [bids, statusFilter]);

	const loadBids = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await bidService.getMyBidRequests();
			setBids(data);
		} catch (err: any) {
			setError(err.message || 'Failed to load bid requests');
		} finally {
			setLoading(false);
		}
	};

	const filterBids = () => {
		if (statusFilter === 'all') {
			setFilteredBids(bids);
		} else {
			setFilteredBids(bids.filter(bid => bid.status === statusFilter));
		}
	};

	const getStatusCount = (status: string) => {
		if (status === 'all') return bids.length;
		return bids.filter(bid => bid.status === status).length;
	};

	if (loading) {
		return (
			<>
				<PageBreadcrumb title="Bid Requests" subName="Bids" />
				<div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
					<Spinner animation="border" variant="primary" />
				</div>
			</>
		);
	}

	return (
		<>
			<PageBreadcrumb title="Bid Requests" subName="Bids" />

			{error && (
				<Alert variant="danger" dismissible onClose={() => setError(null)}>
					{error}
				</Alert>
			)}

			<Row className="mb-3">
				<Col>
					<Card>
						<Card.Body>
							<div className="d-flex justify-content-between align-items-center">
								<h4 className="mb-0">My Bid Requests</h4>
								<Form.Select
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value)}
									style={{ width: 'auto' }}
								>
									<option value="all">All ({getStatusCount('all')})</option>
									<option value="Pending">
										Pending ({getStatusCount('Pending')})
									</option>
									<option value="Accepted">
										Accepted ({getStatusCount('Accepted')})
									</option>
									<option value="Rejected">
										Rejected ({getStatusCount('Rejected')})
									</option>
									<option value="Cancelled">
										Cancelled ({getStatusCount('Cancelled')})
									</option>
								</Form.Select>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					{filteredBids.length === 0 ? (
						<Card>
							<Card.Body className="text-center py-5">
								<i className="mdi mdi-inbox-outline" style={{ fontSize: '48px', color: '#98a6ad' }}></i>
								<h5 className="mt-3">No bid requests found</h5>
								<p className="text-muted">
									{statusFilter === 'all'
										? 'You have not received any bid requests yet.'
										: `No ${statusFilter.toLowerCase()} bid requests.`}
								</p>
							</Card.Body>
						</Card>
					) : (
						filteredBids.map(bid => (
							<BidRequestCard key={bid.id} bidRequest={bid} />
						))
					)}
				</Col>
			</Row>
		</>
	);
};

export default BidsList;
