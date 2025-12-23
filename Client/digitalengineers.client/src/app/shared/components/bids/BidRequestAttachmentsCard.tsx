import { useState, useEffect } from 'react';
import { Card, Tab, Tabs, Spinner, Alert } from 'react-bootstrap';
import BidRequestAttachmentList from './BidRequestAttachmentList';
import BidRequestAttachmentUploader from './BidRequestAttachmentUploader';
import bidService from '@/services/bidService';
import type { BidRequestAttachment } from '@/types/bid-attachment';
import { useToast } from '@/contexts';

interface BidRequestAttachmentsCardProps {
	bidRequestId: number;
	canUpload?: boolean;
}

const BidRequestAttachmentsCard = ({
	bidRequestId,
	canUpload = false
}: BidRequestAttachmentsCardProps) => {
	const { showSuccess, showError } = useToast();
	const [attachments, setAttachments] = useState<BidRequestAttachment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadAttachments();
	}, [bidRequestId]);

	const loadAttachments = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await bidService.getBidRequestAttachments(bidRequestId);
			setAttachments(data);
		} catch (err: any) {
			const errorMsg = err.response?.data?.message || err.message || 'Failed to load attachments';
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	const handleUploadSuccess = (attachment: BidRequestAttachment) => {
		setAttachments((prev) => [attachment, ...prev]);
		showSuccess('Success', 'File uploaded successfully');
	};

	const handleUploadError = (error: string) => {
		showError('Upload Failed', error);
	};

	const handleDelete = (attachmentId: number) => {
		setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
		showSuccess('Success', 'Attachment deleted successfully');
	};

	if (loading) {
		return (
			<Card>
				<Card.Body className="text-center py-4">
					<Spinner animation="border" variant="primary" />
					<p className="text-muted mt-2 mb-0">Loading attachments...</p>
				</Card.Body>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<Card.Body>
					<Alert variant="danger" className="mb-0">
						<i className="mdi mdi-alert-circle-outline me-2"></i>
						{error}
					</Alert>
				</Card.Body>
			</Card>
		);
	}

	return (
		<Card>
			<Card.Header>
				<h5 className="mb-0">
					<i className="mdi mdi-paperclip me-2"></i>
					Attachments ({attachments.length})
				</h5>
			</Card.Header>
			<Card.Body>
				{canUpload ? (
					<Tabs defaultActiveKey="view" className="mb-3">
						<Tab eventKey="view" title={`View (${attachments.length})`}>
							<BidRequestAttachmentList
								attachments={attachments}
								canDelete={canUpload}
								onDelete={handleDelete}
							/>
						</Tab>
						<Tab eventKey="upload" title="Upload">
							<BidRequestAttachmentUploader
								bidRequestId={bidRequestId}
								onUploadSuccess={handleUploadSuccess}
								onUploadError={handleUploadError}
							/>
						</Tab>
					</Tabs>
				) : (
					<BidRequestAttachmentList
						attachments={attachments}
						canDelete={false}
					/>
				)}
			</Card.Body>
		</Card>
	);
};

export default BidRequestAttachmentsCard;
