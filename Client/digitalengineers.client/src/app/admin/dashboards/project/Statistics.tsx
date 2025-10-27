import { Card, Row, Col, CardBody } from 'react-bootstrap';

const Statistics = () => {
	return (
		<Row>
			<Col xs={12}>
				<Card className="widget-inline">
					<CardBody className="p-0">
						<Row className="g-0">
							<Col sm={6} lg={3}>
								<Card className="shadow-none m-0">
									<CardBody className="text-center">
										<i className="ri-briefcase-line text-muted font-24"></i>
										<h3>
											<span>29</span>
										</h3>
										<p className="text-muted font-15 mb-0">Total Projects</p>
									</CardBody>
								</Card>
							</Col>

							<Col sm={6} lg={3}>
								<Card className="shadow-none m-0 border-start">
									<CardBody className="text-center">
										<i className="ri-list-check-2 text-muted font-24"></i>
										<h3>
											<span>715</span>
										</h3>
										<p className="text-muted font-15 mb-0">Total Tasks</p>
									</CardBody>
								</Card>
							</Col>

							<Col sm={6} lg={3}>
								<Card className="shadow-none m-0 border-start">
									<CardBody className="text-center">
										<i className="ri-group-line text-muted font-24"></i>
										<h3>
											<span>31</span>
										</h3>
										<p className="text-muted font-15 mb-0">Members</p>
									</CardBody>
								</Card>
							</Col>

							<Col sm={6} lg={3}>
								<Card className="shadow-none m-0 border-start">
									<CardBody className="text-center">
										<i className="ri-line-chart-line text-muted font-24"></i>
										<h3>
											<span>93%</span>
											<i className="mdi mdi-arrow-up text-success"></i>
										</h3>
										<p className="text-muted font-15 mb-0">Productivity</p>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</CardBody>
				</Card>
			</Col>
		</Row>
	);
};

export default Statistics;
