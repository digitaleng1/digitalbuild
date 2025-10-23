import { Container, Row, Col } from 'react-bootstrap';
import ContactForm from './ContactForm';

const ContactUs = () => {
	return (
		<section className="py-5 bg-light-lighten border-top border-bottom border-light" id="contact-us-landing">
			<Container>
				<Row>
					<Col lg={12}>
						<div className="text-center">
							<h3>
								Get In <span className="text-primary">Touch</span>
							</h3>
							<p className="text-muted mt-2">
								Please fill out the following form and we will get back to you shortly. For more
								<br />
								information please contact us.
							</p>
						</div>
					</Col>
				</Row>

				<Row className="align-items-center mt-3">
					<Col md={4}>
						<p className="text-muted">
							<span className="fw-bold">Customer Support:</span>
							<br /> <span className="d-block mt-1">+1 234 56 7894</span>
						</p>
						<p className="text-muted mt-4">
							<span className="fw-bold">Email Address:</span>
							<br /> <span className="d-block mt-1">info@gmail.com</span>
						</p>
						<p className="text-muted mt-4">
							<span className="fw-bold">Office Address:</span>
							<br />
							<span className="d-block mt-1">4461 Cedar Street Moro, AR 72368</span>
						</p>
						<p className="text-muted mt-4">
							<span className="fw-bold">Office Time:</span>
							<br /> <span className="d-block mt-1">9:00AM To 6:00PM</span>
						</p>
					</Col>
					<Col md={8}>
						<ContactForm />
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default ContactUs;
