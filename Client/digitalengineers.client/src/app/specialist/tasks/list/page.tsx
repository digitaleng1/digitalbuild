import { useState, useCallback, useMemo } from 'react';
import { Row, Col, Card, Dropdown, DropdownMenu, DropdownToggle, DropdownItem, FormControl, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ProjectSelector from '@/components/project/ProjectSelector';
import ProjectTaskStats from '@/components/project/ProjectTaskStats';
import TaskListSection from '@/components/task/TaskListSection';
import TaskSidePanel from '@/components/task/TaskSidePanel';
import TaskModal from '@/components/task/TaskModal';
import { useTaskList } from '@/hooks/useTaskList';
import { taskService } from '@/services/taskService';
import { useToast } from '@/contexts/ToastContext';
import { useAuthContext } from '@/common/context/useAuthContext';
import type { ProjectDto } from '@/types/project';
import '@/components/task/TaskList.css';

const ListPage = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { showSuccess, showError } = useToast();
  const { hasRole } = useAuthContext();
  
  // Specialists (Provider role) have read-only access
  const canEdit = !hasRole('Provider');

  const {
    statuses,
    groupedTasks,
    selectedTask,
    selectTask,
    isLoading,
    error,
    refresh,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useTaskList({ projectId: selectedProject?.id || 0 });

  const handleProjectSelect = useCallback((project: ProjectDto | null) => {
    setSelectedProject(project);
    selectTask(null);
  }, [selectTask]);

  const handleAddNew = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    setIsCreateModalOpen(false);
    refresh();
  }, [refresh]);

  const handleTaskUpdate = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleTaskMove = useCallback(async (taskId: number, newStatusId: number) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatusId);
      showSuccess('Task Moved', 'Task status updated successfully');
      refresh();
    } catch (error: any) {
      showError('Move Failed', error.response?.data?.message || 'Failed to move task');
      console.error('Error updating task status:', error);
    }
  }, [refresh, showSuccess, showError]);

  const sections = useMemo(() => 
    statuses.map((status, index) => (
      <div key={status.id} className={index === 0 ? 'mt-2' : index === statuses.length - 1 ? 'mt-4 mb-4' : 'mt-4'}>
        <TaskListSection
          status={status}
          tasks={groupedTasks[status.id] || []}
          selectedTask={selectedTask}
          onSelectTask={selectTask}
          onTaskMove={handleTaskMove}
        />
      </div>
    )),
    [statuses, groupedTasks, selectedTask, selectTask, handleTaskMove]
  );

  return (
    <>
      <PageBreadcrumb
        title="Task List"
        subName="Specialist"
      />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <ProjectSelector onProjectSelect={handleProjectSelect} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedProject && (
        <>
          <ProjectTaskStats projectId={selectedProject.id} project={selectedProject} />

          <Row>
            <Col>
              <div className="page-title-box">
                <div className="page-title-right">
                  <form>
                    <InputGroup>
                      <FormControl 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Dropdown>
                        <DropdownToggle
                          className="input-group-text btn btn-secondary"
                          type="button"
                        >
                          <i className="uil uil-sort-amount-down" />
                        </DropdownToggle>
                        <DropdownMenu align={'end'}>
                          <DropdownItem 
                            active={sortBy === 'dueDate'}
                            onClick={() => setSortBy('dueDate')}
                          >
                            Due Date
                          </DropdownItem>
                          <DropdownItem 
                            active={sortBy === 'priority'}
                            onClick={() => setSortBy('priority')}
                          >
                            Priority
                          </DropdownItem>
                          <DropdownItem 
                            active={sortBy === 'createdDate'}
                            onClick={() => setSortBy('createdDate')}
                          >
                            Created Date
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </InputGroup>
                  </form>
                </div>
                <h4 className="page-title">
                  Tasks
                  {canEdit && (
                    <Link 
                      to="#" 
                      className="btn btn-success btn-sm ms-3"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddNew();
                      }}
                    >
                      Add New
                    </Link>
                  )}
                </h4>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading tasks...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : statuses.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <p>No statuses configured for this project</p>
                </div>
              ) : (
                sections
              )}
            </Col>
          </Row>
        </>
      )}

      {selectedProject && (
        <>
          <TaskSidePanel
            taskId={selectedTask?.id || null}
            projectId={selectedProject.id}
            statuses={statuses}
            onSuccess={handleTaskUpdate}
            onClose={() => selectTask(null)}
          />

          {canEdit && (
            <TaskModal
              show={isCreateModalOpen}
              onHide={() => setIsCreateModalOpen(false)}
              mode="create"
              projectId={selectedProject.id}
              statuses={statuses}
              onSuccess={handleCreateSuccess}
            />
          )}
        </>
      )}
    </>
  );
};

export default ListPage;
