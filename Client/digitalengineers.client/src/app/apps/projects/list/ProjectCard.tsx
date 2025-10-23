import {Link} from "react-router";

import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import type { Project } from '../types';

// images
import avatar1 from '@/assets/images/users/avatar-1.jpg';
import avatar2 from '@/assets/images/users/avatar-7.jpg';
import avatar3 from '@/assets/images/users/avatar-8.jpg';

const ProjectCard = ({ project }: { project: Project }) => {
	return (
		<Card className="d-block">
			{project.image && (
				<>
					<img className="card-img-top" src={project.image} alt="project" height={186} width={371} />
					<div className="card-img-overlay">
						<div
							className={classNames(
								'badge',
								{
									'bg-success': project.state === 'Finished',
									'bg-secondary text-light': project.state === 'Ongoing',
									'bg-warning': project.state === 'Planned',
								},
								'p-1'
							)}
						>
							{project.state}
						</div>
					</div>
				</>
			)}

			<CardBody className={project.image ? 'position-relative' : ''}>
				{!project.image && (
					<Dropdown className="card-widgets" align="end">
						<DropdownToggle variant="link" as="a" className="card-drop arrow-none cursor-pointer p-0 shadow-none">
							<i className="ri-more-fill"></i>
						</DropdownToggle>

						<DropdownMenu>
							<DropdownItem>
								<i className="mdi mdi-pencil me-1"></i>Edit
							</DropdownItem>
							<DropdownItem>
								<i className="mdi mdi-delete me-1"></i>Delete
							</DropdownItem>
							<DropdownItem>
								<i className="mdi mdi-email-outline me-1"></i>Invite
							</DropdownItem>
							<DropdownItem>
								<i className="mdi mdi-exit-to-app me-1"></i>Leave
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				)}

				<h4 className="mt-0">
					<Link to="/apps/projects/details" className="text-title">
						{project.title}
					</Link>
				</h4>

				{!project.image && (
					<div
						className={classNames('badge', {
							'bg-success': project.state === 'Finished',
							'bg-secondary text-light': project.state === 'Ongoing',
							'bg-warning': project.state === 'Planned',
						})}
					>
						{project.state}
					</div>
				)}

				{project.shortDesc && (
					<p className="text-muted font-13 my-3">
						{project.shortDesc}...
						<Link to="" className="fw-bold text-muted">
							view more
						</Link>
					</p>
				)}

				<p className="mb-1">
					<span className="pe-2 text-nowrap mb-2 d-inline-block">
						<i className="mdi mdi-format-list-bulleted-type text-muted me-1"></i>
						<b>{project.totalTasks}</b> Tasks
					</span>
					<span className="text-nowrap mb-2 d-inline-block">
						<i className="mdi mdi-comment-multiple-outline text-muted me-1"></i>
						<b>{project.totalComments}</b> Comments
					</span>
				</p>
				<div>
					<Link to="" data-toggle="tooltip" data-placement="top" title="" data-original-title="Mat Helme" className="d-inline-block me-1">
						<img src={avatar3} className="rounded-circle avatar-xs" alt="friend" />
					</Link>

					<Link to="" data-toggle="tooltip" data-placement="top" title="" data-original-title="Michael Zenaty" className="d-inline-block me-1">
						<img src={avatar1} className="rounded-circle avatar-xs" alt="friend" />
					</Link>

					<Link to="" data-toggle="tooltip" data-placement="top" title="" data-original-title="James Anderson" className="d-inline-block">
						<img src={avatar2} className="rounded-circle avatar-xs" alt="friend" />
					</Link>
					{project.totalMembers - 3 > 0 && (
						<Link to="" className="d-inline-block text-muted fw-bold ms-2">
							+{project.totalMembers - 3} more
						</Link>
					)}
				</div>

				{project.image && (
					<>
						<p className="mt-3 mb-2 fw-bold">
							Progress <span className="float-end">{project.progress}%</span>
						</p>
						{project.progress < 30 && <ProgressBar now={project.progress} className="progress-sm" />}
						{project.progress > 30 && project.progress < 100 && <ProgressBar now={project.progress} className="progress-sm" />}
						{project.progress === 100 && <ProgressBar now={project.progress} className="progress-sm" />}
					</>
				)}
			</CardBody>

			{!project.image && (
				<ul className="list-group list-group-flush">
					<li className="list-group-item p-3">
						<p className="mb-2 fw-bold">
							Progress <span className="float-end">{project.progress}%</span>
						</p>

						{project.progress < 30 && <ProgressBar now={project.progress} className="progress-sm" />}
						{project.progress > 30 && project.progress < 100 && <ProgressBar now={project.progress} className="progress-sm" />}
						{project.progress === 100 && <ProgressBar now={project.progress} className="progress-sm" />}
					</li>
				</ul>
			)}
		</Card>
	);
};

export default ProjectCard;
