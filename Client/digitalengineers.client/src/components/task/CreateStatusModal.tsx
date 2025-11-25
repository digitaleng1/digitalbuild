import React, { useState, useCallback } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { taskService } from '@/services/taskService';
import { useToast } from '@/contexts/ToastContext';

interface CreateStatusModalProps {
  show: boolean;
  onHide: () => void;
  projectId: number;
  maxOrder: number;
  onSuccess: () => void;
}

const CreateStatusModal = React.memo(({ show, onHide, projectId, maxOrder, onSuccess }: CreateStatusModalProps) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6c757d');
  const [isCompleted, setIsCompleted] = useState(false);
  const { showSuccess, showError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showError('Validation Error', 'Status name is required');
      return;
    }

    try {
      setSubmitting(true);
      await taskService.createStatus({
        projectId,
        name: name.trim(),
        color,
        order: maxOrder + 1,
        isCompleted
      });
      
      showSuccess('Status Created', `Status "${name}" has been created`);
      onSuccess();
      onHide();
      
      // Reset form
      setName('');
      setColor('#6c757d');
      setIsCompleted(false);
    } catch (error: any) {
      showError('Error', error.response?.data?.message || 'Failed to create status');
    } finally {
      setSubmitting(false);
    }
  }, [projectId, name, color, maxOrder, isCompleted, showSuccess, showError, onSuccess, onHide]);

  const handleHide = useCallback(() => {
    if (!submitting) {
      setName('');
      setColor('#6c757d');
      setIsCompleted(false);
      onHide();
    }
  }, [submitting, onHide]);

  return (
    <Modal show={show} onHide={handleHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Status Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter status name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              disabled={submitting}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              disabled={submitting}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Mark as completed status"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
              disabled={submitting}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleHide} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting || !name.trim()}>
              {submitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Creating...
                </>
              ) : (
                'Create Status'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
});

CreateStatusModal.displayName = 'CreateStatusModal';

export default CreateStatusModal;
