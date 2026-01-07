import React from 'react';
import { Card, ListGroup, Button, Badge } from 'react-bootstrap';
import { formatFileSize, getFileIcon } from '@/utils/fileUtils';
import { formatDate } from '@/utils/taskHelpers';
import type { BidResponseAttachment } from '@/types/bid-attachment';

interface BidResponseAttachmentListProps {
	attachments: BidResponseAttachment[];
	canDelete?: boolean;
	onDelete?: (attachmentId: number) => void;
}

const BidResponseAttachmentList: React.FC<BidResponseAttachmentListProps> = ({
	attachments,
	canDelete = false,
	onDelete
}) => {
	if (!attachments || attachments.length === 0) {
		return (
			<div className="text-muted text-center py-3">
				<i className="mdi mdi-file-document-outline" style={{ fontSize: '3rem' }}></i>
				<p>No attachments uploaded yet</p>
			</div>
		);
	}

	return (
		<Card>
			<Card.Header>
				<h5 className="mb-0">
					<i className="mdi mdi-paperclip me-1"></i>
					Attached Documents ({attachments.length})
				</h5>
			</Card.Header>
			<ListGroup variant="flush">
				{attachments.map((attachment) => (
					<ListGroup.Item key={attachment.id} className="d-flex align-items-center">
						<div className="me-2" style={{ fontSize: '1.5rem' }}>
							{getFileIcon(attachment.fileType)}
						</div>
						
						<div className="flex-grow-1">
							<div className="d-flex align-items-center gap-2">
								<strong>{attachment.fileName}</strong>
								<Badge bg="secondary" pill>
									{formatFileSize(attachment.fileSize)}
								</Badge>
							</div>
							{attachment.description && (
								<div className="text-muted small">{attachment.description}</div>
							)}
							<div className="text-muted small">
								Uploaded by {attachment.uploadedByName} on {formatDate(attachment.uploadedAt)}
							</div>
						</div>

						<div className="d-flex gap-2">
							<Button
								variant="outline-primary"
								size="sm"
								href={attachment.downloadUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								<i className="mdi mdi-download me-1"></i>
								Download
							</Button>
							
							{canDelete && onDelete && (
								<Button
									variant="outline-danger"
									size="sm"
									onClick={() => onDelete(attachment.id)}
								>
									<i className="mdi mdi-delete"></i>
								</Button>
							)}
						</div>
					</ListGroup.Item>
				))}
			</ListGroup>
		</Card>
	);
};

export default BidResponseAttachmentList;
