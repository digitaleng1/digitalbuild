import { Modal } from 'react-bootstrap';
import type { ProjectTaskStatusViewModel } from '@/types/task';
import TaskEditor from './TaskEditor';

interface TaskModalProps {
  show: boolean;
  onHide: () => void;
  mode: 'create' | 'edit';
  taskId?: number;
  projectId: number;
  statuses: ProjectTaskStatusViewModel[];
  onSuccess: () => void;
}

const TaskModal = ({ show, onHide, mode, taskId, projectId, statuses, onSuccess }: TaskModalProps) => {
  const handleSuccess = () => {
    onSuccess();
    onHide();
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      centered
      dialogClassName="modal-80w"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === 'create' ? 'Create New Task' : 'Edit Task'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TaskEditor
          mode={mode}
          taskId={taskId}
          projectId={projectId}
          statuses={statuses}
          onSuccess={handleSuccess}
          onCancel={onHide}
        />
      </Modal.Body>
    </Modal>
  );
};

export default TaskModal;
