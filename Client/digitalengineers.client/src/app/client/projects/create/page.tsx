import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Col, Row } from 'react-bootstrap';
import { CreateProjectWizard } from '@/app/shared/components/create-project';

const CreateProjects = () => {
	return (
		<>
			<PageBreadcrumb title="Create Project" subName="Projects" />

			<Row>
				<Col>
					<CreateProjectWizard />
				</Col>
			</Row>
		</>
	);
};

export default CreateProjects;
