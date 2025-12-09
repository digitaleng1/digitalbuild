import PageBreadcrumb from '@/components/PageBreadcrumb';
import { ProjectList } from '@/app/shared/components/projects';
import useProjects from '@/app/shared/hooks/useProjects';

const ListProject = () => {
	const { projects, loading, error } = useProjects();

	return (
		<>
			<PageBreadcrumb title="Project List" subName="Projects" />
			
			<ProjectList 
				createProjectUrl="/client/projects/create"
				showCreateButton={true}
				projects={projects}
				loading={loading}
				error={error}
			/>
		</>
	);
};

export default ListProject;
