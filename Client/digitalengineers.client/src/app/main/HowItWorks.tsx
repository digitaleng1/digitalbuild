import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';

interface Step {
	icon: string;
	title: string;
	description: string;
}

const HowItWorks = () => {
	const steps: Step[] = [
		{
			icon: 'mdi mdi-account-group',
			title: 'Find the Right Engineer',
			description: 'Browse profiles, read reviews, and find the perfect engineering professional for your project.'
		},
		{
			icon: 'mdi mdi-briefcase',
			title: 'Collaborate Effectively',
			description: 'Communicate, share files, and manage your project through our secure platform.'
		},
		{
			icon: 'mdi mdi-star',
			title: 'Review and Rate',
			description: 'After project completion, share your experience and help others find quality professionals.'
		}
	];

	return (
		<section id="how-it-works" className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
			<Container>
				<Row className="mb-5">
					<Col lg={12}>
						<div className="text-center">
							<h2 className="mb-3" style={{ fontWeight: '600', color: '#1F2937' }}>
								How Digital Engineers Works
							</h2>
							<p className="text-muted" style={{ fontSize: '1rem', maxWidth: '800px', margin: '0 auto' }}>
								Our platform connects talented engineering professionals with clients looking for specialized expertise
							</p>
						</div>
					</Col>
				</Row>

				<Row className="g-4 mb-5">
					{steps.map((step, index) => (
						<Col lg={4} md={12} key={index}>
							<div className="text-center">
								{/* Icon Circle */}
								<div
									className="d-inline-flex align-items-center justify-content-center mb-3"
									style={{
										width: '80px',
										height: '80px',
										borderRadius: '50%',
										backgroundColor: '#EFF6FF'
									}}
								>
									<i
										className={step.icon}
										style={{
											fontSize: '2rem',
											color: '#3B82F6'
										}}
									></i>
								</div>

								{/* Title */}
								<h4 
									className="mb-3"
									style={{
										fontSize: '1.25rem',
										fontWeight: '600',
										color: '#1F2937'
									}}
								>
									{step.title}
								</h4>

								{/* Description */}
								<p
									style={{
										fontSize: '0.95rem',
										color: '#6B7280',
										lineHeight: '1.6',
										maxWidth: '350px',
										margin: '0 auto'
									}}
								>
									{step.description}
								</p>
							</div>
						</Col>
					))}
				</Row>

				{/* CTA Button */}
				<Row>
					<Col lg={12}>
						<div className="text-center">
							<Link to="/account/register">
								<Button
									size="lg"
									style={{
										backgroundColor: '#3B82F6',
										border: 'none',
										padding: '12px 32px',
										fontSize: '1rem',
										fontWeight: '500',
										borderRadius: '8px'
									}}
								>
									Get Started Today <i className="mdi mdi-arrow-right ms-2"></i>
								</Button>
							</Link>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default HowItWorks;
