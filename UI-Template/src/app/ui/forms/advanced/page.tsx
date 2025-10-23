
import PageBreadcrumb from '@/components/PageBreadcrumb';
import AllAdvancedElements from './AllAdvancedElements';

// styles
import 'react-bootstrap-typeahead/css/Typeahead.css';



const FormAdvanced = () => {
	return (
		<>
			<PageBreadcrumb title="Form Advanced" subName="Form" />

			<AllAdvancedElements />
		</>
	);
};

export default FormAdvanced;
