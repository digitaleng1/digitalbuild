import PageBreadcrumb from '@/components/PageBreadcrumb';
import { ProjectList } from '@/app/shared/components/projects';

const ListProject = () => {
	return (
		<>
			<PageBreadcrumb title="Project List" subName="Projects" />
			
			<ProjectList 
				basePath="/client/projects"
				createProjectUrl="/client/projects/create"
				showCreateButton={true}
			/>
		</>
	);
};

export default ListProject;
