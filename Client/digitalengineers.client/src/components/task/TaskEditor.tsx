import { useState, useEffect, useCallback } from 'react';
import { Button, Form, Row, Col, Card, CardBody } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { taskService } from '@/services/taskService';
import projectService from '@/services/projectService';
import type { 
  ProjectTaskStatusViewModel, 
  CreateTaskViewModel, 
  UpdateTaskViewModel,
  TaskLabelViewModel, 
  TaskPriority,
  TaskDetailViewModel,
  TaskCommentViewModel
} from '@/types/task';
import type { ProjectSpecialistDto } from '@/types/project';
import UserSelector from './UserSelector';
import ParentTaskSelector from './ParentTaskSelector';
import LabelSelector from './LabelSelector';
import TaskCommentList from './TaskCommentList';
import TaskCommentForm from './TaskCommentForm';
import { useToast } from '@/contexts/ToastContext';
import { useAuthContext } from '@/common/context/useAuthContext';
import CardTitle from '@/components/CardTitle';
import FileUploader from '@/components/FileUploader';

interface TaskEditorProps {
  mode: 'create' | 'edit';
  taskId?: number;
  projectId: number;
  statuses: ProjectTaskStatusViewModel[];
  onSuccess: () => void;
  onCancel: () => void;
}

const TaskEditor = ({ mode, taskId, projectId, statuses, onSuccess, onCancel }: TaskEditorProps) => {
  const [formData, setFormData] = useState<CreateTaskViewModel>({
    title: '',
    description: '',
    priority: 1 as TaskPriority,
    statusId: statuses[0]?.id || 0,
    deadline: '',
    isMilestone: false,
    assignedToUserId: undefined,
    parentTaskId: undefined,
    labelIds: [],
    projectId: projectId
  });
  
  const [projectMembers, setProjectMembers] = useState<ProjectSpecialistDto[]>([]);
  const [taskLabels, setTaskLabels] = useState<TaskLabelViewModel[]>([]);
  const [parentTasks, setParentTasks] = useState<Array<{ id: number; title: string }>>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<TaskAttachmentViewModel[]>([]);
  const [comments, setComments] = useState<TaskCommentViewModel[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    loadData();
  }, [projectId, taskId, mode]);

  // Load files separately for edit mode
  useEffect(() => {
    if (mode === 'edit' && taskId) {
      loadFiles();
    }
  }, [mode, taskId]);

  // Separate effect for loading comments
  useEffect(() => {
    if (mode === 'edit' && taskId) {
      loadComments();
    }
  }, [mode, taskId]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [members, labels, tasks] = await Promise.all([
        projectService.getProjectTeamMembers(projectId),
        taskService.getLabelsByProject(projectId),
        taskService.getTasksForSelection(projectId)
      ]);
      
      setProjectMembers(members || []);
      setTaskLabels(labels || []);
      setParentTasks((tasks || []).filter(t => mode === 'edit' && taskId ? t.id !== taskId : true));

      // Load task data if in edit mode (without files and comments)
      if (mode === 'edit' && taskId) {
        const taskDetail = await taskService.getTaskById(taskId);
        setFormData({
          title: taskDetail.title,
          description: taskDetail.description || '',
          priority: taskDetail.priority,
          statusId: taskDetail.statusId,
          deadline: taskDetail.deadline ? new Date(taskDetail.deadline).toISOString().split('T')[0] : '',
          isMilestone: taskDetail.isMilestone,
          assignedToUserId: taskDetail.assignedToUserId,
          parentTaskId: taskDetail.parentTaskId,
          labelIds: taskDetail.labels.map(l => l.id),
          projectId: taskDetail.projectId
        });
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data');
      setProjectMembers([]);
      setTaskLabels([]);
      setParentTasks([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadFiles = useCallback(async () => {
    if (!taskId) return;
    
    try {
      const files = await taskService.getTaskFiles(taskId);
      setExistingFiles(files || []);
    } catch (err) {
      console.error('Failed to load files:', err);
    }
  }, [taskId]);

  const loadComments = useCallback(async () => {
    if (!taskId) return;
    
    try {
      const taskComments = await taskService.getCommentsByTaskId(taskId);
      setComments(taskComments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  }, [taskId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' || name === 'statusId' ? Number(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleCreateLabel = async (dto: { name: string; color: string }) => {
    try {
      const newLabel = await taskService.createLabel({ ...dto, projectId });
      setTaskLabels(prev => [...prev, newLabel]);
      return newLabel;
    } catch (error) {
      console.error('Failed to create label:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      if (mode === 'create') {
        await taskService.createTask({
          ...formData,
          deadline: formData.deadline || undefined,
        }, attachments);
        showSuccess('Task Created', 'Task has been created successfully');
      } else if (mode === 'edit' && taskId) {
        const updateData: UpdateTaskViewModel = {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          statusId: formData.statusId,
          deadline: formData.deadline || undefined,
          isMilestone: formData.isMilestone,
          assignedToUserId: formData.assignedToUserId,
          parentTaskId: formData.parentTaskId,
          labelIds: formData.labelIds
        };
        await taskService.updateTask(taskId, updateData);
        showSuccess('Task Updated', 'Task has been updated successfully');
      }

      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || `Failed to ${mode} task`;
      setError(errorMessage);
      showError(`${mode === 'create' ? 'Creation' : 'Update'} Failed`, errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentAdded = useCallback((newComment: TaskCommentViewModel) => {
    setComments(prev => [...prev, newComment]);
  }, []);

  const handleCommentUpdated = useCallback(() => {
    loadComments();
  }, [loadComments]);

  const handleCommentDeleted = useCallback(() => {
    loadComments();
  }, [loadComments]);

  const handleFileDelete = useCallback(async (fileId: number) => {
    try {
      await taskService.deleteTaskFile(fileId);
      setExistingFiles(prev => prev.filter(f => f.id !== fileId));
      showSuccess('File Deleted', 'File has been deleted successfully');
    } catch (err: any) {
      showError('Error', err.response?.data?.message || 'Failed to delete file');
    }
  }, [showSuccess, showError]);

  const handleFileUpload = useCallback(async (files: File[]) => {
    if (!taskId) return;
    
    try {
      const uploaded = await taskService.uploadTaskFiles(taskId, files);
      setExistingFiles(prev => [...prev, ...uploaded]);
      showSuccess('Files Uploaded', `${uploaded.length} file(s) uploaded successfully`);
    } catch (err: any) {
      showError('Error', err.response?.data?.message || 'Failed to upload files');
    }
  }, [taskId, showSuccess, showError]);

  const getPriorityBadge = (priority: TaskPriority) => {
    const badges = {
      0: { label: 'Low', variant: 'info', icon: 'mdi:arrow-down' },
      1: { label: 'Medium', variant: 'warning', icon: 'mdi:minus' },
      2: { label: 'High', variant: 'danger', icon: 'mdi:arrow-up' },
      3: { label: 'Critical', variant: 'dark', icon: 'mdi:alert-circle' }
    };
    return badges[priority];
  };

  if (isLoadingData) {
    return (
      <div className="text-center py-4">
        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
        Loading data...
      </div>
    );
  }

  const currentStatus = statuses.find(s => s.id === formData.statusId);
  const priorityInfo = getPriorityBadge(formData.priority);
  const isEditMode = mode === 'edit';
  const isCreateMode = mode === 'create';

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        {/* Left Column - Main Form */}
        <Col xxl={8} xl={7}>
          <Card>
            <CardBody>
              <div className="clearfix"></div>

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  <Icon icon="mdi:alert-circle" width={16} className="me-1" />
                  {error}
                </div>
              )}

              <div className="mt-3">
                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-muted fw-bold font-12 text-uppercase">
                    Task Title <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    disabled={isSubmitting}
                    required
                    className="font-16"
                  />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-muted fw-bold font-12 text-uppercase">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter task description..."
                    disabled={isSubmitting}
                  />
                  <Form.Text className="text-muted">
                    Provide detailed information about the task
                  </Form.Text>
                </Form.Group>

                {/* Status, Priority and Milestone */}
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted fw-bold font-12 text-uppercase">Status</Form.Label>
                      <Form.Select
                        name="statusId"
                        value={formData.statusId}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      >
                        {statuses.map(status => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted fw-bold font-12 text-uppercase">Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      >
                        <option value={0}>Low</option>
                        <option value={1}>Medium</option>
                        <option value={2}>High</option>
                        <option value={3}>Critical</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted fw-bold font-12 text-uppercase">Milestone</Form.Label>
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="isMilestone"
                          id="milestoneSwitch"
                          checked={formData.isMilestone}
                          onChange={handleCheckboxChange}
                          disabled={isSubmitting}
                        />
                        <label className="form-check-label" htmlFor="milestoneSwitch">
                          <Icon 
                            icon="mdi:flag" 
                            width={16} 
                            className={classNames('me-1', {
                              'text-warning': formData.isMilestone,
                              'text-muted': !formData.isMilestone
                            })} 
                          />
                          {formData.isMilestone ? 'Yes' : 'No'}
                        </label>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Assigned To and Due Date */}
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted fw-bold font-12 text-uppercase">Assigned To</Form.Label>
                      <div className="d-flex align-items-center">
                        <Icon icon="uil:user" width={18} className="text-primary me-2" />
                        <div className="flex-grow-1">
                          <UserSelector
                            members={projectMembers}
                            value={formData.assignedToUserId}
                            onChange={(userId) => setFormData(prev => ({ ...prev, assignedToUserId: userId }))}
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="text-muted fw-bold font-12 text-uppercase">Due Date</Form.Label>
                      <div className="d-flex align-items-center">
                        <Icon icon="uil:schedule" width={18} className="text-success me-2" />
                        <div className="flex-grow-1">
                          <Form.Control
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Parent Task */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-muted fw-bold font-12 text-uppercase">Parent Task</Form.Label>
                  <ParentTaskSelector
                    tasks={parentTasks}
                    value={formData.parentTaskId}
                    onChange={(taskId) => setFormData(prev => ({ ...prev, parentTaskId: taskId }))}
                  />
                  <Form.Text className="text-muted">
                    <Icon icon="mdi:file-tree-outline" width={14} className="me-1" />
                    Optional: Make this a subtask of another task
                  </Form.Text>
                </Form.Group>
              </div>
            </CardBody>
          </Card>

          {/* Comments Card */}
          <Card style={isCreateMode ? { opacity: 0.5, pointerEvents: 'none' } : undefined}>
            <CardBody>
              <h5 className="card-title mb-3">
                <Icon icon="mdi:comment-multiple-outline" width={20} className="me-2" />
                Comments {isEditMode && comments.length > 0 && `(${comments.length})`}
              </h5>
              
              {isEditMode && user ? (
                <>
                  {/* Comments List */}
                  <TaskCommentList
                    taskId={taskId!}
                    comments={comments}
                    currentUserId={user.id}
                    onCommentUpdated={handleCommentUpdated}
                    onCommentDeleted={handleCommentDeleted}
                  />

                  {/* Comment Form */}
                  <div className="mt-3">
                    <TaskCommentForm
                      taskId={taskId!}
                      onCommentAdded={handleCommentAdded}
                    />
                  </div>
                </>
              ) : (
                <Form.Text className="text-muted d-block">
                  <Icon icon="mdi:information-outline" width={14} className="me-1" />
                  Comments will be available after task is created
                </Form.Text>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Right Column - Additional Settings */}
        <Col xxl={4} xl={5}>
          {/* Labels Card */}
  
              <LabelSelector
                availableLabels={taskLabels}
                selectedLabelIds={formData.labelIds}
                onChange={(labelIds) => setFormData(prev => ({ ...prev, labelIds }))}
                onCreateLabel={handleCreateLabel}
              />
      

          {/* Files / Attachments Card */}
          <Card>
            <CardBody>
              <h5 className="card-title mb-3">
                <Icon icon="mdi:paperclip" width={20} className="me-2" />
                Attachments
              </h5>
              {mode === 'edit' ? (
                <>
                  {/* Existing files list */}
                  {existingFiles.length > 0 && (
                    <div className="mb-3">
                      {existingFiles.map(file => (
                        <Card key={file.id} className="mb-2 shadow-none border">
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                <div className="avatar-sm">
                                  <span className="avatar-title rounded">
                                    {file.fileName.split('.').pop()?.toUpperCase() || 'FILE'}
                                  </span>
                                </div>
                              </Col>
                              <Col className="ps-0">
                                <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="text-muted fw-bold">
                                  {file.fileName}
                                </a>
                                <p className="mb-0">{(file.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                              </Col>
                              <Col className="col-auto">
                                <button
                                  type="button"
                                  onClick={() => handleFileDelete(file.id)}
                                  className="btn btn-link btn-lg text-danger p-0"
                                >
                                  <Icon icon="mdi:close" width={20} />
                                </button>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* File uploader for new files */}
                  <FileUploader
                    onFilesChange={(files) => {
                      if (files.length > 0) {
                        handleFileUpload(files);
                      }
                    }}
                    value={[]}
                    maxFiles={10}
                    maxFileSize={10}
                  />
                </>
              ) : (
                <Form.Text className="text-muted">
                  <Icon icon="mdi:information-outline" width={14} className="me-1" />
                  Attachments can be managed after task creation
                </Form.Text>
              )}
            </CardBody>
          </Card>

          {/* Team Info Card */}
          {projectMembers.filter(m => m.isAssigned).length > 0 && (
            <Card>
              <CardBody>
                <h5 className="card-title mb-3">Project Team</h5>
                <div className="d-flex flex-wrap gap-2">
                  {projectMembers.filter(m => m.isAssigned).slice(0, 5).map(member => (
                    <div key={member.userId} className="d-flex align-items-center">
                      {member.profilePictureUrl ? (
                        <img 
                          src={member.profilePictureUrl} 
                          alt={member.userName} 
                          className="rounded-circle" 
                          height="32" 
                          width="32"
                        />
                      ) : (
                        <div className="avatar-sm">
                          <span className="avatar-title rounded-circle bg-primary">
                            {member.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {projectMembers.filter(m => m.isAssigned).length > 5 && (
                    <div className="avatar-sm">
                      <span className="avatar-title rounded-circle bg-secondary">
                        +{projectMembers.filter(m => m.isAssigned).length - 5}
                      </span>
                    </div>
                  )}
                </div>
                <Form.Text className="text-muted d-block mt-2">
                  {projectMembers.filter(m => m.isAssigned).length} team member(s)
                </Form.Text>
              </CardBody>
            </Card>
          )}
        </Col>
      </Row>

      {/* Action Buttons Row - Bottom */}
      <Row className="mt-3">
        <Col>
          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="light" 
              onClick={onCancel} 
              disabled={isSubmitting}
            >
              <Icon icon="mdi:close" width={18} className="me-2" />
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Icon icon={mode === 'create' ? 'mdi:plus' : 'mdi:content-save'} width={18} className="me-2" />
                  {mode === 'create' ? 'Create Task' : 'Save Changes'}
                </>
              )}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default TaskEditor;
