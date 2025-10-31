import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import bidService from '@/services/bidService';
import type { BidRequestDetailsDto, CreateBidResponseDto } from '@/types/bid';
import BidStatusBadge from '../components/BidStatusBadge';
import BidResponseForm from '../components/BidResponseForm';
import { useToast } from '@/contexts';

const BidDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [bid, setBid] = useState<BidRequestDetailsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            loadBidDetails(parseInt(id));
        }
    }, [id]);

    const loadBidDetails = async (bidId: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await bidService.getBidRequestDetails(bidId);
            setBid(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load bid request details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitResponse = async (response: CreateBidResponseDto) => {
        try {
            setIsSubmitting(true);
            await bidService.submitBidResponse(response);
            showSuccess('Success', 'Your proposal has been submitted successfully');

            if (id) {
                await loadBidDetails(parseInt(id));
            }
        } catch (err: any) {
            showError('Error', err.message || 'Failed to submit proposal');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <>
                <PageBreadcrumb title="Bid Details" subName="Bids" />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            </>
        );
    }

    if (error || !bid) {
        return (
            <>
                <PageBreadcrumb title="Bid Details" subName="Bids" />
                <Alert variant="danger">
                    {error || 'Bid request not found'}
                </Alert>
                <Button variant="secondary" onClick={() => navigate('/specialist/bids')}>
                    Back to Bids
                </Button>
            </>
        );
    }

    const canSubmitResponse = bid.status === 'Pending' && !bid.hasResponse;

    return (
        <>
            <PageBreadcrumb title="Bid Request Details" subName="Bids" />

            <Row>
                <Col lg={8}>
                    {/* Bid Info */}
                    <Card className="mb-3">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="w-100">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <h4 className="mb-0">{bid.title}</h4>
                                            <BidStatusBadge status={bid.status} />
                                        </div>
                                        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/specialist/bids')}>
                                            <i className="mdi mdi-arrow-left me-1"></i>
                                            Back to List
                                        </Button>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
                                        <div className="d-flex align-items-center gap-3">
                                            {bid.proposedBudget !== undefined && bid.proposedBudget !== null && (
                                                <span className="text-muted">
                                                    Proposed Budget: <strong className="text-dark">${bid.proposedBudget.toFixed(2)}</strong>
                                                </span>
                                            )}
                                            {bid.deadline && (
                                                <span className="text-muted">
                                                    Deadline: <strong className="text-dark">{formatDate(bid.deadline)}</strong>
                                                </span>
                                            )}
                                            <span className="text-muted">
                                                Created: <strong className="text-dark">{formatDate(bid.createdAt)}</strong>
                                            </span>
                                        </div>
                                        <span className="text-muted">
                                            Client: <strong className="text-dark">{bid.clientName}</strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {bid.projectThumbnailUrl && (
                                <img
                                    src={bid.projectThumbnailUrl}
                                    alt={bid.projectName}
                                    className="img-fluid rounded mb-3"
                                    style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
                                />
                            )}

                            <h5 className="mt-2">Project Description</h5>
                            <p className="text-muted">{bid.projectDescription}</p>

                            <h5 className="mt-2">Bid Description</h5>
                            <p className="text-muted">{bid.description}</p>

                        </Card.Body>
                    </Card>

                    {bid.status === 'Rejected' && (
                        <Alert variant="danger">
                            <i className="mdi mdi-alert-circle-outline me-2"></i>
                            This bid request has been rejected.
                        </Alert>
                    )}

                    {bid.status === 'Cancelled' && (
                        <Alert variant="warning">
                            <i className="mdi mdi-information-outline me-2"></i>
                            This bid request has been cancelled.
                        </Alert>
                    )}
                </Col>

                {/* Sidebar - Info */}
                <Col lg={4}>
                    {/* Response Form */}
                    {canSubmitResponse && (
                        <BidResponseForm
                            bidRequestId={bid.id}
                            onSubmit={handleSubmitResponse}
                            isSubmitting={isSubmitting}
                        />
                    )}

                    {/* Existing Response */}
                    {bid.response && (
                        <Card className="mb-3">
                            <Card.Header>
                                <h5 className="mb-0">Your Proposal</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <h6 className="text-muted mb-1">Proposed Price</h6>
                                        <p className="h5 mb-3">${bid.response.proposedPrice.toFixed(2)}</p>
                                    </Col>
                                    <Col md={6}>
                                        <h6 className="text-muted mb-1">Estimated Days</h6>
                                        <p className="h5 mb-3">{bid.response.estimatedDays} day{bid.response.estimatedDays !== 1 ? 's' : ''}</p>
                                    </Col>
                                </Row>
                                <h6 className="text-muted mb-1">Cover Letter</h6>
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{bid.response.coverLetter}</p>

                                <div className="mt-3 text-muted small">
                                    <i className="mdi mdi-clock-outline me-1"></i>
                                    Submitted: {formatDate(bid.response.createdAt)}
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default BidDetails;
