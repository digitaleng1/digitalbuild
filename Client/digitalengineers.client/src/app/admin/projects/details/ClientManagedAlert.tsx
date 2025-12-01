import { Alert } from 'react-bootstrap';
import { ProjectManagementType, ProjectStatus, type ProjectDetailsDto } from '@/types/project';

interface ClientManagedAlertProps {
	project: ProjectDetailsDto;
}

const ClientManagedAlert = ({ project }: ClientManagedAlertProps) => {
	console.log(project);
	// Show alert only for QuotePending + ClientManaged
	if (project.status !== ProjectStatus.QuotePending || 
	    project.managementType !== ProjectManagementType.ClientManaged) {
		return null;
	}

	return (
		<Alert variant="info" className="mb-4">
			<div className="d-flex align-items-start">
				<i className="mdi mdi-account-check fs-2 me-3"></i>
				<div className="flex-grow-1">
					<h4 className="alert-heading mb-2">
						<i className="mdi mdi-information-outline me-2"></i>
						Client Requested Self-Management
					</h4>
					<p className="mb-3">
						The client has selected <strong>Client Managed</strong> project type. 
						This means they want to manage the project and specialists themselves.
					</p>
					
					<hr className="my-3" />

					<div className="mb-0">
						<h6 className="mb-2">
							<i className="mdi mdi-lightbulb-outline me-2"></i>
							What this means:
						</h6>
						<ul className="mb-0 ps-3">
							<li className="mb-1">
								Client will directly communicate with specialists
							</li>
							<li className="mb-1">
								You can still override this by unchecking the switch below
							</li>
							<li className="mb-1">
								Consider client's preference when preparing the quote
							</li>
						</ul>
					</div>
				</div>
			</div>
		</Alert>
	);
};

export default ClientManagedAlert;
