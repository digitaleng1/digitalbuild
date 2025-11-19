import { useState, useEffect, useMemo, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Card, Badge, Spinner, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { TaskViewModel, TaskStatusViewModel } from '@/types/task';
import type { ProjectDto } from '@/types/project';
import { taskService } from '@/services/taskService';
import { getPriorityColor, getPriorityLabel, formatDate, isOverdue } from '@/utils/taskHelpers';
import CreateTaskModal from './CreateTaskModal';
import ProjectTaskStats from '@/components/project/ProjectTaskStats';

interface TaskKanbanBoardProps {
  projectId: number;
  project: ProjectDto;
  canEdit?: boolean;
  onTaskClick?: (taskId: number) => void;
}

interface TaskColumn {
  status: TaskStatusViewModel;
  tasks: TaskViewModel[];
}

const TaskKanbanBoard = ({ projectId, project, canEdit = true, onTaskClick }: TaskKanbanBoardProps) => {
  const [columns, setColumns] = useState<TaskColumn[]>([]);
  const [statuses, setStatuses] = useState<TaskStatusViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load tasks for the project - handle errors separately
      let tasks: TaskViewModel[] = [];
      
      try {
        tasks = await taskService.getTasksByProject(projectId);
      } catch (err) {
        console.error('Failed to load tasks:', err);
        // Keep tasks as empty array
      }

      // If no tasks, show empty board (no columns)
      if (!tasks || tasks.length === 0) {
        setStatuses([]);
        setColumns([]);
        return; // Exit early - show empty state
      }

      // Get unique statuses from tasks (in order)
      const uniqueStatuses = new Map<number, TaskStatusViewModel>();
      tasks.forEach(task => {
        if (!uniqueStatuses.has(task.statusId)) {
          uniqueStatuses.set(task.statusId, {
            id: task.statusId,
            name: task.statusName,
            color: task.statusColor,
            order: 0, // Will be set by server
            isDefault: false,
            isCompleted: false,
            createdAt: new Date().toISOString(),
          });
        }
      });

      const statusList = Array.from(uniqueStatuses.values()).sort((a, b) => a.id - b.id);
      setStatuses(statusList);

      // Group tasks by status
      const cols = statusList.map(status => ({
        status,
        tasks: tasks.filter(t => t.statusId === status.id),
      }));

      setColumns(cols);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTaskClick = (taskId: number) => {
    onTaskClick?.(taskId);
  };

  const handleCreateTask = () => {
    setShowCreateModal(true);
  };

  const handleCreateSuccess = () => {
    loadData();
  };

  const onDragEnd = async (result: DropResult) => {
    if (!canEdit) return;

    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumnIndex = columns.findIndex(col => col.status.id === Number(source.droppableId));
    const destColumnIndex = columns.findIndex(col => col.status.id === Number(destination.droppableId));

    if (sourceColumnIndex === -1 || destColumnIndex === -1) return;

    const sourceColumn = columns[sourceColumnIndex];
    const destColumn = columns[destColumnIndex];

    const sourceTasks = Array.from(sourceColumn.tasks);
    const taskIndex = sourceTasks.findIndex(t => t.id === Number(draggableId));
    
    if (taskIndex === -1) return;

    const [movedTask] = sourceTasks.splice(taskIndex, 1);

    // Update task status locally
    const updatedTask = { ...movedTask, statusId: destColumn.status.id };

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      
      const newColumns = [...columns];
      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: sourceTasks,
      };
      
      setColumns(newColumns);
    } else {
      const destTasks = Array.from(destColumn.tasks);
      destTasks.splice(destination.index, 0, updatedTask);

      const newColumns = [...columns];
      newColumns[sourceColumnIndex] = {
        ...sourceColumn,
        tasks: sourceTasks,
      };
      newColumns[destColumnIndex] = {
        ...destColumn,
        tasks: destTasks,
      };

      // Optimistically update UI
      setColumns(newColumns);

      try {
        setUpdating(true);
        
        // Update on server
        await taskService.updateTask(movedTask.id, {
          title: movedTask.title,
          description: movedTask.description,
          priority: movedTask.priority,
          deadline: movedTask.deadline,
          isMilestone: movedTask.isMilestone,
          assignedToUserId: movedTask.assignedToUserId,
          parentTaskId: movedTask.parentTaskId,
          statusId: destColumn.status.id,
          labelIds: [], // Labels will be preserved on server
        });

        // Reload data to get updated task
        await loadData();
      } catch (error) {
        console.error('Failed to update task status:', error);
        // Rollback on error
        setColumns(columns);
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <Icon icon="mdi:alert-circle-outline" width={20} className="me-2" />
        {error}
      </div>
    );
  }

  // Show empty state if no columns
  if (columns.length === 0) {
    return (
      <>
        <ProjectTaskStats projectId={projectId} project={project} />

        <div className="alert alert-info d-flex align-items-center justify-content-between mt-3" role="alert">
          <div className="d-flex align-items-center">
            <Icon icon="mdi:information-outline" width={24} className="me-2" />
            <span>No tasks found for this project. Create your first task to get started!</span>
          </div>
          {canEdit && (
            <Button variant="primary" size="sm" onClick={handleCreateTask}>
              <Icon icon="mdi:plus" width={18} className="me-1" />
              Create Task
            </Button>
          )}
        </div>

        <CreateTaskModal
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          projectId={projectId}
          statuses={statuses.length > 0 ? statuses : [{ id: 1, name: 'To Do', color: '#6c757d', order: 0, isDefault: true, isCompleted: false, createdAt: new Date().toISOString() }]
          }
          onSuccess={handleCreateSuccess}
        />
      </>
    );
  }

  return (
    <>
      <ProjectTaskStats projectId={projectId} project={project} />

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <h5 className="mb-0">Tasks</h5>
        {canEdit && (
          <Button variant="success" size="sm" onClick={handleCreateTask}>
            <Icon icon="mdi:plus" width={18} className="me-1" />
            Add New Task
          </Button>
        )}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {columns.map(column => (
            <Droppable key={column.status.id} droppableId={String(column.status.id)}>
              {(provided) => (
                <div 
                  className="tasks" 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h5 className="mt-0 task-header text-uppercase d-flex align-items-center gap-2">
                    {column.status.color && (
                      <span 
                        className="badge rounded-pill" 
                        style={{ backgroundColor: column.status.color, width: '10px', height: '10px' }}
                      />
                    )}
                    {column.status.name} ({column.tasks.length})
                  </h5>

                  {column.tasks.length === 0 && (
                    <p className="text-center text-muted pt-2 mb-0">No tasks</p>
                  )}

                  {column.tasks.map((task, index) => (
                    <Draggable 
                      key={task.id} 
                      draggableId={String(task.id)} 
                      index={index}
                      isDragDisabled={!canEdit || updating}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            marginTop: '1rem',
                          }}
                        >
                          <Card 
                            className="mb-0 shadow-sm"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleTaskClick(task.id)}
                          >
                            <Card.Body className="p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="mb-0 fw-semibold">{task.title}</h6>
                                <Badge bg={getPriorityColor(task.priority)} className="ms-2">
                                  {getPriorityLabel(task.priority)}
                                </Badge>
                              </div>

                              {task.description && (
                                <p className="text-muted small mb-2" style={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}>
                                  {task.description}
                                </p>
                              )}

                              {task.deadline && (
                                <div className="mb-2">
                                  <Badge bg={isOverdue(task.deadline) ? 'danger' : 'secondary'} className="small">
                                    <Icon icon="mdi:calendar-clock" width={14} className="me-1" />
                                    {formatDate(task.deadline)}
                                  </Badge>
                                </div>
                              )}

                              {task.assignedToUserName && (
                                <div className="d-flex align-items-center gap-1 mb-2">
                                  <Icon icon="mdi:account-circle" width={16} className="text-primary" />
                                  <span className="small text-muted">{task.assignedToUserName}</span>
                                </div>
                              )}

                              {task.labels.length > 0 && (
                                <div className="d-flex gap-1 flex-wrap mb-2">
                                  {task.labels.slice(0, 3).map((label, idx) => (
                                    <Badge key={idx} bg="light" text="dark" className="small">
                                      {label}
                                    </Badge>
                                  ))}
                                  {task.labels.length > 3 && (
                                    <Badge bg="light" text="dark" className="small">
                                      +{task.labels.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}

                              <div className="d-flex align-items-center gap-3 mt-2 text-muted small">
                                {task.commentsCount > 0 && (
                                  <div className="d-flex align-items-center gap-1">
                                    <Icon icon="mdi:comment-outline" width={16} />
                                    <span>{task.commentsCount}</span>
                                  </div>
                                )}
                              
                                {task.attachmentsCount > 0 && (
                                  <div className="d-flex align-items-center gap-1">
                                    <Icon icon="mdi:paperclip" width={16} />
                                    <span>{task.attachmentsCount}</span>
                                  </div>
                                )}
                              
                                {task.watchersCount > 0 && (
                                  <div className="d-flex align-items-center gap-1">
                                    <Icon icon="mdi:eye-outline" width={16} />
                                    <span>{task.watchersCount}</span>
                                  </div>
                                )}

                                {task.isMilestone && (
                                  <div className="d-flex align-items-center gap-1 text-warning">
                                    <Icon icon="mdi:flag" width={16} />
                                    <span>Milestone</span>
                                  </div>
                                )}
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        projectId={projectId}
        statuses={statuses}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default TaskKanbanBoard;
