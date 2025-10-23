
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { useProjectGannt } from '../hooks';
import {type GanttProjectItem } from '../types';
import Project from './Project';
import { projects } from './data';

const ProjectList = () => {
	const { selectedProject, onSelectProject } = useProjectGannt();

	return (
		<SimplebarReactClient style={{ maxHeight: '535px', width: '100%' }}>
			{projects.map((project, index) => {
				return (
					<Project
						project={project}
						key={index.toString()}
						selectedProject={selectedProject}
						onSelectProject={(p: GanttProjectItem) => onSelectProject(p)}
					/>
				);
			})}
		</SimplebarReactClient>
	);
};

export default ProjectList;
