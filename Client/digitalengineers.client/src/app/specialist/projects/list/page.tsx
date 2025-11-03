import PageBreadcrumb from '@/components/PageBreadcrumb';
import { SpecialistProjectList } from '@/app/shared/components/projects';
import { useAuthContext } from '@/common/context/useAuthContext';
import { Alert } from 'react-bootstrap';

const ListProject = () => {
	const { user } = useAuthContext();

	if (!user?.specialistId) {
		return (
			<>
				<PageBreadcrumb title="Project List" subName="Projects" />
				<Alert variant="warning">
					<Alert.Heading>Specialist Profile Not Found</Alert.Heading>
					<p>Your specialist profile is not set up yet. Please contact support.</p>
				</Alert>
			</>
		);
	}

	return (
		<>
			<PageBreadcrumb title="Project List" subName="Projects" />
			
			<SpecialistProjectList 
				specialistId={user.specialistId}
				basePath="/specialist/projects"
			/>
		</>
	);
};

export default ListProject;
