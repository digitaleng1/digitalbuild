import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import {Link} from "react-router";
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ProjectCard from './ProjectCard';
import { projects } from './data';




const ListProject = () => {
	return (
		<>
			<PageBreadcrumb title="Project List" subName="Projects" />

			<Row className="mb-2">
				<Col sm={4}>
					<Link to="/apps/projects/create" className="rounded-pill mb-3 btn btn-danger">
						<i className="mdi mdi-plus"></i> Create Project
					</Link>
				</Col>
				<Col sm={8}>
					<div className="text-sm-end">
						<div className="btn-group mb-3">
							<Button variant="primary">All</Button>
						</div>
						<ButtonGroup className="mb-3 ms-1">
							<Button variant="light">Ongoing</Button>
							<Button variant="light">Finished</Button>
						</ButtonGroup>

						<ButtonGroup className="mb-3 ms-2 d-none d-sm-inline-block">
							<Button variant="secondary">
								<i className="ri-function-line"></i>
							</Button>
						</ButtonGroup>
						<ButtonGroup className="mb-3 d-none d-sm-inline-block">
							<Button variant="link" className="text-muted">
								<i className="ri-list-check-2"></i>
							</Button>
						</ButtonGroup>
					</div>
				</Col>
			</Row>

			<Row>
				{projects.map((project) => {
					return (
						<Col md={6} xxl={3} key={'proj-' + project.id}>
							<ProjectCard project={project} />
						</Col>
					);
				})}
			</Row>
		</>
	);
};

export default ListProject;
