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
	const { goToStep, activeStep, stepCount } = useWizard();

	return (
		<>
			<ul className="nav nav-pills nav-justified form-wizard-header mb-3">
				<li className="nav-item">
					<button
						onClick={() => goToStep(0)}
						className={clsx('nav-link rounded-0 py-2', activeStep === 0 && 'active')}
						type="button"
					>
						<span className="d-none d-sm-inline">Title & Professionals</span>
						<span className="d-sm-none">Step 1</span>
					</button>
				</li>
				<li className="nav-item">
					<button
						onClick={() => goToStep(1)}
						className={clsx('nav-link rounded-0 py-2', activeStep === 1 && 'active')}
						type="button"
					>
						<span className="d-none d-sm-inline">Location & Scope</span>
						<span className="d-sm-none">Step 2</span>
					</button>
				</li>
				<li className="nav-item">
					<button
						onClick={() => goToStep(2)}
						className={clsx('nav-link rounded-0 py-2', activeStep === 2 && 'active')}
						type="button"
					>
						<span className="d-none d-sm-inline">Details & Documents</span>
						<span className="d-sm-none">Step 3</span>
					</button>
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
