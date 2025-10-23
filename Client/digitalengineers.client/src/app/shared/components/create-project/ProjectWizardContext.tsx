import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ProjectFormData } from '@/types/project';
import projectService from '@/services/projectService';
import { useNavigate } from 'react-router-dom';

interface ProjectWizardContextType {
	formData: ProjectFormData;
	updateFormData: (data: Partial<ProjectFormData>) => void;
	resetForm: () => void;
	isSubmitting: boolean;
	submitProject: () => Promise<void>;
}

const initialFormData: ProjectFormData = {
	name: '',
	professionalTypeIds: [],
	streetAddress: '',
	city: '',
	state: '',
	zipCode: '',
	projectScope: '1-3',
	description: '',
	skills: [],
	documentUrls: [],
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

	const updateFormData = useCallback((data: Partial<ProjectFormData>) => {
		setFormData((prev) => ({ ...prev, ...data }));
	}, []);

	const resetForm = useCallback(() => {
		setFormData(initialFormData);
	}, []);

	const submitProject = useCallback(async () => {
		setIsSubmitting(true);
		try {
			const result = await projectService.createProject(formData);
			console.log('Project created:', result);
			resetForm();
			navigate('/client/projects');
		} catch (error) {
			console.error('Failed to create project:', error);
			alert('Failed to create project. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, navigate, resetForm]);

	const value = {
		formData,
		updateFormData,
		resetForm,
		isSubmitting,
		submitProject,
	};

	return <ProjectWizardContext.Provider value={value}>{children}</ProjectWizardContext.Provider>;
};
