import { useCallback, useMemo, useState } from 'react';
import { Button, Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useWizard } from 'react-use-wizard';
import { TextInput, Form as RHForm } from '@/components/Form';
import * as yup from 'yup';
import { useProjectWizard } from './ProjectWizardContext';
import ProfessionalTypeSelector from './ProfessionalTypeSelector';

const Step1TitleProfessionals = () => {
	const { nextStep } = useWizard();
	const { formData, updateFormData } = useProjectWizard();
	const [selectedTypes, setSelectedTypes] = useState<number[]>(formData.professionalTypeIds);

	const schema = useMemo(
		() =>
			yup.object().shape({
				name: yup.string().required('Please enter Project Title'),
			}),
		[]
	);

	const handleSubmit = useCallback(
		(values: Record<string, string>) => {
			if (selectedTypes.length === 0) {
				alert('Please select at least one professional type');
				return;
			}
			updateFormData({
				name: values.name,
				professionalTypeIds: selectedTypes,
			});
			nextStep();
		},
		[selectedTypes, nextStep, updateFormData]
	);

	return (
		<>
			<Row>
				<Col>
					<RHForm onSubmit={handleSubmit} schema={schema} defaultValues={{ name: formData.name }}>
						<Row>
							<Col xl={12}>
								<TextInput
									type="text"
									name="name"
									label="Project Title"
									placeholder="Enter project title"
									containerClass="mb-3"
									key="name"
								/>

								<FormGroup className="mb-3">
									<FormLabel>
										Types of Professionals Needed <span className="text-danger">*</span>
									</FormLabel>
									<ProfessionalTypeSelector value={selectedTypes} onChange={setSelectedTypes} />
								</FormGroup>
							</Col>
						</Row>

						<Row className="mt-3">
							<Col>
								<div className="float-end">
									<Button type="submit" variant="primary">
										Next <i className="mdi mdi-arrow-right ms-1"></i>
									</Button>
								</div>
							</Col>
						</Row>
					</RHForm>
				</Col>
			</Row>
		</>
	);
};

export default Step1TitleProfessionals;
