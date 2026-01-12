import { useState, useCallback } from 'react';
import { Card, CardBody, Row, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import type { ProjectFile } from '@/types/project';
import type { MentionableUser } from '@/types/project-comment';
import { formatFileSize, getFileExtension } from '@/utils/projectUtils';
import ForwardFileModal from '@/components/modals/ForwardFileModal';
import FileUploader from '@/components/FileUploader';
import projectService from '@/services/projectService';

interface FilesProps {
	files: ProjectFile[];
	mentionableUsers?: MentionableUser[];
	onForwardFile?: (fileId: number, recipientId: string, message: string) => Promise<void>;
	projectId?: number;
	canUpload?: boolean;
	onFilesUploaded?: () => Promise<void>;
}

const Files = ({ files, mentionableUsers = [], onForwardFile, projectId, canUpload = false, onFilesUploaded }: FilesProps) => {
	const [showForwardModal, setShowForwardModal] = useState(false);
	const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
	const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const handleForwardClick = useCallback((file: ProjectFile) => {
		setSelectedFile(file);
		setShowForwardModal(true);
	}, []);

	const handleForward = useCallback(async (fileId: number, recipientId: string, message: string) => {
		if (onForwardFile) {
			await onForwardFile(fileId, recipientId, message);
		}
	}, [onForwardFile]);

	const handleUpload = useCallback(async () => {
		if (!projectId || filesToUpload.length === 0) return;

		setUploading(true);
		setUploadError(null);

		try {
			await projectService.uploadProjectFiles(projectId, filesToUpload);
			setFilesToUpload([]);
			if (onFilesUploaded) {
				await onFilesUploaded();
			}
		} catch (error) {
			console.error('Failed to upload files:', error);
			setUploadError('Failed to upload files. Please try again.');
		} finally {
			setUploading(false);
		}
	}, [projectId, filesToUpload, onFilesUploaded]);

	const getFileVariant = (contentType: string) => {
		if (contentType.startsWith('image/')) return 'primary';
		if (contentType.includes('pdf')) return 'danger';
		if (contentType.includes('zip') || contentType.includes('compressed')) return 'secondary';
		if (contentType.includes('word') || contentType.includes('document')) return 'info';
		return 'secondary';
	};

	const canForward = mentionableUsers.length > 0 && onForwardFile;

	return (
		<>
			<Card>
				<CardBody>
					<h5 className="card-title mb-3">Files</h5>

					{/* File Upload Section */}
					{canUpload && projectId && (
						<div className="mb-3">
							<FileUploader
								label=""
								onFilesChange={setFilesToUpload}
								value={filesToUpload}
								showFileList={true}
								maxFiles={10}
								maxFileSize={25}
							/>
							
							{uploadError && (
								<div className="alert alert-danger mt-2 mb-0" role="alert">
									<i className="mdi mdi-alert-circle-outline me-1"></i>
									{uploadError}
								</div>
							)}

							{filesToUpload.length > 0 && (
								<Button
									variant="primary"
									className="mt-2 w-100"
									onClick={handleUpload}
									disabled={uploading}
								>
									{uploading ? (
										<>
											<Spinner size="sm" className="me-1" />
											Uploading...
										</>
									) : (
										<>
											<i className="mdi mdi-upload me-1"></i>
											Upload {filesToUpload.length} file{filesToUpload.length > 1 ? 's' : ''}
										</>
									)}
								</Button>
							)}
						</div>
					)}

					{/* Existing Files List */}
					{(!files || files.length === 0) ? (
						<p className="text-muted">No files uploaded yet</p>
					) : (
						files.map((file) => {
							const extension = getFileExtension(file.fileName);
							const size = formatFileSize(file.fileSize);
							const variant = getFileVariant(file.contentType);

							return (
								<Card key={file.id} className="mb-1 shadow-none border">
									<div className="p-2">
										<Row className="align-items-center">
											<div className="col-auto">
												<div className="avatar-sm">
													<span className={`avatar-title bg-${variant} rounded`}>
														{extension}
													</span>
												</div>
											</div>
											<div className="col ps-0">
												<Link to={file.fileUrl} className="text-muted fw-bold" target="_blank">
													{file.fileName}
												</Link>
												<p className="mb-0">{size}</p>
											</div>
											<div className="col-auto">
												{canForward && (
													<Button
														variant="link"
														size="sm"
														className="btn-lg text-muted p-0 me-2"
														onClick={() => handleForwardClick(file)}
														title="Forward file"
													>
														<Icon icon="mdi:share-variant" width={20} />
													</Button>
												)}
												<Link to={file.fileUrl} className="btn btn-link btn-lg text-muted" target="_blank" download>
													<i className="ri-download-2-line"></i>
												</Link>
											</div>
										</Row>
									</div>
								</Card>
							);
						})
					)}
				</CardBody>
			</Card>

			<ForwardFileModal
				show={showForwardModal}
				onHide={() => setShowForwardModal(false)}
				file={selectedFile}
				mentionableUsers={mentionableUsers}
				onForward={handleForward}
			/>
		</>
	);
};

export default Files;
