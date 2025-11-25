import { useState, useEffect, useCallback } from 'react';
import { Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import type { TaskViewModel, ProjectTaskStatusViewModel } from '@/types/task';
import type { ProjectDto } from '@/types/project';
import { taskService } from '@/services/taskService';
import TaskListSection from './TaskListSection';
import TaskSidePanel from './TaskSidePanel';
import TaskModal from './TaskModal';
import ProjectTaskStats from '@/components/project/ProjectTaskStats';
import { useToast } from '@/contexts/ToastContext';

interface TaskListViewProps {
    projectId: number;
    project: ProjectDto;
    canEdit?: boolean;
}

const TaskListView = ({ projectId, project, canEdit = true }: TaskListViewProps) => {
    const [statuses, setStatuses] = useState<ProjectTaskStatusViewModel[]>([]);
    const [tasks, setTasks] = useState<TaskViewModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<TaskViewModel | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedTaskId, setSelectedTaskId] = useState<number | undefined>();
    const { showSuccess, showError } = useToast();

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const statusList = await taskService.getStatusesByProject(projectId);
            setStatuses(statusList);

            let taskList: TaskViewModel[] = [];
            try {
                taskList = await taskService.getTasksByProject(projectId);
            } catch (err) {
                console.error('Failed to load tasks:', err);
            }

            setTasks(taskList);
        } catch (err) {
            console.error('Failed to load data:', err);
            setError('Failed to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSelectTask = useCallback((task: TaskViewModel) => {
        setSelectedTask(task);
    }, []);

    const handleTaskMove = useCallback(async (taskId: number, newStatusId: number) => {
        try {
            await taskService.updateTaskStatus(taskId, newStatusId);
            showSuccess('Task Updated', 'Task status updated successfully');
            await loadData();
        } catch (err) {
            console.error('Failed to update task status:', err);
            showError('Update Failed', 'Failed to update task status');
        }
    }, [loadData, showSuccess, showError]);

    const handleCreateTask = useCallback(() => {
        setSelectedTaskId(undefined);
        setModalMode('create');
        setShowModal(true);
    }, []);

    const handleClosePanel = useCallback(() => {
        setSelectedTask(null);
    }, []);

    const handleModalSuccess = useCallback(() => {
        loadData();
    }, [loadData]);

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
            <Alert variant="danger" className="d-flex align-items-center">
                <Icon icon="mdi:alert-circle-outline" width={20} className="me-2" />
                {error}
            </Alert>
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

            {statuses.length === 0 ? (
                <Alert variant="info" className="d-flex align-items-center">
                    <Icon icon="mdi:information-outline" width={24} className="me-2" />
                    <span>No task statuses found for this project. Please configure task statuses first.</span>
                </Alert>
            ) : (
                <Row>
                    <Col xxl={selectedTask ? 8 : 12} xl={selectedTask ? 7 : 12}>
                        {statuses.map((status, index) => {
                            const statusTasks = tasks.filter(t => t.statusId === status.id);
                            return (
                                <div key={status.id} className={index > 0 ? 'mt-4' : ''}>
                                    <TaskListSection
                                        status={status}
                                        tasks={statusTasks}
                                        selectedTask={selectedTask}
                                        onSelectTask={handleSelectTask}
                                        onTaskMove={handleTaskMove}
                                    />
                                </div>
                            );
                        })}
                    </Col>

                    {selectedTask && (
                        <Col xxl={4} xl={5}>
                            <TaskSidePanel
                                taskId={selectedTask.id}
                                projectId={projectId}
                                statuses={statuses}
                                onSuccess={loadData}
                                onClose={handleClosePanel}
                            />
                        </Col>
                    )}
                </Row>
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
        </>
    );
};

export default TaskListView;
