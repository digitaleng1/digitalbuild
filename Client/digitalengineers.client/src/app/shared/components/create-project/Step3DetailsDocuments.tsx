import { useState, useMemo, useCallback } from 'react';
import { Button, Col, FormGroup, FormLabel, Row, Alert } from 'react-bootstrap';
import { useWizard } from 'react-use-wizard';
import { Form as RHForm } from '@/components/Form';
import * as yup from 'yup';
import { useProjectWizard } from './ProjectWizardContext';
import TagInput from '@/components/TagInput';

const Step3DetailsDocuments = () => {
	const { previousStep } = useWizard();
	const { formData, updateFormData, isSubmitting, submitProject } = useProjectWizard();
	const [description, setDescription] = useState(formData.description);
	const [skills, setSkills] = useState<string[]>(formData.skills);
	const [documentUrls, setDocumentUrls] = useState<string[]>(formData.documentUrls);

	const characterCount = description.length;
	const minCharacters = 50;
	const isDescriptionValid = characterCount >= minCharacters;

	const schema = useMemo(
		() =>
			yup.object().shape({
				description: yup
					.string()
					.required('Please enter Project Description')
					.min(minCharacters, `Project description must be at least ${minCharacters} characters`),
			}),
		[]
	);

	const handleSubmit = useCallback(
		async (values: Record<string, string>) => {
			updateFormData({
				description: values.description,
				skills,
				documentUrls,
			});

			await submitProject();
		},
		[skills, documentUrls, updateFormData, submitProject]
	);

	const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(e.target.value);
	}, []);

	return (
		<>
			<Row>
				<Col>
					<RHForm onSubmit={handleSubmit} schema={schema} defaultValues={{ description }}>
						<FormGroup className="mb-3">
							<FormLabel>
								Project Description <span className="text-danger">*</span>
							</FormLabel>
							<textarea
								name="description"
								className="form-control"
								rows={6}
								placeholder="Provide a detailed description of your project (minimum 50 characters)"
								value={description}
								onChange={handleDescriptionChange}
							/>
							<div className="mt-1">
								<small className={characterCount < minCharacters ? 'text-danger' : 'text-muted'}>
									{characterCount}/{minCharacters} characters minimum
								</small>
							</div>
							{characterCount > 0 && !isDescriptionValid && (
								<small className="text-danger d-block mt-1">
									Project description must be at least {minCharacters} characters
								</small>
							)}
						</FormGroup>

						<TagInput
							label="Preferred Skills/Experience (Optional)"
							placeholder="Type a skill and click + (e.g., lighting, HVAC, power systems)"
							helpText="Add skills that would be beneficial for this project"
							value={skills}
							onChange={setSkills}
						/>

						<TagInput
							label="Project Document Links (Optional)"
							placeholder="Paste a document link and click +"
							helpText="Add links to project documents, plans, or specifications"
							value={documentUrls}
							onChange={setDocumentUrls}
						/>

						<Alert variant="info" className="mb-3">
							<i className="mdi mdi-information-outline me-1"></i>
							<strong>Note:</strong> Please ensure document links are accessible and share access to
							mgofman@digitalengineers.io
						</Alert>

						<Row className="mt-3">
							<Col>
								<div className="float-start">
									<Button variant="light" onClick={previousStep} type="button" disabled={isSubmitting}>
										<i className="mdi mdi-arrow-left me-1"></i> Previous
									</Button>
								</div>
								<div className="float-end">
									<Button type="submit" variant="success" disabled={isSubmitting}>
										{isSubmitting ? (
											<>
												<span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
												Submitting...
											</>
										) : (
											'Submit Project'
										)}
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

export default Step3DetailsDocuments;
