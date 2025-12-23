import { useState } from 'react';
import { Card, Col, Row, Button, Modal, Alert } from 'react-bootstrap';
import type { BidRequestAttachment } from '@/types/bid-attachment';
import { formatFileSize, getFileIcon, getFileTypeDescription } from '@/utils/fileUtils';
import bidService from '@/services/bidService';

interface BidRequestAttachmentListProps {
	attachments: BidRequestAttachment[];
	canDelete?: boolean;
	onDelete?: (attachmentId: number) => void;
}

const BidRequestAttachmentList = ({
	attachments,
	canDelete = false,
	onDelete
}: BidRequestAttachmentListProps) => {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedAttachment, setSelectedAttachment] = useState<BidRequestAttachment | null>(null);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleDeleteClick = (attachment: BidRequestAttachment) => {
		setSelectedAttachment(attachment);
		setShowDeleteModal(true);
		setError(null);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedAttachment) return;

		setDeleting(true);
		setError(null);

		try {
			await bidService.deleteBidRequestAttachment(selectedAttachment.id);
			setShowDeleteModal(false);
			onDelete?.(selectedAttachment.id);
		} catch (err: any) {
			const errorMsg = err.response?.data?.message || err.message || 'Failed to delete attachment';
			setError(errorMsg);
		} finally {
			setDeleting(false);
		}
	};

	const handleDownload = (attachment: BidRequestAttachment) => {
		window.open(attachment.downloadUrl, '_blank');
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	if (!attachments || attachments.length === 0) {
		return (
			<div className="text-muted text-center py-3">
				<i className="mdi mdi-file-outline mdi-24px"></i>
				<p className="mb-0 mt-2">No attachments</p>
			</div>
		);
	}

	return (
		<>
			<div className="bid-request-attachment-list">
				{attachments.map((attachment) => (
					<Card key={attachment.id} className="mb-2 shadow-sm">
						<Card.Body>
							<Row className="align-items-center">
								<Col xs="auto">
									<i className={`${getFileIcon(attachment.fileType)} mdi-36px`}></i>
								</Col>
								<Col>
									<div className="d-flex flex-column">
										<h6 className="mb-1">{attachment.fileName}</h6>
										<div className="text-muted small">
											<span>{getFileTypeDescription(attachment.fileType)}</span>
											<span className="mx-2">•</span>
											<span>{formatFileSize(attachment.fileSize)}</span>
										</div>
										<div className="text-muted small mt-1">
											<i className="mdi mdi-account-outline me-1"></i>
											Uploaded by {attachment.uploadedByName}
											<span className="mx-2">•</span>
											<i className="mdi mdi-clock-outline me-1"></i>
											{formatDate(attachment.uploadedAt)}
										</div>
										{attachment.description && (
											<div className="text-muted small mt-1 fst-italic">
												"{attachment.description}"
											</div>
										)}
									</div>
								</Col>
								<Col xs="auto">
									<div className="d-flex gap-2">
										<Button
											variant="outline-primary"
											size="sm"
											onClick={() => handleDownload(attachment)}
											title="Download"
										>
											<i className="mdi mdi-download"></i>
										</Button>
										{canDelete && (
											<Button
												variant="outline-danger"
												size="sm"
												onClick={() => handleDeleteClick(attachment)}
												title="Delete"
											>
												<i className="mdi mdi-delete"></i>
											</Button>
										)}
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				))}
			</div>

			{/* Delete Confirmation Modal */}
			<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
				<Modal.Header closeButton>
					<Modal.Title>Delete Attachment</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{error && (
						<Alert variant="danger" className="mb-3">
							{error}
						</Alert>
					)}
					<p>
						Are you sure you want to delete <strong>{selectedAttachment?.fileName}</strong>?
					</p>
					<p className="text-muted mb-0">This action cannot be undone.</p>
				</Modal.Body>
				<Modal.Footer>
					<Button 
						variant="secondary" 
						onClick={() => setShowDeleteModal(false)}
						disabled={deleting}
					>
						Cancel
					</Button>
					<Button 
						variant="danger" 
						onClick={handleDeleteConfirm}
						disabled={deleting}
					>
						{deleting ? 'Deleting...' : 'Delete'}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default BidRequestAttachmentList;
