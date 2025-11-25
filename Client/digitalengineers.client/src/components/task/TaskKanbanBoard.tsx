import { useState, useEffect, useMemo, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Card, Badge, Spinner, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { TaskViewModel, ProjectTaskStatusViewModel } from '@/types/task';
import type { ProjectDto } from '@/types/project';
import { taskService } from '@/services/taskService';
import { getPriorityColor, getPriorityLabel, formatDate, isOverdue } from '@/utils/taskHelpers';
import TaskModal from './TaskModal';
import CreateStatusModal from './CreateStatusModal';
import EditStatusModal from './EditStatusModal';
import ProjectTaskStats from '@/components/project/ProjectTaskStats';
import { useToast } from '@/contexts/ToastContext';

interface TaskKanbanBoardProps {
    projectId: number;
    project: ProjectDto;
    canEdit?: boolean;
    onTaskClick?: (taskId: number) => void;
}

interface TaskColumn {
    status: ProjectTaskStatusViewModel;
    tasks: TaskViewModel[];
}

const TaskKanbanBoard = ({ projectId, project, canEdit = true, onTaskClick }: TaskKanbanBoardProps) => {
    const [columns, setColumns] = useState<TaskColumn[]>([]);
    const [statuses, setStatuses] = useState<ProjectTaskStatusViewModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>();
    const [showCreateStatusModal, setShowCreateStatusModal] = useState(false);
    const [showEditStatusModal, setShowEditStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<ProjectTaskStatusViewModel | null>(null);
    const { showSuccess, showError } = useToast();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Load statuses first
            const statusList = await taskService.getStatusesByProject(projectId);
            setStatuses(statusList);

            // Load tasks for the project
            let tasks: TaskViewModel[] = [];

            try {
                tasks = await taskService.getTasksByProject(projectId);
            } catch (err) {
                console.error('Failed to load tasks:', err);
            }

            // Group tasks by status
            const cols = statusList.map(status => ({
                status,
                tasks: tasks.filter(t => t.statusId === status.id),
            }));

            setColumns(cols);
        } catch (err) {
            console.error('Failed to load data:', err);
            setError('Failed to load task board. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleEditStatus = useCallback((status: ProjectTaskStatusViewModel) => {
        setSelectedStatus(status);
        setShowEditStatusModal(true);
    }, []);

    const handleDeleteStatus = useCallback(async (statusId: number, statusName: string) => {
        if (!window.confirm(`Are you sure you want to delete status "${statusName}"?\n\nThis action cannot be undone.`)) {
            return;
        }

        try {
            await taskService.deleteStatus(statusId);
            showSuccess('Success', 'Status deleted successfully');
            loadData();
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete status';
            showError('Error', errorMessage);
        }
    }, [loadData, showSuccess, showError]);

    const handleTaskClick = (taskId: number) => {
        onTaskClick?.(taskId);
    };

    const handleViewTask = (e: React.MouseEvent, taskId: number) => {
        e.stopPropagation();
        setSelectedTaskId(taskId);
        setModalMode('edit');
        setShowModal(true);
    };

    const handleCreateTask = () => {
        setSelectedTaskId(undefined);
        setModalMode('create');
        setShowModal(true);
    };

    const handleModalSuccess = () => {
        loadData();
    };

    const maxOrder = useMemo(() =>
        Math.max(...statuses.map(s => s.order), 0),
        [statuses]
    );

    const onDragEnd = async (result: DropResult) => {
        if (!canEdit) return;

        const { source, destination, draggableId, type } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Handle column reordering
        if (type === 'COLUMN') {
            const reorderedStatuses = Array.from(statuses);
            const [movedStatus] = reorderedStatuses.splice(source.index, 1);
            reorderedStatuses.splice(destination.index, 0, movedStatus);

            // Optimistic update
            setStatuses(reorderedStatuses);

            const reorderedColumns = reorderedStatuses.map(status =>
                columns.find(col => col.status.id === status.id)!
            );
            setColumns(reorderedColumns);

            try {
                const reorderData = reorderedStatuses.map((status, index) => ({
                    statusId: status.id,
                    newOrder: index + 1,
                }));

                await taskService.reorderStatuses(projectId, reorderData);
                showSuccess('Success', 'Column order updated');
            } catch (err) {
                console.error('Failed to reorder columns:', err);
                showError('Error', 'Failed to reorder columns');
                // Rollback
                loadData();
            }
            return;
        }

        // Handle task reordering (existing logic)
        const sourceColumnIndex = columns.findIndex(col => col.status.id === Number(source.droppableId));
        const destColumnIndex = columns.findIndex(col => col.status.id === Number(destination.droppableId));

        if (sourceColumnIndex === -1 || destColumnIndex === -1) return;

        const sourceColumn = columns[sourceColumnIndex];
        const destColumn = columns[destColumnIndex];

        const sourceTasks = Array.from(sourceColumn.tasks);
        const taskIndex = sourceTasks.findIndex(t => t.id === Number(draggableId));

        if (taskIndex === -1) return;

        const [movedTask] = sourceTasks.splice(taskIndex, 1);

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

            setColumns(newColumns);

            try {
                setUpdating(true);

                await taskService.updateTaskStatus(movedTask.id, destColumn.status.id);

                showSuccess('Task Updated', `Task moved to ${destColumn.status.name}`);
                await loadData();
            } catch (error) {
                console.error('Failed to update task status:', error);
                showError('Update Failed', 'Failed to update task status');
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

            {columns.length === 0 ? (
                <div className="alert alert-info d-flex align-items-center justify-content-between" role="alert">
                    <div className="d-flex align-items-center">
                        <Icon icon="mdi:information-outline" width={24} className="me-2" />
                        <span>No task statuses found for this project. Please configure task statuses first.</span>
                    </div>
                </div>
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="board" type="COLUMN" direction="horizontal">
                        {(provided) => (
                            <div
                                className="board"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {columns.map((column, index) => (
                                    <Draggable
                                        key={column.status.id}
                                        draggableId={`column-${column.status.id}`}
                                        index={index}
                                        isDragDisabled={!canEdit || updating}
                                    >
                                        {(columnProvided) => (
                                            <div
                                                ref={columnProvided.innerRef}
                                                {...columnProvided.draggableProps}
                                                className="tasks"
                                            >
                                                <div className="task-header-container task-header">
                                                    {canEdit && (
                                                        <div
                                                            className="drag-handle"
                                                            {...columnProvided.dragHandleProps}
                                                            title="Drag to reorder"
                                                        >
                                                            <Icon icon="mdi:drag-vertical" width={20} />
                                                        </div>
                                                    )}

                                                    <h5 className="mt-0 text-uppercase d-flex align-items-center gap-2 flex-grow-1">
                                                        {column.status.color && (
                                                            <span
                                                                className="badge rounded-pill"
                                                                style={{ backgroundColor: column.status.color, width: '10px', height: '10px' }}
                                                            />
                                                        )}
                                                        {column.status.name} ({column.tasks.length})
                                                    </h5>

                                                    {canEdit && (
                                                        <div className="column-actions d-flex align-items-center gap-2">
                                                            <Icon
                                                                icon="mdi:pencil-outline"
                                                                width={18}
                                                                className="action-icon"
                                                                onClick={() => handleEditStatus(column.status)}
                                                                title="Edit status"
                                                            />
                                                            {!column.status.isDefault && (
                                                                <Icon
                                                                    icon="mdi:delete-outline"
                                                                    width={18}
                                                                    className="action-icon text-danger"
                                                                    onClick={() => handleDeleteStatus(column.status.id, column.status.name)}
                                                                    title="Delete status"
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <Droppable droppableId={String(column.status.id)} type="TASK">
                                                    {(taskProvided) => (
                                                        <div
                                                            ref={taskProvided.innerRef}
                                                            {...taskProvided.droppableProps}
                                                            style={{ minHeight: '100px' }}
                                                        >
                                                            {column.tasks.length === 0 && (
                                                                <p className="text-center text-muted pt-2 mb-0">No tasks</p>
                                                            )}

                                                            {column.tasks.map((task, taskIndex) => (
                                                                <Draggable
                                                                    key={task.id}
                                                                    draggableId={String(task.id)}
                                                                    index={taskIndex}
                                                                    isDragDisabled={!canEdit || updating}
                                                                >
                                                                    {(taskDragProvided) => (
                                                                        <div
                                                                            ref={taskDragProvided.innerRef}
                                                                            {...taskDragProvided.draggableProps}
                                                                            {...taskDragProvided.dragHandleProps}
                                                                            style={{
                                                                                ...taskDragProvided.draggableProps.style,
                                                                                marginTop: '1rem',
                                                                            }}
                                                                        >
                                                                            <Card
                                                                                className="mb-0 shadow-sm"
                                                                                style={{ cursor: 'pointer' }}
                                                                            >
                                                                                <Card.Body className="p-3">
                                                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                                                        <h6 className="mb-0 fw-semibold flex-grow-1">{task.title}</h6>
                                                                                        <div className="d-flex align-items-center gap-2">
                                                                                            {task.isMilestone && (
                                                                                                <Badge bg="warning" className="d-flex align-items-center gap-1">
                                                                                                    <Icon icon="mdi:flag" width={14} />
                                                                                                    <span>Milestone</span>
                                                                                                </Badge>
                                                                                            )}
                                                                                            <Badge bg={getPriorityColor(task.priority)}>
                                                                                                {getPriorityLabel(task.priority)}
                                                                                            </Badge>
                                                                                        </div>
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

                                                                                    <div className="d-flex align-items-center justify-content-between gap-3 mt-2 text-muted small">
                                                                                        <div className="d-flex align-items-center gap-3">
                                                                                            <div className="d-flex align-items-center gap-1">
                                                                                                <Icon icon="mdi:comment-outline" width={16} />
                                                                                                <span>{task.commentsCount}</span>
                                                                                            </div>

                                                                                            <div className="d-flex align-items-center gap-1">
                                                                                                <Icon icon="mdi:paperclip" width={16} />
                                                                                                <span>{task.filesCount}</span>
                                                                                            </div>

                                                                                            {task.watchersCount > 0 && (
                                                                                                <div className="d-flex align-items-center gap-1">
                                                                                                    <Icon icon="mdi:eye-outline" width={16} />
                                                                                                    <span>{task.watchersCount}</span>
                                                                                                </div>
                                                                                            )}
                                                                                        </div>

                                                                                        {canEdit && (
                                                                                            <Icon
                                                                                                icon="mdi:pencil-outline"
                                                                                                width={18}
                                                                                                className="text-primary"
                                                                                                style={{ cursor: 'pointer' }}
                                                                                                onClick={(e) => handleViewTask(e, task.id)}
                                                                                                title="Edit task"
                                                                                            />
                                                                                        )}
                                                                                    </div>
                                                                                </Card.Body>
                                                                            </Card>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {taskProvided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}

                                {canEdit && (
                                    <div className="tasks add-status-column">
                                        <div className="add-status-placeholder">
                                            <Button
                                                variant="outline-primary"
                                                className="add-status-btn"
                                                onClick={() => setShowCreateStatusModal(true)}
                                            >
                                                <Icon icon="mdi:plus" width={24} />
                                                <span>Add Status</span>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}

            <TaskModal
                show={showModal}
                onHide={() => setShowModal(false)}
                mode={modalMode}
                taskId={selectedTaskId}
                projectId={projectId}
                statuses={statuses}
                onSuccess={handleModalSuccess}
            />

            <CreateStatusModal
                show={showCreateStatusModal}
                onHide={() => setShowCreateStatusModal(false)}
                projectId={projectId}
                maxOrder={maxOrder}
                onSuccess={loadData}
            />

            <EditStatusModal
                show={showEditStatusModal}
                status={selectedStatus}
                onHide={() => setShowEditStatusModal(false)}
                onSuccess={loadData}
            />

            <style>{`
        .task-header-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .drag-handle {
          cursor: grab;
          color: #6c757d;
          display: flex;
          align-items: center;
          padding: 0.25rem;
        }

        .drag-handle:active {
          cursor: grabbing;
        }

        .drag-handle:hover {
          color: #495057;
        }

        .column-actions {
          opacity: 0;
          transition: opacity 0.2s;
        }

        .tasks:hover .column-actions {
          opacity: 1;
        }

        .action-icon {
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-icon:hover {
          transform: scale(1.2);
        }

        .add-status-column {
          min-width: 300px;
          max-width: 300px;
          background: transparent;
          border: 2px dashed #dee2e6;
          border-radius: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .add-status-placeholder {
          text-align: center;
          padding: 2rem;
        }

        .add-status-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          border: 2px dashed currentColor;
          background: transparent;
          transition: all 0.2s;
        }

        .add-status-btn:hover {
          background: rgba(var(--bs-primary-rgb), 0.1);
          transform: scale(1.05);
        }

        .add-status-btn span {
          font-size: 0.875rem;
          font-weight: 500;
        }
      `}</style>
        </>
    );
};

export default TaskKanbanBoard;
