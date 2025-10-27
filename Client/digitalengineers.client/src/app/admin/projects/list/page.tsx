import PageBreadcrumb from '@/components/PageBreadcrumb';
import { ProjectList } from '@/app/shared/components/projects';

const AdminProjectList = () => {
	return (
		<>
			<PageBreadcrumb title="All Projects" subName="Admin" />
			
			<ProjectList 
				basePath="/admin/projects"
				showCreateButton={false}
				showFilters={true}
			/>
		</>
	);
};

export default AdminProjectList;
