import { Container, Row, Col, Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { Link } from "react-router";
import { useState } from 'react';


const Hero = () => {
	const [searchType, setSearchType] = useState('Professionals');

	return (
		<section 
			className="hero-section py-5"
			style={{
				minHeight: '500px',
				display: 'flex',
				alignItems: 'center'
			}}
		>
			<Container>
				<Row className="align-items-center justify-content-center">
					<Col lg={10} xl={8}>
						<div className="text-center">
							<h1 
								className="text-white fw-bold mb-4" 
								style={{ 
									fontSize: '3rem',
									lineHeight: '1.2'
								}}
							>
								Connect with Top Engineering Professionals
							</h1>
							
							<p 
								className="text-white mb-5" 
								style={{ 
									fontSize: '1.25rem',
									opacity: 0.9
								}}
							>
								Find certified engineers and architects for your next project or showcase
								<br />
								your engineering portfolio to potential clients.
							</p>

							{/* Search Box */}
							<div 
								className="bg-white rounded p-1 mb-4"
								style={{
									boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
								}}
							>
								<Form>
									<InputGroup size="lg">
										{/* Dropdown for search type */}
										<Dropdown onSelect={(eventKey) => setSearchType(eventKey || 'Professionals')}>
											<Dropdown.Toggle
												variant="light"
												id="search-type-dropdown"
												style={{
													backgroundColor: 'white',
													border: 'none',
													borderRight: '1px solid #e0e0e0',
													color: '#6B7280',
													display: 'flex',
													alignItems: 'center',
													gap: '8px',
													paddingLeft: '1rem',
													paddingRight: '1rem',
													minWidth: '180px'
												}}
											>
												<i className="mdi mdi-account-group" style={{ fontSize: '1.2rem' }}></i>
												<span>{searchType}</span>
											</Dropdown.Toggle>

											<Dropdown.Menu>
												<Dropdown.Item eventKey="Professionals" active={searchType === 'Professionals'}>
													<i className="mdi mdi-account-group me-2"></i>
													Professionals
												</Dropdown.Item>
												<Dropdown.Item eventKey="Projects" active={searchType === 'Projects'}>
													<i className="mdi mdi-briefcase me-2"></i>
													Projects
												</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>

										<Form.Control
											type="text"
											placeholder={`Search for ${searchType.toLowerCase()} by name, discipline, or skills...`}
											style={{
												border: 'none',
												fontSize: '1rem',
												paddingLeft: '1rem'
											}}
										/>
										<Button 
											variant="primary" 
											size="lg"
											style={{
												backgroundColor: '#3B82F6',
												border: 'none',
												minWidth: '120px',
												display: 'flex',
												alignItems: 'center',
												gap: '8px'
											}}
										>
											<i className="mdi mdi-magnify"></i> Search
										</Button>
									</InputGroup>
								</Form>
							</div>

							{/* Action Buttons */}
							<div className="d-flex gap-3 justify-content-center flex-wrap">
								<Button
									variant="outline-light"
									size="lg"
									style={{
										borderWidth: '2px',
										borderColor: 'white',
										color: 'white',
										fontWeight: '500',
										minWidth: '180px'
									}}
								>
									Find Engineers
								</Button>
								<Button
									variant="light"
									size="lg"
									style={{
										backgroundColor: 'white',
										color: '#3B5998',
										fontWeight: '500',
										minWidth: '180px',
										border: 'none'
									}}
								>
									Browse Projects
								</Button>
								<Link to="/dashboard/projects">
									<Button
										variant="success"
										size="lg"
										style={{
											backgroundColor: '#10B981',
											border: 'none',
											fontWeight: '500',
											minWidth: '180px'
										}}
									>
										View Profile <i className="mdi mdi-arrow-right ms-1"></i>
									</Button>
								</Link>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Hero;
