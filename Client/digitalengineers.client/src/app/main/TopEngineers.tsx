import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router';

interface Engineer {
	id: number;
	name: string;
	avatar: string;
	title: string;
	location: string;
	rating: number;
	skills: string[];
}

const TopEngineers = () => {
	const engineers: Engineer[] = [
		{
			id: 1,
			name: 'Sarah Johnson',
			avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
			title: 'Architectural Engineer',
			location: 'San Francisco, CA',
			rating: 4.8,
			skills: ['LEED Certified', 'Sustainable Design', 'Energy Modeling']
		},
		{
			id: 2,
			name: 'John Smith',
			avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
			title: 'Civil Engineer',
			location: 'New York, NY',
			rating: 4.9,
			skills: ['Structural Analysis', 'Bridge Design', 'Construction Management']
		},
		{
			id: 3,
			name: 'Emily Williams',
			avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
			title: 'Environmental Engineer',
			location: 'Portland, OR',
			rating: 4.7,
			skills: ['Water Management', 'Sustainability', 'Conservation']
		},
		{
			id: 4,
			name: 'David Rodriguez',
			avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
			title: 'Mechanical Engineer',
			location: 'Austin, TX',
			rating: 4.6,
			skills: ['Renewable Energy', 'Solar Power', 'Wind Power']
		}
	];

	return (
		<section id="engineers" className="py-5" style={{ backgroundColor: '#F9FAFB' }}>
			<Container>
				<Row className="mb-4">
					<Col lg={12}>
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<h2 className="mb-2" style={{ fontWeight: '600', color: '#1F2937' }}>
									Top Engineers
								</h2>
								<p className="text-muted" style={{ fontSize: '1rem' }}>
									Work with the best engineering talent
								</p>
							</div>
							<Link 
								to="/engineers" 
								className="text-decoration-none"
								style={{ 
									color: '#3B82F6',
									fontSize: '1rem',
									fontWeight: '500'
								}}
							>
								View all engineers <i className="mdi mdi-arrow-right ms-1"></i>
							</Link>
						</div>
					</Col>
				</Row>

				<Row className="g-4">
					{engineers.map((engineer) => (
						<Col lg={3} md={6} key={engineer.id}>
							<Card
								className="h-100 text-center d-flex flex-column"
								style={{
									border: '1px solid #E5E7EB',
									borderRadius: '12px',
									transition: 'all 0.3s ease',
									cursor: 'pointer',
									backgroundColor: 'white'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
									e.currentTarget.style.transform = 'translateY(-4px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.boxShadow = 'none';
									e.currentTarget.style.transform = 'translateY(0)';
								}}
							>
								<Card.Body className="p-4 d-flex flex-column">
									{/* Avatar */}
									<div className="mb-3">
										<img
											src={engineer.avatar}
											alt={engineer.name}
											style={{
												width: '80px',
												height: '80px',
												borderRadius: '50%',
												objectFit: 'cover',
												border: '3px solid #F3F4F6'
											}}
										/>
									</div>

									{/* Name */}
									<h5 
										className="mb-1"
										style={{
											fontSize: '1.125rem',
											fontWeight: '600',
											color: '#1F2937'
										}}
									>
										{engineer.name}
									</h5>

									{/* Title */}
									<p 
										className="mb-2"
										style={{
											fontSize: '0.9rem',
											color: '#6B7280'
										}}
									>
										{engineer.title}
									</p>

									{/* Rating */}
									<div className="mb-3 d-flex align-items-center justify-content-center">
										<i 
											className="mdi mdi-star"
											style={{
												color: '#FCD34D',
												fontSize: '1.1rem',
												marginRight: '4px'
											}}
										></i>
										<span 
											style={{
												fontSize: '0.95rem',
												color: '#1F2937',
												fontWeight: '600'
											}}
										>
											{engineer.rating}
										</span>
									</div>

									{/* Location */}
									<p 
										className="mb-3"
										style={{
											fontSize: '0.875rem',
											color: '#6B7280'
										}}
									>
										{engineer.location}
									</p>

									{/* Skills - Fixed height container */}
									<div 
										className="mb-3 d-flex flex-wrap gap-2 justify-content-center flex-grow-1"
										style={{
											minHeight: '80px',
											alignContent: 'flex-start'
										}}
									>
										{engineer.skills.map((skill, index) => (
											<Badge 
												key={index}
												bg="light"
												style={{
													color: '#3B82F6',
													fontSize: '0.75rem',
													fontWeight: '500',
													padding: '6px 10px',
													border: '1px solid #DBEAFE',
													height: 'fit-content'
												}}
											>
												{skill}
											</Badge>
										))}
									</div>

									{/* View Profile Button - Always at bottom */}
									<div className="mt-auto">
										<Link to={`/engineers/${engineer.id}`}>
											<Button
												variant="outline-primary"
												className="w-100"
												style={{
													borderWidth: '1px',
													borderColor: '#3B82F6',
													color: '#3B82F6',
													fontWeight: '500',
													fontSize: '0.95rem',
													padding: '10px'
												}}
											>
												View Profile
											</Button>
										</Link>
									</div>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</Container>
		</section>
	);
};

export default TopEngineers;
