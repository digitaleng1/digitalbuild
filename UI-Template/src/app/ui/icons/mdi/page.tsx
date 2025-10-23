import { Row, Col, Card, CardBody } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';

import { allMDIICons, newMDIIcons } from './data';




const MaterialDesignIcons = () => {
	return (
		<>
			<PageBreadcrumb title="Material Design Icons" subName="Icons" />

			<Row>
				<Col>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">
								New Icons <span className="badge badge-danger-lighten">6.5.95</span>
							</h4>
							<Row className="icons-list-demo">
								{newMDIIcons.map((icon, index) => (
									<Col xl={3} lg={4} ms={6} key={index}>
										<i className={`mdi ${icon}`} />
										<span>{icon}</span>
									</Col>
								))}
							</Row>
						</CardBody>
					</Card>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">All Icons</h4>
							<Row className="icons-list-demo">
								{allMDIICons.map((icon, index) => (
									<Col xl={3} lg={4} ms={6} key={index}>
										<i className={`mdi mdi-${icon}`} />
										<span>{icon}</span>
									</Col>
								))}
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Size</h4>
							<Row className="icons-list-demo">
								{[18, 24, 36, 48].map((size, index) => (
									<Col xl={3} lg={4} ms={6} key={index}>
										<i className={`mdi mdi-${size}px mdi-account`} /> mdi-
										{size}px
									</Col>
								))}
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Rotate</h4>
							<Row className="icons-list-demo">
								{[45, 90, 135, 180, 225, 270, 315].map((axis, index) => (
									<Col xl={3} lg={4} ms={6} key={index}>
										<i className={`mdi mdi-rotate-${axis} mdi-account`} />
										mdi-rotate-{axis}
									</Col>
								))}
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Spin</h4>
							<Row className="icons-list-demo">
								<Col xl={3} lg={4} ms={6}>
									<i className="mdi mdi-spin mdi-loading" /> mdi-spin
								</Col>
								<Col xl={3} lg={4} ms={6}>
									<i className="mdi mdi-spin mdi-star" /> mdi-spin
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default MaterialDesignIcons;
