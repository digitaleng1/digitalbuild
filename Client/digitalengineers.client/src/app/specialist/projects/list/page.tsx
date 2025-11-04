import PageBreadcrumb from '@/components/PageBreadcrumb';
import { ProjectList } from '@/app/shared/components/projects';

const ListProject = () => {
	return (
		<>
			<PageBreadcrumb title="Project List" subName="Projects" />
			
			<ProjectList 
				basePath="/specialist/projects"
				showCreateButton={false}
				emptyTitle="No Assigned Projects"
				emptyDescription="You don't have any assigned projects yet."
			/>
		</>
	);
};

export default ListProject;
