import { Card, CardBody, Alert } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { Review } from '@/types/review';
import Rating from '@/components/Rating';
import avatarImg from '@/assets/images/users/avatar-1.jpg';

interface ReviewsSectionProps {
	reviews: Review[];
}

const ReviewsSection = ({ reviews }: ReviewsSectionProps) => {
	return (
		<Card>
			<CardBody>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title="Client Reviews"
					icon="mdi mdi-star"
				/>

				{!reviews || reviews.length === 0 ? (
					<Alert variant="info" className="mb-0">
						<i className="mdi mdi-information-outline me-2"></i>
						No reviews yet
					</Alert>
				) : (
					<div className="d-flex flex-column gap-3">
						{reviews.map((review) => (
							<Card key={review.id} className="border mb-0">
								<Card.Body>
									<div className="d-flex align-items-start mb-2">
										<img
											src={review.clientAvatar || avatarImg}
											alt={review.clientName}
											className="rounded-circle me-3"
											width={48}
											height={48}
										/>
										<div className="flex-grow-1">
											<div className="d-flex justify-content-between align-items-start">
												<div>
													<h6 className="mb-0">{review.clientName}</h6>
													<small className="text-muted">{review.projectName}</small>
												</div>
												<small className="text-muted">
													{new Date(review.createdAt).toLocaleDateString()}
												</small>
											</div>
											<div className="mt-2">
												<Rating value={review.rating} />
											</div>
										</div>
									</div>
									<p className="mb-0 mt-2">{review.comment}</p>
								</Card.Body>
							</Card>
						))}
					</div>
				)}
			</CardBody>
		</Card>
	);
};

export default ReviewsSection;
