import { useState, useMemo, useCallback } from 'react';
import { Button, Col, FormGroup, FormLabel, Row, Alert } from 'react-bootstrap';
import { useWizard } from 'react-use-wizard';
import { Form as RHForm } from '@/components/Form';
import { useFormContext } from 'react-hook-form';
import SimpleMDEReact, { type SimpleMDEReactProps } from 'react-simplemde-editor';
import * as yup from 'yup';
import { useProjectWizard } from './ProjectWizardContext';
import TagInput from '@/components/TagInput';

// styles
import 'easymde/dist/easymde.min.css';

const Step3DetailsDocuments = () => {
	const { previousStep } = useWizard();
	const { formData, updateFormData, isSubmitting, submitProject } = useProjectWizard();
	const [documentUrls, setDocumentUrls] = useState<string[]>(formData.documentUrls);

	const schema = useMemo(
		() =>
			yup.object().shape({
				description: yup
					.string()
					.required('Please enter Project Description')
					.min(50, 'Project description must be at least 50 characters'),
			}),
		[]
	);

	const handleSubmit = useCallback(
		async (values: Record<string, string>) => {
			updateFormData({
				description: values.description,
				documentUrls,
			});

			await submitProject();
		},
		[documentUrls, updateFormData, submitProject]
	);

	return (
		<>
			<Row>
				<Col>
					<RHForm onSubmit={handleSubmit} schema={schema} defaultValues={{ description: formData.description }}>
						<FormFields documentUrls={documentUrls} setDocumentUrls={setDocumentUrls} />
					</RHForm>
				</Col>
			</Row>
		</>
	);
};

const FormFields = ({
	documentUrls,
	setDocumentUrls,
}: {
	documentUrls: string[];
	setDocumentUrls: (urls: string[]) => void;
}) => {
	const { previousStep } = useWizard();
	const { isSubmitting } = useProjectWizard();
	const { setValue, watch, formState: { errors } } = useFormContext();

	const description = watch('description', '');
	const characterCount = description?.length || 0;
	const minCharacters = 50;

	const editorOptions: SimpleMDEReactProps['options'] = useMemo(
		() => ({
			spellChecker: false,
			placeholder: 'Provide a detailed description of your project (minimum 50 characters)...',
			status: false,
			toolbar: [
				'bold',
				'italic',
				'heading',
				'|',
				'quote',
				'unordered-list',
				'ordered-list',
				'|',
				'link',
				'|',
				'preview',
				'guide',
			],
			minHeight: '200px',
		}),
		[]
	);

	const handleEditorChange = useCallback(
		(value: string) => {
			setValue('description', value, { shouldValidate: true });
		},
		[setValue]
	);

	return (
		<>
			<FormGroup className="mb-3">
				<FormLabel>
					Project Description <span className="text-danger">*</span>
				</FormLabel>
				<SimpleMDEReact
					value={description}
					onChange={handleEditorChange}
					options={editorOptions}
				/>
				<div className="mt-1">
					<small className={characterCount < minCharacters ? 'text-danger' : 'text-muted'}>
						{characterCount}/{minCharacters} characters minimum
					</small>
				</div>
				{errors.description && (
					<small className="text-danger d-block mt-1">
						{errors.description.message as string}
					</small>
				)}
			</FormGroup>

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
		</>
	);
};

export default Step3DetailsDocuments;
