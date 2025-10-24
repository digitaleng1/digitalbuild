import { Card, CardBody, ProgressBar } from 'react-bootstrap';
import clsx from 'clsx';
import { useWizard, Wizard } from 'react-use-wizard';
import Step1TitleProfessionals from './Step1TitleProfessionals';
import Step2LocationScope from './Step2LocationScope';
import Step3DetailsDocuments from './Step3DetailsDocuments';
import { ProjectWizardProvider } from './ProjectWizardContext';

interface WizardHeaderProps {
	withProgress?: boolean;
}

const WizardHeader = ({ withProgress }: WizardHeaderProps) => {
	const { activeStep, stepCount } = useWizard();

	return (
		<>
			<ul className="nav nav-pills nav-justified form-wizard-header mb-3">
				<li className="nav-item">
					<div
						className={clsx('nav-link rounded-0 py-2', activeStep === 0 && 'active')}
						style={{ cursor: 'default' }}
					>
						<span className="d-none d-sm-inline">Professionals</span>
						<span className="d-sm-none">Step 1</span>
					</div>
				</li>
				<li className="nav-item">
					<div
						className={clsx('nav-link rounded-0 py-2', activeStep === 1 && 'active')}
						style={{ cursor: 'default' }}
					>
						<span className="d-none d-sm-inline">Location & Scope</span>
						<span className="d-sm-none">Step 2</span>
					</div>
				</li>
				<li className="nav-item">
					<div
						className={clsx('nav-link rounded-0 py-2', activeStep === 2 && 'active')}
						style={{ cursor: 'default' }}
					>
						<span className="d-none d-sm-inline">Project & Documents</span>
						<span className="d-sm-none">Step 3</span>
					</div>
				</li>
			</ul>
			{withProgress && (
				<ProgressBar
					variant="info"
					striped
					animated
					now={(activeStep + 1) * (100 / stepCount)}
					className="mb-3"
					style={{ height: '6px' }}
				/>
			)}
		</>
	);
};

const CreateProjectWizard = () => {
	return (
		<ProjectWizardProvider>
			<Card>
				<CardBody>
					<h4 className="header-title mb-3">Post a New Project</h4>
					<Wizard header={<WizardHeader withProgress />}>
						<Step1TitleProfessionals />
						<Step2LocationScope />
						<Step3DetailsDocuments />
					</Wizard>
				</CardBody>
			</Card>
		</ProjectWizardProvider>
	);
};

export default CreateProjectWizard;
