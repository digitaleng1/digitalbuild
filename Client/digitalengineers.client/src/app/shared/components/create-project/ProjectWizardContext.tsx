import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ProjectFormData } from '@/types/project';
import { ProjectManagementType } from '@/types/project';
import projectService from '@/services/projectService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts';
import { getErrorMessage, getErrorTitle } from '@/utils/errorHandler';

interface ProjectWizardContextType {
	formData: ProjectFormData;
	updateFormData: (data: Partial<ProjectFormData>) => void;
	resetForm: () => void;
	isSubmitting: boolean;
	submitProject: (finalData?: Partial<ProjectFormData>) => Promise<void>;
}

const initialFormData: ProjectFormData = {
	name: '',
	licenseTypeIds: [],
	streetAddress: '',
	city: '',
	state: '',
	zipCode: '',
	projectScope: 1,
	managementType: ProjectManagementType.DigitalEngineersManaged,
	description: '',
	files: [],
	thumbnail: null,
};

const ProjectWizardContext = createContext<ProjectWizardContextType | null>(null);

export const useProjectWizard = () => {
	const context = useContext(ProjectWizardContext);
	if (!context) {
		throw new Error('useProjectWizard must be used within ProjectWizardProvider');
	}
	return context;
};

interface ProjectWizardProviderProps {
	children: ReactNode;
}

export const ProjectWizardProvider = ({ children }: ProjectWizardProviderProps) => {
	const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();
	const { showSuccess, showError } = useToast();

	const updateFormData = useCallback((data: Partial<ProjectFormData>) => {
		setFormData((prev) => ({ ...prev, ...data }));
	}, []);

	const resetForm = useCallback(() => {
		setFormData(initialFormData);
	}, []);

	const submitProject = useCallback(async (finalData?: Partial<ProjectFormData>) => {
		setIsSubmitting(true);
		try {
			const dataToSubmit = finalData ? { ...formData, ...finalData } : formData;
			const result = await projectService.createProject(dataToSubmit);
			console.log('Project created:', result);
			showSuccess(
				'Project Submitted Successfully',
				'Your project has been submitted and is now under review by our specialists. We will contact you shortly.'
			);
			resetForm();
			navigate('/client/projects');
		} catch (error: any) {
			console.error('Failed to create project:', error);
			const errorTitle = getErrorTitle(error);
			const errorMessage = getErrorMessage(error);
			showError(errorTitle, errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, navigate, resetForm, showSuccess, showError]);

	const value = {
		formData,
		updateFormData,
		resetForm,
		isSubmitting,
		submitProject,
	};

	return <ProjectWizardContext.Provider value={value}>{children}</ProjectWizardContext.Provider>;
};
