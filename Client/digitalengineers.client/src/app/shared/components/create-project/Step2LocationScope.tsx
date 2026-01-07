import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Col, FormGroup, FormLabel, Row, Form } from 'react-bootstrap';
import { useWizard } from 'react-use-wizard';
import { TextInput, SelectInput, Form as RHForm } from '@/components/Form';
import * as yup from 'yup';
import lookupService from '@/services/lookupService';
import type { State } from '@/types/lookup';
import { useProjectWizard } from './ProjectWizardContext';

const Step2LocationScope = () => {
	const { previousStep, nextStep } = useWizard();
	const { formData, updateFormData } = useProjectWizard();
	const [usStates, setUSStates] = useState<State[]>([]);
	const [loading, setLoading] = useState(true);
	const [projectScope, setProjectScope] = useState<number>(formData.projectScope || 1);

	const schema = useMemo(
		() =>
			yup.object().shape({
				streetAddress: yup.string().required('Please enter Street Address'),
				city: yup.string().required('Please enter City'),
				state: yup.string().required('Please select State'),
				zipCode: yup
					.string()
					.required('Please enter ZIP Code')
					.matches(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP Code'),
			}),
		[]
	);

	useEffect(() => {
		const loadStates = async () => {
			try {
				const states = await lookupService.getStates();
				setUSStates(states);
			} catch (error) {
				console.error('Failed to load states:', error);
			} finally {
				setLoading(false);
			}
		};

		loadStates();
	}, []);

	const handleSubmit = useCallback(
		(values: Record<string, string>) => {
			updateFormData({
				streetAddress: values.streetAddress,
				city: values.city,
				state: values.state,
				zipCode: values.zipCode,
				projectScope: projectScope as 1 | 2 | 3,
			});
			nextStep();
		},
		[projectScope, nextStep, updateFormData]
	);

	const handleScopeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setProjectScope(Number(e.target.value));
	}, []);

	const defaultValues = useMemo(
		() => ({
			streetAddress: formData.streetAddress,
			city: formData.city,
			state: formData.state,
			zipCode: formData.zipCode,
		}),
		[formData]
	);

	return (
		<>
			<Row>
				<Col>
					<RHForm onSubmit={handleSubmit} schema={schema} defaultValues={defaultValues}>
						<h5 className="mb-3">Project Location</h5>

						<Row>
							<Col xl={12}>
								<TextInput
									type="text"
									name="streetAddress"
									label="Street Address"
									placeholder="Enter street address"
									containerClass="mb-3"
									key="streetAddress"
								/>
							</Col>
						</Row>

						<Row>
							<Col xl={6}>
								<TextInput
									type="text"
									name="city"
									label="City"
									placeholder="Enter city"
									containerClass="mb-3"
									key="city"
								/>
							</Col>

							<Col xl={6}>
								<SelectInput name="state" label="State" containerClass="mb-3">
									<option value="">Select State</option>
									{loading ? (
										<option disabled>Loading...</option>
									) : (
										usStates.map((state) => (
											<option key={state.value} value={state.value}>
												{state.label}
											</option>
										))
									)}
								</SelectInput>
							</Col>
						</Row>

						<Row>
							<Col xl={6}>
								<TextInput
									type="text"
									name="zipCode"
									label="ZIP Code"
									placeholder="Enter ZIP code"
									containerClass="mb-3"
									key="zipCode"
								/>
							</Col>
						</Row>

						<h5 className="mb-3 mt-4">Project Scope/Duration</h5>

						<FormGroup className="mb-3">
							<div className="d-flex flex-column gap-2">
								<Form.Check
									type="radio"
									id="scope-1"
									name="projectScope"
									label="1-3 months"
									value="1"
									checked={projectScope === 1}
									onChange={handleScopeChange}
								/>
								<Form.Check
									type="radio"
									id="scope-2"
									name="projectScope"
									label="Less than 6 months"
									value="2"
									checked={projectScope === 2}
									onChange={handleScopeChange}
								/>
								<Form.Check
									type="radio"
									id="scope-3"
									name="projectScope"
									label="Greater than 6 months"
									value="3"
									checked={projectScope === 3}
									onChange={handleScopeChange}
								/>
							</div>
						</FormGroup>

						<Row className="mt-3">
							<Col>
								<div className="float-start">
									<Button variant="light" onClick={previousStep} type="button">
										<i className="mdi mdi-arrow-left me-1"></i> Previous
									</Button>
								</div>
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

export default Step2LocationScope;
