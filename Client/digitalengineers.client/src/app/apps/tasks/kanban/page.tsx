import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import BreadcrumbChild from './BreadcrumbChild';
import KanbanBoard from './KanbanBoard';




const KanbanTask = () => {
	return (
		<>
			<PageBreadcrumb title="Kanban Board" subName="Tasks">
				<BreadcrumbChild />
			</PageBreadcrumb>

			<Row>
				<Col>
					<KanbanBoard />
				</Col>
			</Row>
		</>
	);
};

export default KanbanTask;
