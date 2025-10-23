import { Col, Row } from 'react-bootstrap';
import RevenueStatistics from './RevenueStatistics';

import Calendar from './Calendar';
import { clients, progressDetails, projectsData, tasks } from './data';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import Projects from "@/app/apps/crm/management/Projects/Projects";
import ClientWidget from "@/app/apps/crm/management/ClientWidget";
import MonthlyProgress from "@/app/apps/crm/management/MonthlyProgress";
import TaskStatus from "@/app/apps/crm/management/TaskStatus";





const ManagementCRM = () => {
	return (
		<>
			<PageBreadcrumb title="Management" subName="CRM" />

			<Row>
				<Col xxl={6}>
					<RevenueStatistics />
				</Col>
				<Col xxl={6}>
					<Projects projectsData={projectsData} />
				</Col>
			</Row>

			<h4 className="page-title mb-3">Recently Updated Clients</h4>

			<Row className="row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-5">
				<ClientWidget clients={clients} />
			</Row>

			<Row>
				<Col xxl={6}>
					<MonthlyProgress progressDetails={progressDetails} />
				</Col>
				<Col xxl={3} md={6}>
					<TaskStatus tasks={tasks} />
				</Col>
				<Col xxl={3} md={6}>
					<Calendar />
				</Col>
			</Row>
		</>
	);
};

export default ManagementCRM;
