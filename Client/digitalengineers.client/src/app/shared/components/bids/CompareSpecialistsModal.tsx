import { useState, useMemo } from 'react';
import { Modal, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { BidResponseDto } from '@/types/admin-bid';

interface CompareSpecialistsModalProps {
    show: boolean;
    onHide: () => void;
    selectedResponses: BidResponseDto[];
}

interface ScoringWeights {
    price: number;
    duration: number;
    experience: number;
    rating: number;
}

interface ScoredResponse extends BidResponseDto {
    scores: {
        price: number;
        duration: number;
        experience: number;
        rating: number;
        total: number;
    };
    rank: number;
    hasBidData: boolean;
}

const CompareSpecialistsModal = ({ show, onHide, selectedResponses }: CompareSpecialistsModalProps) => {
    const [weights, setWeights] = useState<ScoringWeights>({
        price: 40,
        duration: 30,
        experience: 20,
        rating: 10,
    });

    const totalWeight = useMemo(() => {
        return weights.price + weights.duration + weights.experience + weights.rating;
    }, [weights]);

    const handleWeightChange = (key: keyof ScoringWeights, value: number) => {
        setWeights((prev) => ({ ...prev, [key]: value }));
    };

    const scoredResponses = useMemo((): ScoredResponse[] => {
        if (selectedResponses.length === 0) return [];

        const responsesWithBids = selectedResponses.filter(
            (r) => r.status.toLowerCase() === 'responded' || 
                   r.status.toLowerCase() === 'accepted' ||
                   r.status.toLowerCase() === 'rejected'
        );
        const pendingResponses = selectedResponses.filter(
            (r) => r.status.toLowerCase() === 'pending'
        );

        let scored: ScoredResponse[] = [];

        if (responsesWithBids.length > 0) {
            const prices = responsesWithBids.map((r) => r.proposedPrice);
            const durations = responsesWithBids.map((r) => r.estimatedDays);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const minDuration = Math.min(...durations);
            const maxDuration = Math.max(...durations);

            const scoredWithBids = responsesWithBids.map((response) => {
                const priceScore = maxPrice === minPrice ? 100 : ((maxPrice - response.proposedPrice) / (maxPrice - minPrice)) * 100;
                const durationScore = maxDuration === minDuration ? 100 : ((maxDuration - response.estimatedDays) / (maxDuration - minDuration)) * 100;
                const maxYears = 20;
                const experienceScore = Math.min((response.yearsOfExperience / maxYears) * 100, 100);
                const ratingScore = (response.specialistRating / 5) * 100;

                const totalScore = 
                    (priceScore * weights.price / 100) +
                    (durationScore * weights.duration / 100) +
                    (experienceScore * weights.experience / 100) +
                    (ratingScore * weights.rating / 100);

                return {
                    ...response,
                    scores: {
                        price: priceScore,
                        duration: durationScore,
                        experience: experienceScore,
                        rating: ratingScore,
                        total: totalScore,
                    },
                    rank: 0,
                    hasBidData: true,
                };
            });

            scoredWithBids.sort((a, b) => b.scores.total - a.scores.total);
            
            scoredWithBids.forEach((item, index) => {
                item.rank = index + 1;
            });

            scored = scoredWithBids;
        }

        const scoredPending = pendingResponses.map((response, index) => ({
            ...response,
            scores: {
                price: 0,
                duration: 0,
                experience: 0,
                rating: 0,
                total: 0,
            },
            rank: scored.length + index + 1,
            hasBidData: false,
        }));

        return [...scored, ...scoredPending];
    }, [selectedResponses, weights]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRankBadgeColor = (rank: number) => {
        if (rank === 1) return 'success';
        if (rank === 2) return 'warning';
        return 'secondary';
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-success';
        if (score >= 60) return 'text-warning';
        return 'text-danger';
    };

    const hasResponse = (response: BidResponseDto) => {
        return response.status.toLowerCase() === 'responded' || 
               response.status.toLowerCase() === 'accepted' ||
               response.status.toLowerCase() === 'rejected';
    };

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <div className="modal-content">
                <div className="modal-header bg-gradient-primary">
                    <div className="d-flex align-items-center">
                        <Icon icon="mdi:chart-bar" className="fs-4 text-primary me-3" />
                        <div>
                            <h5 className="modal-title mb-0">Compare Selected Bids</h5>
                            <p className="text-muted small mb-0 mt-1">Comparing {selectedResponses.length} selected bids</p>
                        </div>
                    </div>
                    <button type="button" className="btn-close" onClick={onHide}></button>
                </div>

                <div className="modal-body" style={{ maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
                    {/* Specialist Cards */}
                    <div className="row g-4 mb-4">
                        {scoredResponses.map((response) => (
                            <div key={response.id} className="col-md-4">
                                <div className={`card h-100 shadow-sm ${response.rank === 1 && response.hasBidData ? 'border-success border-2' : ''} ${!response.hasBidData ? 'opacity-75' : ''}`}>
                                    <div className={`card-body ${response.rank === 1 && response.hasBidData ? 'bg-light bg-gradient' : ''}`}>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="d-flex align-items-center">
                                                {response.specialistProfilePicture ? (
                                                    <img
                                                        src={response.specialistProfilePicture}
                                                        alt={response.specialistName}
                                                        className="rounded-circle me-2"
                                                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                                                        style={{ width: '48px', height: '48px' }}
                                                    >
                                                        <span className="fw-semibold">{getInitials(response.specialistName)}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <h6 className="mb-0 d-flex align-items-center">
                                                        {response.specialistName}
                                                        {response.rank === 1 && response.hasBidData && (
                                                            <Icon icon="mdi:medal" className="ms-2 text-warning" />
                                                        )}
                                                    </h6>
                                                    <small className="text-muted">{response.specialistEmail}</small>
                                                    <div className="d-flex align-items-center gap-2 mt-1">
                                                        <div className="d-flex align-items-center">
                                                            <Icon icon="mdi:star" className="text-warning me-1" width={14} />
                                                            <small className="fw-semibold">{response.specialistRating.toFixed(1)}</small>
                                                        </div>
                                                        <span className="text-muted">•</span>
                                                        <div className="d-flex align-items-center">
                                                            <Icon icon="mdi:briefcase-outline" className="text-primary me-1" width={14} />
                                                            <small className="text-muted">{response.yearsOfExperience} years</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge bg={getRankBadgeColor(response.rank)} className="fs-5">
                                                #{response.rank}
                                            </Badge>
                                        </div>

                                        {response.hasBidData ? (
                                            <>
                                                <div className="row g-2 mb-3">
                                                    <div className="col-6">
                                                        <small className="text-muted d-block">Bid Amount</small>
                                                        <strong className="fs-5">${response.proposedPrice.toLocaleString()}</strong>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted d-block">Duration</small>
                                                        <strong className="fs-5">{response.estimatedDays} days</strong>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="mb-3">
                                                <div className="alert alert-warning mb-0 py-2">
                                                    <small><Icon icon="mdi:alert" className="me-1" />Awaiting response</small>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <Badge bg={response.isAvailable ? 'success' : 'secondary'}>
                                                {response.isAvailable ? 'Available' : 'Unavailable'}
                                            </Badge>
                                            <Badge bg="info" className="ms-2">
                                                {response.licenseTypeName}
                                            </Badge>
                                        </div>

                                        {hasResponse(response) ? (
                                            <div className="mb-2">
                                                <small className="text-muted d-block text-uppercase mb-1">Cover Letter Preview</small>
                                               
                                                <p className="small text-truncate mb-0" title={response.coverLetter}>
                                                    {response.coverLetter}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mb-2">
                                                <small className="text-muted d-block text-uppercase mb-1">Cover Letter</small>
                                                <p className="small text-muted fst-italic mb-0">
                                                    No response yet
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {response.hasBidData ? (
                                        <div className="card-footer">
                                            <div className="text-center">
                                                <div className={`fs-4 fw-bold ${getScoreColor(response.scores.total)}`}>
                                                    {response.scores.total.toFixed(0)}
                                                </div>
                                                <small className="text-muted">Total Score</small>
                                                <div className="progress mt-2" style={{ height: '8px' }}>
                                                    <div
                                                        className={`progress-bar ${response.scores.total >= 80 ? 'bg-success' : response.scores.total >= 60 ? 'bg-warning' : 'bg-danger'}`}
                                                        style={{ width: `${response.scores.total}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card-footer bg-light">
                                            <div className="text-center">
                                                <small className="text-muted">No scoring available</small>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Comparison Table */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h6 className="card-title mb-3">Quick Comparison ({selectedResponses.length} selected)</h6>
                            <div className="table-responsive">
                                <table className="table table-hover table-centered mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Professional</th>
                                            <th className="text-center">Bid Amount</th>
                                            <th className="text-center">Duration</th>
                                            <th className="text-center">License Type</th>
                                            <th className="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scoredResponses.map((response) => (
                                            <tr key={response.id}>
                                                <td>
                                                    <strong>{response.specialistName}</strong>
                                                </td>
                                                <td className="text-center">
                                                    {response.hasBidData ? (
                                                        <span className="fw-semibold">${response.proposedPrice.toLocaleString()}</span>
                                                    ) : (
                                                        <span className="text-muted small">Pending</span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    {response.hasBidData ? (
                                                        <span>{response.estimatedDays} days</span>
                                                    ) : (
                                                        <span className="text-muted small">Pending</span>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <Badge bg="info">{response.licenseTypeName}</Badge>
                                                </td>
                                                <td className="text-center">
                                                    <Badge bg={response.isAvailable ? 'success' : 'secondary'}>
                                                        {response.isAvailable ? 'Available' : 'Unavailable'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {scoredResponses.some(r => r.hasBidData) && (
                        <>
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h6 className="card-title mb-3 d-flex align-items-center">
                                        <Icon icon="mdi:chart-line" className="me-2 text-primary" />
                                        Scoring Weights
                                    </h6>
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-3">
                                            <label className="form-label small d-flex align-items-center">
                                                <Icon icon="mdi:currency-usd" className="me-1 text-success" />
                                                Price
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="range"
                                                    className="form-range flex-grow-1"
                                                    min="0"
                                                    max="100"
                                                    value={weights.price}
                                                    onChange={(e) => handleWeightChange('price', parseInt(e.target.value))}
                                                />
                                                <span className="ms-2 fw-semibold" style={{ minWidth: '45px' }}>
                                                    {weights.price}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label small d-flex align-items-center">
                                                <Icon icon="mdi:clock-outline" className="me-1 text-info" />
                                                Duration
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="range"
                                                    className="form-range flex-grow-1"
                                                    min="0"
                                                    max="100"
                                                    value={weights.duration}
                                                    onChange={(e) => handleWeightChange('duration', parseInt(e.target.value))}
                                                />
                                                <span className="ms-2 fw-semibold" style={{ minWidth: '45px' }}>
                                                    {weights.duration}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label small d-flex align-items-center">
                                                <Icon icon="mdi:medal" className="me-1 text-warning" />
                                                Experience
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="range"
                                                    className="form-range flex-grow-1"
                                                    min="0"
                                                    max="100"
                                                    value={weights.experience}
                                                    onChange={(e) => handleWeightChange('experience', parseInt(e.target.value))}
                                                />
                                                <span className="ms-2 fw-semibold" style={{ minWidth: '45px' }}>
                                                    {weights.experience}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label small d-flex align-items-center">
                                                <Icon icon="mdi:star" className="me-1 text-warning" />
                                                Rating
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <input
                                                    type="range"
                                                    className="form-range flex-grow-1"
                                                    min="0"
                                                    max="100"
                                                    value={weights.rating}
                                                    onChange={(e) => handleWeightChange('rating', parseInt(e.target.value))}
                                                />
                                                <span className="ms-2 fw-semibold" style={{ minWidth: '45px' }}>
                                                    {weights.rating}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="alert alert-info mb-0">
                                        <small>
                                            <strong>Total Weight:</strong> {totalWeight}%
                                        </small>
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Scoring Matrix */}
                            <div className="card shadow-sm">
                                <div className="card-header">
                                    <h6 className="mb-0">Detailed Scoring Matrix</h6>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover table-centered mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Rank</th>
                                                    <th>Professional</th>
                                                    <th className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <Icon icon="mdi:currency-usd" className="me-1" />
                                                            Price
                                                        </div>
                                                    </th>
                                                    <th className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <Icon icon="mdi:clock-outline" className="me-1" />
                                                            Duration
                                                        </div>
                                                    </th>
                                                    <th className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <Icon icon="mdi:medal" className="me-1" />
                                                            Experience
                                                        </div>
                                                    </th>
                                                    <th className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <Icon icon="mdi:star" className="me-1" />
                                                            Rating
                                                        </div>
                                                    </th>
                                                    <th className="text-center">Total Score</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {scoredResponses.filter(r => r.hasBidData).map((response) => (
                                                    <tr key={response.id}>
                                                        <td>
                                                            <Badge bg={getRankBadgeColor(response.rank)} className="fs-6">
                                                                {response.rank}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <div className="fw-semibold">{response.specialistName}</div>
                                                                <small className="text-muted">${response.proposedPrice.toLocaleString()}</small>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div>
                                                                <div className="fw-semibold">{response.scores.price.toFixed(0)}</div>
                                                                <small className="text-muted">({((response.scores.price * weights.price) / 100).toFixed(0)} pts)</small>
                                                                <div className="progress mt-1" style={{ height: '4px' }}>
                                                                    <div
                                                                        className={`progress-bar ${getScoreColor(response.scores.price).replace('text-', 'bg-')}`}
                                                                        style={{ width: `${response.scores.price}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div>
                                                                <div className="fw-semibold">{response.scores.duration.toFixed(0)}</div>
                                                                <small className="text-muted">({((response.scores.duration * weights.duration) / 100).toFixed(0)} pts)</small>
                                                                <div className="progress mt-1" style={{ height: '4px' }}>
                                                                    <div
                                                                        className={`progress-bar ${getScoreColor(response.scores.duration).replace('text-', 'bg-')}`}
                                                                        style={{ width: `${response.scores.duration}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div>
                                                                <div className="fw-semibold">{response.scores.experience.toFixed(0)}</div>
                                                                <small className="text-muted">({((response.scores.experience * weights.experience) / 100).toFixed(0)} pts)</small>
                                                                <div className="progress mt-1" style={{ height: '4px' }}>
                                                                    <div
                                                                        className={`progress-bar ${getScoreColor(response.scores.experience).replace('text-', 'bg-')}`}
                                                                        style={{ width: `${response.scores.experience}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div>
                                                                <div className="fw-semibold">{response.scores.rating.toFixed(0)}</div>
                                                                <small className="text-muted">({((response.scores.rating * weights.rating) / 100).toFixed(0)} pts)</small>
                                                                <div className="progress mt-1" style={{ height: '4px' }}>
                                                                    <div
                                                                        className={`progress-bar ${getScoreColor(response.scores.rating).replace('text-', 'bg-')}`}
                                                                        style={{ width: `${response.scores.rating}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div>
                                                                <div className={`fs-5 fw-bold ${getScoreColor(response.scores.total)}`}>
                                                                    {response.scores.total.toFixed(0)}
                                                                </div>
                                                                <div className="progress mt-1" style={{ height: '8px' }}>
                                                                    <div
                                                                        className={`progress-bar ${getScoreColor(response.scores.total).replace('text-', 'bg-')}`}
                                                                        style={{ width: `${response.scores.total}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-footer bg-light">
                    <small className="text-muted me-auto">
                        Showing {selectedResponses.length} of {selectedResponses.length} total bids
                    </small>
                    <button type="button" className="btn btn-secondary" onClick={onHide}>
                        Close Comparison
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CompareSpecialistsModal;
