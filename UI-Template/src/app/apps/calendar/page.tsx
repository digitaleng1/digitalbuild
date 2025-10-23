import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import CalendarPage from './CalendarPage';




const CalendarApp = () => {
	return (
		<>
			<PageBreadcrumb title="Calendar" subName="Apps" />
			<Row>
				<Col>
					<CalendarPage />
				</Col>
			</Row>
		</>
	);
};

export default CalendarApp;
