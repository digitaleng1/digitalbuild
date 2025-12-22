import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, FormGroup, FormLabel, Row } from 'react-bootstrap';
import { useWizard } from 'react-use-wizard';
import { Form as RHForm } from '@/components/Form';
import * as yup from 'yup';
import { useProjectWizard } from './ProjectWizardContext';
import ProfessionTypeSelector from './ProfessionTypeSelector';

const Step1TitleProfessionals = () => {
	const { nextStep } = useWizard();
	const { formData, updateFormData } = useProjectWizard();
	const [selectedProfessionTypeIds, setSelectedProfessionTypeIds] = useState<number[]>(
		formData.professionTypeIds || []
	);
	const [showError, setShowError] = useState(false);

	const schema = useMemo(
		() =>
			yup.object().shape({}),
		[]
	);

	useEffect(() => {
		if (selectedProfessionTypeIds.length > 0) {
			setShowError(false);
		}
	}, [selectedProfessionTypeIds]);

	const handleSubmit = useCallback(
		() => {
			if (selectedProfessionTypeIds.length === 0) {
				setShowError(true);
				return;
			}
			setShowError(false);
			
			updateFormData({
				professionTypeIds: selectedProfessionTypeIds,
			});
			nextStep();
		},
		[selectedProfessionTypeIds, nextStep, updateFormData]
	);

	return (
		<>
			<Row>
				<Col>
					<RHForm onSubmit={handleSubmit} schema={schema}>
						<Row>
							<Col xl={12}>
								<FormGroup className="mb-3">
									<FormLabel>
										Types of Professionals Needed <span className="text-danger">*</span>
									</FormLabel>
									<ProfessionTypeSelector 
										value={selectedProfessionTypeIds} 
										onChange={setSelectedProfessionTypeIds} 
									/>
								</FormGroup>

								{showError && (
									<Alert variant="danger" onClose={() => setShowError(false)} dismissible className="mb-3">
										Please select at least one professional type
									</Alert>
								)}
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
