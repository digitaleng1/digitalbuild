import { Container, Row, Col, Card } from 'react-bootstrap';

interface Feedback {
	id: number;
	name: string;
	role: string;
	avatar: string;
	rating: number;
	comment: string;
}

const UserFeedbacks = () => {
	const feedbacks: Feedback[] = [
		{
			id: 1,
			name: 'Lisa Chen',
			role: 'Project Manager',
			avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
			rating: 5,
			comment: 'Novobid helped me find the perfect structural engineer for our commercial building project. The quality of professionals on this platform is outstanding.'
		},
		{
			id: 2,
			name: 'Marcus Johnson',
			role: 'Civil Engineer',
			avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
			rating: 4,
			comment: 'As an independent engineer, this platform has transformed how I find new clients. The project management tools make collaboration seamless.'
		},
		{
			id: 3,
			name: 'Sophia Rodriguez',
			role: 'Architectural Firm Owner',
			avatar: 'https://randomuser.me/api/portraits/women/11.jpg',
			rating: 5,
			comment: "We've hired multiple specialized engineers through Novobid. The verification process ensures we're working with qualified professionals every time."
		}
	];

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, index) => (
			<i
				key={index}
				className={index < rating ? 'mdi mdi-star' : 'mdi mdi-star-outline'}
				style={{
					color: '#FCD34D',
					fontSize: '1.2rem'
				}}
			></i>
		));
	};

	return (
		<section className="py-5" style={{ backgroundColor: '#F9FAFB' }}>
			<Container>
				<Row className="mb-5">
					<Col lg={12}>
						<div className="text-center">
							<h2 className="mb-3" style={{ fontWeight: '600', color: '#1F2937' }}>
								What Our Users Say
							</h2>
							<p className="text-muted" style={{ fontSize: '1rem' }}>
								Engineers and clients share their experiences with Novobid
							</p>
						</div>
					</Col>
				</Row>

				<Row className="g-4">
					{feedbacks.map((feedback) => (
						<Col lg={4} md={6} key={feedback.id}>
							<Card
								className="h-100"
								style={{
									border: '1px solid #E5E7EB',
									borderRadius: '12px',
									backgroundColor: 'white'
								}}
							>
								<Card.Body className="p-4">
									{/* User Info */}
									<div className="d-flex align-items-center mb-3">
										<img
											src={feedback.avatar}
											alt={feedback.name}
											style={{
												width: '56px',
												height: '56px',
												borderRadius: '50%',
												objectFit: 'cover',
												marginRight: '12px'
											}}
										/>
										<div>
											<h6
												className="mb-0"
												style={{
													fontSize: '1rem',
													fontWeight: '600',
													color: '#1F2937'
												}}
											>
												{feedback.name}
											</h6>
											<p
												className="mb-0"
												style={{
													fontSize: '0.875rem',
													color: '#6B7280'
												}}
											>
												{feedback.role}
											</p>
										</div>
									</div>

									{/* Rating */}
									<div className="mb-3">
										{renderStars(feedback.rating)}
									</div>

									{/* Comment */}
									<p
										style={{
											fontSize: '0.95rem',
											color: '#4B5563',
											lineHeight: '1.6',
											marginBottom: 0
										}}
									>
										"{feedback.comment}"
									</p>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</Container>
		</section>
	);
};

export default UserFeedbacks;
