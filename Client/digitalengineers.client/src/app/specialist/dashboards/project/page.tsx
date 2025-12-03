import { Row, Col, Alert } from 'react-bootstrap';
import Statistics from './Statistics';
import Status from './Status';
import Tasks from './Tasks';
import TasksChart from './TasksChart';
import Activity from './Activity';
import Calendar from './Calendar';
import PageBreadcrumb from '@/components/PageBreadcrumb';

const ProjectDashboard = () => {
	return (
		<>
			<PageBreadcrumb title="Projects" subName="Dashboard" />

			<Alert variant="info" className="mb-3">
				<i className="mdi mdi-tools me-2"></i>
				<strong>Under Construction</strong> - This dashboard is currently being developed and may not display accurate data.
			</Alert>

			<div style={{ opacity: 0.5, pointerEvents: 'none' }}>
				<Statistics />

				<Row>
					<Col lg={4}>
						<Status />
					</Col>
					<Col lg={8}>
						<Tasks />
					</Col>
				</Row>

				<Row>
					<Col xs={12}>
						<TasksChart />
					</Col>
				</Row>

				<Row>
					<Col xl={5}>
						<Activity />
					</Col>
					<Col xl={7}>
						<Calendar />
					</Col>
				</Row>
			</div>
		</>
	);
};

export default ProjectDashboard;
