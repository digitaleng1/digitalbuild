import { useState, useMemo, useCallback } from 'react';
import { Button, Col, FormGroup, FormLabel, Row, Alert } from 'react-bootstrap';
import { useWizard } from 'react-use-wizard';
import { Form as RHForm, TextInput } from '@/components/Form';
import { useFormContext } from 'react-hook-form';
import SimpleMDEReact, { type SimpleMDEReactProps } from 'react-simplemde-editor';
import * as yup from 'yup';
import { useProjectWizard } from './ProjectWizardContext';
import FileUploader from '@/components/FileUploader';
import ThumbnailUploader from '@/components/ThumbnailUploader';

// styles
import 'easymde/dist/easymde.min.css';

const Step3DetailsDocuments = () => {
	const { previousStep } = useWizard();
	const { formData, isSubmitting, submitProject } = useProjectWizard();
	const [files, setFiles] = useState<File[]>(formData.files);
	const [thumbnail, setThumbnail] = useState<File | null>(formData.thumbnail);

	const schema = useMemo(
		() =>
			yup.object().shape({
				name: yup
					.string()
					.required('Please enter Project Title')
					.min(3, 'Project title must be at least 3 characters'),
				description: yup
					.string()
					.required('Please enter Project Description')
					.min(50, 'Project description must be at least 50 characters'),
			}),
		[]
	);

	const handleSubmit = useCallback(
		async (values: Record<string, string>) => {
			await submitProject({
				name: values.name,
				description: values.description,
				files,
				thumbnail,
			});
		},
		[files, thumbnail, submitProject]
	);

	return (
		<>
			<Row>
				<Col>
					<RHForm onSubmit={handleSubmit} schema={schema} defaultValues={{ name: formData.name, description: formData.description }}>
						<FormFields files={files} setFiles={setFiles} thumbnail={thumbnail} setThumbnail={setThumbnail} />
					</RHForm>
				</Col>
			</Row>
		</>
	);
};

const FormFields = ({
	files,
	setFiles,
	thumbnail,
	setThumbnail,
}: {
	files: File[];
	setFiles: (files: File[]) => void;
	thumbnail: File | null;
	setThumbnail: (file: File | null) => void;
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

	const handleThumbnailChange = useCallback(
		(files: File[]) => {
			setThumbnail(files[0] || null);
		},
		[setThumbnail]
	);

	const thumbnailFiles = thumbnail ? [thumbnail] : [];

	return (
		<>
			<Row className="mb-3">
				<Col lg={8}>
					<TextInput
						type="text"
						name="name"
						label="Project Title"
						placeholder="Enter project title"
						containerClass="mb-0"
						key="name"
					/>
				</Col>
				<Col lg={4}>
					<FormLabel>Project Thumbnail (Optional)</FormLabel>
					<ThumbnailUploader value={thumbnailFiles} onChange={handleThumbnailChange} />
				</Col>
			</Row>

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

			<FileUploader
				label="Project Documents (Optional)"
				helpText="Upload project documents, plans, specifications, or any relevant files"
				maxFiles={10}
				maxFileSize={10}
				acceptedFileTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg', '.dwg']}
				onFilesChange={setFiles}
				value={files}
				showFileList={true}
			/>

			<Alert variant="info" className="mt-3 mb-3">
				<i className="mdi mdi-information-outline me-1"></i>
				<strong>Note:</strong> All uploaded files will be securely stored and only accessible to you and assigned specialists.
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
