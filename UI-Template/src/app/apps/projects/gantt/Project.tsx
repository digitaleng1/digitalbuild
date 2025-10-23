import classNames from 'classnames';
import type{ GanttProjectItem } from '../types';
import {Link} from "react-router";

type ProjectProps = {
	project: GanttProjectItem;
	onSelectProject: (p: GanttProjectItem) => void;
	selectedProject: GanttProjectItem;
};

const Project = ({ project, onSelectProject, selectedProject }: ProjectProps) => {
	return (
		<Link to="" className="text-body" onClick={() => onSelectProject(project)}>
			<div
				className={classNames('d-flex', 'p-2', {
					'bg-light': selectedProject && selectedProject.id === project.id,
				})}
			>
				<div className="avatar-sm">
					{project.status === 'On-Track' && (
						<span className="avatar-title bg-success-lighten rounded-circle text-success">
							<i className={classNames(project.icon, 'font-24')}></i>
						</span>
					)}

					{project.status === 'Locked' && (
						<span className="avatar-title bg-warning-lighten rounded-circle text-warning">
							<i className={classNames(project.icon, 'font-24')}></i>
						</span>
					)}

					{project.status === 'Delayed' && (
						<span className="avatar-title bg-danger-lighten rounded-circle text-danger">
							<i className={classNames(project.icon, 'font-24')}></i>
						</span>
					)}
				</div>
				<div className="ms-2">
					<h5 className="mt-0 mb-0">
						{project.name}
						<span
							className={classNames('badge', 'ms-1', {
								'badge-success-lighten': project.status === 'On-Track',
								'badge-warning-lighten': project.status === 'Locked',
								'badge-danger-lighten': project.status === 'Delayed',
							})}
						>
							{project.status}
						</span>
					</h5>
					<p className="mt-1 mb-0 text-muted">ID: {project.id}</p>
				</div>
			</div>
		</Link>
	);
};

export default Project;
