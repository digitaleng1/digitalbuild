import { useState, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { MentionableUser } from '@/types/project-comment';
import type { ProjectFile } from '@/types/project';

interface ForwardFileModalProps {
  show: boolean;
  onHide: () => void;
  file: ProjectFile | null;
  mentionableUsers: MentionableUser[];
  onForward: (fileId: number, recipientId: string, message: string) => Promise<void>;
}

const ForwardFileModal = ({
  show,
  onHide,
  file,
  mentionableUsers,
  onForward
}: ForwardFileModalProps) => {
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !selectedRecipient) return;

    try {
      setIsSubmitting(true);
      await onForward(file.id, selectedRecipient, message);
      
      // Reset form
      setSelectedRecipient('');
      setMessage('');
      onHide();
    } catch (error) {
      console.error('Failed to forward file:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [file, selectedRecipient, message, onForward, onHide]);

  const handleClose = useCallback(() => {
    setSelectedRecipient('');
    setMessage('');
    onHide();
  }, [onHide]);

  if (!file) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Forward File</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <div className="d-flex align-items-center p-2 bg-light rounded">
              <Icon icon="mdi:file-document-outline" width={24} className="text-primary me-2" />
              <div className="flex-grow-1">
                <div className="fw-semibold">{file.fileName}</div>
                <small className="text-muted">
                  {(file.fileSize / 1024).toFixed(2)} KB
                </small>
              </div>
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>
              Recipient <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="">Select recipient...</option>
              {mentionableUsers.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message to go with the file..."
              disabled={isSubmitting}
            />
            <Form.Text className="text-muted">
              {message.length}/500 characters
            </Form.Text>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!selectedRecipient || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />
                Forwarding...
              </>
            ) : (
              <>
                <Icon icon="mdi:send" width={16} className="me-1" />
                Forward File
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ForwardFileModal;
