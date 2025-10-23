import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import Attachments from './Attachments';
import Comments from './Comments';
import Task from './Task';




const DetailsTask = () => {
	return (
		<>
			<PageBreadcrumb title="Task Detail" subName="Tasks" />
			<Row>
				<Col xxl={8} xl={7}>
					<Task />
					<Comments />
				</Col>
				<Col xxl={4} xl={5}>
					<Attachments />
				</Col>
			</Row>
		</>
	);
};

export default DetailsTask;
