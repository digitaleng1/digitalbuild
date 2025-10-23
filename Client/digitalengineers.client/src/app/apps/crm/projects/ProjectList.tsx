
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import type { Project } from './types';
import CardTitle from '@/components/CardTitle';
import AddNewProject from './AddNewProject';
import {Link} from "react-router";

type ProjectListProps = {
	projectList: Project[];
};

const ProjectList = ({ projectList }: ProjectListProps) => {
	return (
		<>
			<Row>
				{(projectList || []).map((project, index) => {
					return (
						<Col key={index.toString()} sm={6} xl={3} className="mb-3">
							<Card className="mb-0 h-100">
								<CardBody>
									<CardTitle
										containerClass="d-flex align-items-start justify-content-between"
										title={
											<div>
												<h4 className="header-title">{project.title}</h4>
												<h5 className="text-muted fw-normal mt-0 text-truncate" title="Campaign Sent">
													{project.task}
												</h5>
											</div>
										}
										icon="mdi mdi-dots-horizontal"
										menuItems={[
											{ label: 'Add Card', icon: 'mdi mdi-plus-circle' },
											{ label: 'Copy List', icon: 'mdi mdi-content-copy' },
											{ label: 'Edit', icon: 'mdi mdi-square-edit-outline' },
											{
												label: 'Delete',
												icon: 'mdi mdi-trash-can-outline',
												variant: 'text-danger',
												hasDivider: true,
											},
										]}
									/>

									<div className="d-flex align-items-center mt-3">
										<div className="flex-shrink-0">
											<h5 className="font-13 text-muted my-0">
												<i className="mdi mdi-clock-outline"></i>
												{project.created_on}
											</h5>
										</div>
										<div className="flex-grow-1 ms-2"></div>
										<div className="text-end multi-user">
											{(project.members || []).map((member, index) => {
												return (
													<Link key={index.toString()} to="" className="d-inline-block">
														<img src={member} className="rounded-circle avatar-xs" alt="friend" />
													</Link>
												);
											})}
										</div>
									</div>
								</CardBody>
							</Card>
						</Col>
					);
				})}
				<Col sm={6} xl={3} className="mb-3">
					<AddNewProject />
				</Col>
			</Row>
		</>
	);
};

export default ProjectList;
