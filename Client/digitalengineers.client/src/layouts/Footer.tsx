
import {Link} from "react-router";
import { Col, Row } from 'react-bootstrap';

export default function Footer() {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="footer">
			<div className="container-fluid">
				<Row>
					<Col md={6}>{currentYear} © Novobid - novobid.com</Col>
					<Col md={6}>
						<div className="text-md-end footer-links d-none d-md-block">
							<Link to="https://novobid.com" target="_blank" className="d-none">
								About
							</Link>
							&nbsp;
							<Link to="https://novobid.com" target="_blank" className="d-none">
								Support
							</Link>
							&nbsp;
							<Link to="https://novobid.com" target="_blank" className="d-none">
								Contact Us
							</Link>
						</div>
					</Col>
				</Row>
			</div>
		</footer>
	);
}
