import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { taskService } from '@/services/taskService';
import { useToast } from '@/contexts/ToastContext';
import type { ProjectTaskStatusViewModel, UpdateTaskStatus } from '@/types/task';

interface EditStatusModalProps {
  show: boolean;
  status: ProjectTaskStatusViewModel | null;
  onHide: () => void;
  onSuccess: () => void;
}

const EditStatusModal: React.FC<EditStatusModalProps> = ({ show, status, onHide, onSuccess }) => {
  const [formData, setFormData] = useState<UpdateTaskStatus>({
    name: '',
    color: '#6c757d',
    isCompleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (status) {
      setFormData({
        name: status.name,
        color: status.color || '#6c757d',
        isCompleted: status.isCompleted,
      });
      setError(null);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!status) return;

    if (!formData.name.trim()) {
      setError('Status name is required');
      return;
    }

    if (formData.name.length > 50) {
      setError('Status name must be less than 50 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await taskService.updateStatus(status.id, formData);
      
      showSuccess('Success', 'Status updated successfully');
      onSuccess();
      onHide();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      setError(errorMessage);
      showError('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setFormData({
      name: '',
      color: '#6c757d',
      isCompleted: false,
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon icon="mdi:pencil-outline" width={24} className="me-2" />
          Edit Status
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              <Icon icon="mdi:alert-circle-outline" width={20} className="me-2" />
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>
              Status Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter status name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={50}
              required
              disabled={loading}
            />
            <Form.Text className="text-muted">
              {formData.name.length}/50 characters
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                style={{ width: '60px', height: '40px' }}
                disabled={loading}
              />
              <Form.Control
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="#6c757d"
                maxLength={7}
                disabled={loading}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              id="isCompleted"
              label="Mark as completed status"
              checked={formData.isCompleted}
              onChange={(e) => setFormData({ ...formData, isCompleted: e.target.checked })}
              disabled={loading}
            />
            <Form.Text className="text-muted">
              Tasks with this status will be considered as completed
            </Form.Text>
          </Form.Group>

          {status?.isDefault && (
            <Alert variant="info">
              <Icon icon="mdi:information-outline" width={20} className="me-2" />
              This is the default status for new tasks in this project.
            </Alert>
          )}
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              <>
                <Icon icon="mdi:content-save" width={18} className="me-1" />
                Save Changes
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default React.memo(EditStatusModal);
