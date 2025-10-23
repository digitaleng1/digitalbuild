import PageBreadcrumb from '@/components/PageBreadcrumb';
import AllWizard from "@/app/ui/forms/wizard/AllWizard";

const WizardForm = () => {
	return (
		<>
			<PageBreadcrumb title="Form Wizard" subName="Forms" />

			<AllWizard />
		</>
	);
};

export default WizardForm;
