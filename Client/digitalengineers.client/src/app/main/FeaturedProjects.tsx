import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router';

interface Engineer {
	name: string;
	avatar: string;
	rating: number;
}

interface Project {
	id: number;
	title: string;
	category: string;
	imageUrl: string;
	engineer: Engineer;
}

const FeaturedProjects = () => {
	const projects: Project[] = [
		{
			id: 1,
			title: 'Hudson River Bridge Renovation',
			category: 'Infrastructure',
			imageUrl: 'https://images.unsplash.com/photo-1477322524744-0eece9e79640?w=800&auto=format&fit=crop',
			engineer: {
				name: 'John Smith',
				avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
				rating: 4.9
			}
		},
		{
			id: 2,
			title: 'Sustainable Community Center',
			category: 'Sustainable Architecture',
			imageUrl: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?w=800&auto=format&fit=crop',
			engineer: {
				name: 'Sarah Johnson',
				avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
				rating: 4.8
			}
		},
		{
			id: 3,
			title: 'Smart City Infrastructure Monitoring',
			category: 'IoT',
			imageUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&auto=format&fit=crop',
			engineer: {
				name: 'Michael Chen',
				avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
				rating: 4.7
			}
		}
	];

	return (
		<section id="projects" className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
			<Container>
				<Row className="mb-4">
					<Col lg={12}>
						<div className="d-flex justify-content-between align-items-center">
							<div>
								<h2 className="mb-2" style={{ fontWeight: '600', color: '#1F2937' }}>
									Featured Projects
								</h2>
								<p className="text-muted" style={{ fontSize: '1rem' }}>
									Discover outstanding engineering and architectural work
								</p>
							</div>
							<Link 
								to="/projects" 
								className="text-decoration-none"
								style={{ 
									color: '#3B82F6',
									fontSize: '1rem',
									fontWeight: '500'
								}}
							>
								View all projects <i className="mdi mdi-arrow-right ms-1"></i>
							</Link>
						</div>
					</Col>
				</Row>

				<Row className="g-4">
					{projects.map((project) => (
						<Col lg={4} md={6} key={project.id}>
							<Link 
								to={`/projects/${project.id}`}
								style={{ textDecoration: 'none' }}
							>
								<Card
									className="h-100"
									style={{
										border: '1px solid #E5E7EB',
										borderRadius: '12px',
										overflow: 'hidden',
										transition: 'all 0.3s ease',
										cursor: 'pointer'
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
									<div 
										style={{
											height: '240px',
											overflow: 'hidden',
											position: 'relative'
										}}
									>
										<img
											src={project.imageUrl}
											alt={project.title}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover'
											}}
										/>
										<div
											style={{
												position: 'absolute',
												top: '16px',
												left: '16px',
												backgroundColor: '#3B82F6',
												color: 'white',
												padding: '6px 12px',
												borderRadius: '6px',
												fontSize: '0.875rem',
												fontWeight: '500'
											}}
										>
											{project.category}
										</div>
									</div>
									
									<Card.Body className="p-4">
										<h5 
											className="mb-3"
											style={{
												fontSize: '1.125rem',
												fontWeight: '600',
												color: '#1F2937',
												lineHeight: '1.4'
											}}
										>
											{project.title}
										</h5>

										<div className="d-flex align-items-center">
											<img
												src={project.engineer.avatar}
												alt={project.engineer.name}
												style={{
													width: '40px',
													height: '40px',
													borderRadius: '50%',
													objectFit: 'cover',
													marginRight: '12px'
												}}
											/>
											<div className="flex-grow-1">
												<div 
													style={{
														fontSize: '0.9rem',
														fontWeight: '500',
														color: '#374151'
													}}
												>
													{project.engineer.name}
												</div>
												<div className="d-flex align-items-center mt-1">
													<i 
														className="mdi mdi-star"
														style={{
															color: '#FCD34D',
															fontSize: '1rem',
															marginRight: '4px'
														}}
													></i>
													<span 
														style={{
															fontSize: '0.875rem',
															color: '#6B7280',
															fontWeight: '500'
														}}
													>
														{project.engineer.rating}
													</span>
												</div>
											</div>
										</div>
									</Card.Body>
								</Card>
							</Link>
						</Col>
					))}
				</Row>
			</Container>
		</section>
	);
};

export default FeaturedProjects;
