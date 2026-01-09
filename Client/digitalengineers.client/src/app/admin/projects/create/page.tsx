import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { CreateProjectWizard } from '@/app/shared/components/create-project';

const CreateProjectAdmin = () => {
	return (
		<>
			<PageBreadcrumb title="Create Project for Client" subName="Projects" />

			<Row>
				<Col>
					<CreateProjectWizard />
				</Col>
			</Row>
		</>
	);
};

export default CreateProjectAdmin;
