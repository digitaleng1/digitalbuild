import React, { useState, useEffect, useCallback } from 'react';
import { Offcanvas, Spinner, Alert } from 'react-bootstrap';
import type { ProjectTaskStatusViewModel } from '@/types/task';
import TaskEditor from './TaskEditor';

interface TaskSidePanelProps {
  taskId: number | null;
  projectId: number;
  statuses: ProjectTaskStatusViewModel[];
  onSuccess: () => void;
  onClose: () => void;
}

const TaskSidePanel = React.memo(({ taskId, projectId, statuses, onSuccess, onClose }: TaskSidePanelProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = useCallback(() => {
    onSuccess();
    onClose();
  }, [onSuccess, onClose]);

  return (
    <Offcanvas 
      show={!!taskId} 
      onHide={onClose} 
      placement="end"
      style={{ width: '70%' }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          Edit Task
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {error ? (
          <Alert variant="danger">{error}</Alert>
        ) : taskId ? (
          <TaskEditor
            mode="edit"
            taskId={taskId}
            projectId={projectId}
            statuses={statuses}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        ) : (
          <div className="text-center py-5 text-muted">
            <i className="mdi mdi-clipboard-text-outline font-48 d-block mb-3"></i>
            <p>Select a task to view details</p>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
});

TaskSidePanel.displayName = 'TaskSidePanel';

export default TaskSidePanel;
