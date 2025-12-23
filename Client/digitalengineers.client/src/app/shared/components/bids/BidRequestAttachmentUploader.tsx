import { useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import FileUploader from '@/components/FileUploader';
import bidService from '@/services/bidService';
import type { BidRequestAttachment } from '@/types/bid-attachment';
import { 
	validateFileType, 
	validateFileSize, 
	ALLOWED_BID_ATTACHMENT_TYPES, 
	MAX_BID_ATTACHMENT_SIZE,
	formatFileSize
} from '@/utils/fileUtils';

interface BidRequestAttachmentUploaderProps {
	bidRequestId: number;
	onUploadSuccess?: (attachment: BidRequestAttachment) => void;
	onUploadError?: (error: string) => void;
}

const BidRequestAttachmentUploader = ({
	bidRequestId,
	onUploadSuccess,
	onUploadError
}: BidRequestAttachmentUploaderProps) => {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [description, setDescription] = useState('');

	const handleFilesChange = (files: File[]) => {
		setError(null);
		
		if (files.length === 0) {
			setSelectedFiles([]);
			return;
		}

		const file = files[0]; // Take only first file

		// Validate file type
		if (!validateFileType(file, ALLOWED_BID_ATTACHMENT_TYPES)) {
			const errorMsg = 'Invalid file type. Allowed types: PDF, JPG, PNG, DOC, DOCX, DWG, DXF';
			setError(errorMsg);
			onUploadError?.(errorMsg);
			return;
		}

		// Validate file size
		if (!validateFileSize(file, MAX_BID_ATTACHMENT_SIZE)) {
			const errorMsg = `File size exceeds maximum allowed size of ${formatFileSize(MAX_BID_ATTACHMENT_SIZE)}`;
			setError(errorMsg);
			onUploadError?.(errorMsg);
			return;
		}

		setSelectedFiles([file]);
	};

	const handleUpload = async () => {
		if (selectedFiles.length === 0) return;

		setUploading(true);
		setError(null);

		try {
			const attachment = await bidService.uploadBidRequestAttachment(bidRequestId, {
				file: selectedFiles[0],
				description: description || undefined
			});

			// Reset form
			setSelectedFiles([]);
			setDescription('');
			
			onUploadSuccess?.(attachment);
		} catch (err: any) {
			const errorMsg = err.response?.data?.message || err.message || 'Failed to upload attachment';
			setError(errorMsg);
			onUploadError?.(errorMsg);
		} finally {
			setUploading(false);
		}
	};

	const handleClear = () => {
		setSelectedFiles([]);
		setDescription('');
		setError(null);
	};

	return (
		<div className="bid-request-attachment-uploader">
			<h5 className="mb-3">Upload Attachment</h5>

			{error && (
				<Alert variant="danger" dismissible onClose={() => setError(null)}>
					{error}
				</Alert>
			)}

			<FileUploader 
				maxFiles={1}
				maxFileSize={MAX_BID_ATTACHMENT_SIZE / (1024 * 1024)}
				acceptedFileTypes={ALLOWED_BID_ATTACHMENT_TYPES}
				onFilesChange={handleFilesChange}
				value={selectedFiles}
				showFileList={true}
			/>

			{selectedFiles.length > 0 && (
				<>
					<Form.Group className="mt-3 mb-3">
						<Form.Label>Description (Optional)</Form.Label>
						<Form.Control
							as="textarea"
							rows={2}
							placeholder="Add a description for this file..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							disabled={uploading}
						/>
					</Form.Group>

					<div className="d-flex gap-2">
						<Button 
							variant="primary" 
							onClick={handleUpload}
							disabled={uploading}
						>
							{uploading ? (
								<>
									<Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
										className="me-1"
									/>
									Uploading...
								</>
							) : (
								<>
									<i className="mdi mdi-upload me-1"></i>
									Upload
								</>
							)}
						</Button>

						<Button 
							variant="secondary" 
							onClick={handleClear}
							disabled={uploading}
						>
							Clear
						</Button>
					</div>
				</>
			)}

			<div className="text-muted mt-2 small">
				<i className="mdi mdi-information-outline me-1"></i>
				Allowed types: PDF, JPG, PNG, DOC, DOCX, DWG, DXF. Max size: {formatFileSize(MAX_BID_ATTACHMENT_SIZE)}
			</div>
		</div>
	);
};

export default BidRequestAttachmentUploader;
