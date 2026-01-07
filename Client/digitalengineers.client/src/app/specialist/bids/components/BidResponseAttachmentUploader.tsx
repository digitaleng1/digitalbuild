import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import bidService from '@/services/bidService';
import { formatFileSize } from '@/utils/fileUtils';

interface BidResponseAttachmentUploaderProps {
	bidResponseId: number;
	onUploadComplete: () => void;
}

const ALLOWED_FILE_TYPES = [
	'application/pdf',
	'image/jpeg',
	'image/png',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/dwg',
	'application/dxf'
];

const FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.dwg', '.dxf', '.doc', '.docx'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const BidResponseAttachmentUploader: React.FC<BidResponseAttachmentUploaderProps> = ({
	bidResponseId,
	onUploadComplete
}) => {
	const [file, setFile] = useState<File | null>(null);
	const [description, setDescription] = useState('');
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		
		if (!selectedFile) {
			setFile(null);
			return;
		}

		if (selectedFile.size > MAX_FILE_SIZE) {
			setError('File size exceeds 10MB limit');
			setFile(null);
			return;
		}

		if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
			setError(`File type not allowed. Allowed types: ${FILE_EXTENSIONS.join(', ')}`);
			setFile(null);
			return;
		}

		setError(null);
		setFile(selectedFile);
	};

	const handleUpload = async () => {
		if (!file) return;

		setUploading(true);
		setError(null);

		try {
			await bidService.uploadBidResponseAttachment(bidResponseId, { file, description });
			setFile(null);
			setDescription('');
			onUploadComplete();
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
			setError(errorMessage);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="bid-response-attachment-uploader">
			<h5>Upload Supporting Documents</h5>
			<p className="text-muted small">
				Upload files such as detailed proposals, technical drawings, price breakdowns, certificates, or portfolio examples.
			</p>

			{error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

			<Form>
				<Form.Group className="mb-3">
					<Form.Label>Select File</Form.Label>
					<Form.Control
						type="file"
						onChange={handleFileChange}
						accept={FILE_EXTENSIONS.join(',')}
						disabled={uploading}
					/>
					<Form.Text className="text-muted">
						Allowed formats: PDF, Images, DWG, DXF, DOC/DOCX. Max size: 10MB
					</Form.Text>
				</Form.Group>

				{file && (
					<div className="selected-file-info mb-3 p-2 bg-light rounded">
						<strong>Selected:</strong> {file.name} ({formatFileSize(file.size)})
					</div>
				)}

				<Form.Group className="mb-3">
					<Form.Label>Description (Optional)</Form.Label>
					<Form.Control
						as="textarea"
						rows={2}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Brief description of this file..."
						disabled={uploading}
						maxLength={500}
					/>
				</Form.Group>

				<Button
					variant="primary"
					onClick={handleUpload}
					disabled={!file || uploading}
				>
					{uploading ? 'Uploading...' : 'Upload File'}
				</Button>
			</Form>
		</div>
	);
};

export default BidResponseAttachmentUploader;
