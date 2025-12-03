import { Row, Col, Alert } from 'react-bootstrap';
import Statistics from './Statistics';
import CampaignsChart from './CampaignsChart';
import RevenueChart from './RevenueChart';
import Performers from './Performers';
import Leads from './Leads';
import CampaignWidget from './CampaignWidget';
import { topPerformanceData, recentLeads } from './data';
import PageBreadcrumb from '@/components/PageBreadcrumb';

import { TodoList } from '@/components/TodoList';

const CRMDashboard = () => {
	return (
		<>
			<PageBreadcrumb title="CRM" subName="Dashboard" />

			<Alert variant="info" className="mb-3">
				<i className="mdi mdi-tools me-2"></i>
				<strong>Under Construction</strong> - This dashboard is currently being developed and may not display accurate data.
			</Alert>

			<div style={{ opacity: 0.5, pointerEvents: 'none' }}>
				<Statistics />

				<Row>
					<Col lg={5}>
						<CampaignsChart />
					</Col>
					<Col lg={7}>
						<RevenueChart />
					</Col>
				</Row>

				<Row>
					<Col xl={4} lg={12}>
						<Performers topPerformanceData={topPerformanceData} />
					</Col>
					<Col xl={4} lg={6}>
						<Leads recentLeads={recentLeads} />
					</Col>
					<Col xl={4} lg={6}>
						<CampaignWidget />
						<TodoList height="243px" />
					</Col>
				</Row>
			</div>
		</>
	);
};

export default CRMDashboard;
