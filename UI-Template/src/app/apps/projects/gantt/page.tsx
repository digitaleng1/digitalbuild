import { Card, CardBody, Col, Row } from 'react-bootstrap';
import GanttChart from './GanttChart';
import ProjectList from './ProjectList';

import PageBreadcrumb from '@/components/PageBreadcrumb';



const GanttProject = () => {
	return (
		<>
			<PageBreadcrumb title="Gantt" subName="Projects" />

			<Card>
				<CardBody>
					<Row>
						<Col xxl={3} lg={4}>
							<div className="pe-xl-3">
								<h5 className="mt-0 mb-3">Projects</h5>
								<div className="app-search">
									<form>
										<div className="mb-2 position-relative w-100">
											<input type="text" className="form-control" placeholder="search by name..." />
											<span className="mdi mdi-magnify search-icon"></span>
										</div>
									</form>
								</div>

								<Row>
									<Col>
										<ProjectList />
									</Col>
								</Row>
							</div>
						</Col>

						<Col xxl={9} lg={8} className="mt-4 mt-xl-0">
							<GanttChart />
						</Col>
					</Row>
				</CardBody>
			</Card>
		</>
	);
};

export default GanttProject;
