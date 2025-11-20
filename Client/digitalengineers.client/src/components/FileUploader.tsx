import { useCallback, useRef, useState } from 'react';
import { FormLabel } from 'react-bootstrap';

interface FileUploaderProps {
	label?: string;
	helpText?: string;
	maxFiles?: number;
	maxFileSize?: number; // in MB
	acceptedFileTypes?: string[];
	onFilesChange: (files: File[]) => void;
	value: File[];
}

const FileUploader = ({
	label = 'Upload Files',
	helpText,
	maxFiles = 10,
	maxFileSize = 10, // 10MB
	acceptedFileTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg'],
	onFilesChange,
	value,
}: FileUploaderProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState<string>('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validateFile = useCallback(
		(file: File): string | null => {
			const maxSizeInBytes = maxFileSize * 1024 * 1024;
			
			if (file.size > maxSizeInBytes) {
				return `File "${file.name}" exceeds maximum size of ${maxFileSize}MB`;
			}

			const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
			if (!acceptedFileTypes.includes(fileExtension)) {
				return `File "${file.name}" has unsupported type. Allowed: ${acceptedFileTypes.join(', ')}`;
			}

			return null;
		},
		[maxFileSize, acceptedFileTypes]
	);

	const handleFiles = useCallback(
		(files: FileList | null) => {
			if (!files || files.length === 0) return;

			const fileArray = Array.from(files);
			const currentCount = value.length;

			if (currentCount + fileArray.length > maxFiles) {
				setError(`Maximum ${maxFiles} files allowed`);
				return;
			}

			for (const file of fileArray) {
				const validationError = validateFile(file);
				if (validationError) {
					setError(validationError);
					return;
				}
			}

			setError('');
			onFilesChange([...value, ...fileArray]);
		},
		[value, maxFiles, validateFile, onFilesChange]
	);

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			handleFiles(e.dataTransfer.files);
		},
		[handleFiles]
	);

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleFiles(e.target.files);
		},
		[handleFiles]
	);

	const handleRemoveFile = useCallback(
		(index: number) => {
			const newFiles = value.filter((_, i) => i !== index);
			onFilesChange(newFiles);
			setError('');
		},
		[value, onFilesChange]
	);

	const handleClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
	};

	return (
		<div className="file-uploader">
			{label && <FormLabel>{label}</FormLabel>}
			
			{/* Drop Zone - Top */}
			<div
				className={`file-drop-zone border rounded p-4 text-center mb-3 ${
					isDragging ? 'border-primary bg-light' : 'border-2 border-dashed'
				}`}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onClick={handleClick}
				style={{ cursor: 'pointer', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
			>
				<i className="mdi mdi-cloud-upload fs-1 text-muted mb-2"></i>
				<p className="mb-1 fw-semibold">
					Click to upload or drag and drop
				</p>
				<small className="text-muted d-block">
					{acceptedFileTypes.join(', ')}
				</small>
				<small className="text-muted d-block mt-1">
					Max {maxFileSize}MB per file • Maximum {maxFiles} files
				</small>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept={acceptedFileTypes.join(',')}
				onChange={handleFileInputChange}
				style={{ display: 'none' }}
			/>

			{helpText && <small className="text-muted d-block mb-2">{helpText}</small>}

			{error && (
				<div className="alert alert-danger mb-2" role="alert">
					<i className="mdi mdi-alert-circle-outline me-1"></i>
					{error}
				</div>
			)}

			{/* File List - Bottom */}
			<div className="uploaded-files-container">
				<div className="d-flex justify-content-between align-items-center mb-2">
					<h6 className="mb-0">Uploaded Files</h6>
					<span className="badge bg-primary">{value.length}/{maxFiles}</span>
				</div>
				
				{value.length === 0 ? (
					<div 
						className="border border-dashed rounded p-3 text-center text-muted"
					>
						<i className="mdi mdi-file-outline fs-2 mb-2"></i>
						<p className="mb-0">No files uploaded yet</p>
						<small>Upload files using the area above</small>
					</div>
				) : (
					<div className="list-group" style={{ maxHeight: '250px', overflowY: 'auto' }}>
						{value.map((file, index) => (
							<div
								key={index}
								className="list-group-item d-flex justify-content-between align-items-center py-2"
							>
								<div className="d-flex align-items-center flex-grow-1 me-2" style={{ minWidth: 0 }}>
									<i className="mdi mdi-file-document-outline fs-4 text-primary me-2 flex-shrink-0"></i>
									<div className="flex-grow-1" style={{ minWidth: 0 }}>
										<div className="fw-semibold text-truncate" title={file.name}>
											{file.name}
										</div>
										<small className="text-muted">{formatFileSize(file.size)}</small>
									</div>
								</div>
								<button
									type="button"
									className="btn btn-sm btn-link text-danger p-0 flex-shrink-0"
									onClick={() => handleRemoveFile(index)}
									title="Remove file"
								>
									<i className="mdi mdi-close fs-5"></i>
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default FileUploader;
