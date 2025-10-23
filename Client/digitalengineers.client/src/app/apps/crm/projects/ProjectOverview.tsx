import CardTitle from '@/components/CardTitle';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import ProjectOverviewChart from './ProjectOverviewChart';

const ProjectOverview = () => {
	return (
		<Card>
			<CardBody>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between"
					title="Project Overview"
					menuItems={[{ label: 'Today' }, { label: 'Yesterday' }, { label: 'Last Week' }, { label: 'Last Month' }]}
				/>
				<Row className="align-items-center mt-2">
					<Col md={6} className="order-2 order-md-1">
						<div className="d-flex align-items-center mb-3">
							<div className="flex-shrink-0">
								<i className="mdi mdi-checkbox-blank-circle widget-icon rounded-circle bg-primary-lighten text-primary"></i>
							</div>
							<div className="flex-grow-1 ms-3">
								<h5 className="fw-semibold mt-0 mb-1">Product Design</h5>
								<ul className="list-inline mb-0 text-muted">
									<li className="list-inline-item">
										<b>26</b> Total Projects
									</li>
									<li className="list-inline-item">
										<i className="mdi mdi-circle-small"></i>
									</li>
									<li className="list-inline-item">
										<b>4</b> Employees
									</li>
								</ul>
							</div>
						</div>
						<div className="d-flex align-items-center mb-3">
							<div className="flex-shrink-0">
								<i className="mdi mdi-checkbox-blank-circle widget-icon rounded-circle bg-danger-lighten text-danger"></i>
							</div>
							<div className="flex-grow-1 ms-3">
								<h5 className="fw-semibold mt-0 mb-1">Web Development</h5>
								<ul className="list-inline mb-0 text-muted">
									<li className="list-inline-item">
										<b>30</b> Total Projects
									</li>
									<li className="list-inline-item">
										<i className="mdi mdi-circle-small"></i>
									</li>
									<li className="list-inline-item">
										<b>5</b> Employees
									</li>
								</ul>
							</div>
						</div>
						<div className="d-flex align-items-center mb-3">
							<div className="flex-shrink-0">
								<i className="mdi mdi-checkbox-blank-circle widget-icon rounded-circle bg-success-lighten text-success"></i>
							</div>
							<div className="flex-grow-1 ms-3">
								<h5 className="fw-semibold mt-0 mb-1">Illustration Design</h5>
								<ul className="list-inline mb-0 text-muted">
									<li className="list-inline-item">
										<b>12</b> Total Projects
									</li>
									<li className="list-inline-item">
										<i className="mdi mdi-circle-small"></i>
									</li>
									<li className="list-inline-item">
										<b>3</b> Employees
									</li>
								</ul>
							</div>
						</div>
						<div className="d-flex align-items-center">
							<div className="flex-shrink-0">
								<i className="mdi mdi-checkbox-blank-circle widget-icon rounded-circle bg-warning-lighten text-warning"></i>
							</div>
							<div className="flex-grow-1 ms-3">
								<h5 className="fw-semibold mt-0 mb-1">UI/UX Design</h5>
								<ul className="list-inline mb-0 text-muted">
									<li className="list-inline-item">
										<b>8</b> Total Projects
									</li>
									<li className="list-inline-item">
										<i className="mdi mdi-circle-small"></i>
									</li>
									<li className="list-inline-item">
										<b>4</b> Employees
									</li>
								</ul>
							</div>
						</div>
					</Col>
					<Col md={6} className="order-1 order-md-2">
						<ProjectOverviewChart />
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};

export default ProjectOverview;
