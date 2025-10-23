import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
	return (
		<footer className="bg-dark py-4">
			<Container>
				<Row>
					<Col lg={12}>
						<div className="text-center">
							<h4 
								className="mb-3"
								style={{
									color: '#d4dce8',
									fontWeight: 'bold',
									fontSize: '1.5rem'
								}}
							>
								Digital Engineers
							</h4>
							<p className="text-light text-opacity-50 mb-0">
								© 2025 Digital Engineers. All rights reserved.
							</p>
						</div>
					</Col>
				</Row>
			</Container>
		</footer>
	);
};

export default Footer;
