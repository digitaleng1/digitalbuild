import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { PageBreadcrumb } from '@/components';
import TaskKanbanBoard from '@/components/task/TaskKanbanBoard';
import type { ProjectDto } from '@/types/project';
import { projectService } from '@/services/projectService';

const ProjectTasksPage = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  
  const [project, setProject] = useState<ProjectDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const data = await projectService.getProjectById(projectId);
        setProject(data);
      } catch (error) {
        console.error('Failed to load project:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    // TODO: Open TaskModal
  };

  const handleCreateTask = () => {
    // TODO: Open CreateTaskModal
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

  if (!project) {
    return (
      <div className="alert alert-danger" role="alert">
        <Icon icon="mdi:alert-circle-outline" width={20} className="me-2" />
        Project not found
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb
        title="Project Tasks"
        subName={project.name}
        breadCrumbItems={[
          { label: 'Projects', path: '/admin/projects' },
          { label: project.name, path: `/admin/projects/details/${project.id}` },
          { label: 'Tasks', active: true },
        ]}
      />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="mb-1">{project.name}</h4>
                  <p className="text-muted mb-0">Manage project tasks using kanban board</p>
                </div>
                <Button variant="primary" onClick={handleCreateTask}>
                  <Icon icon="mdi:plus" width={20} className="me-1" />
                  Create Task
                </Button>
              </div>

              <TaskKanbanBoard 
                projectId={projectId} 
                canEdit={true}
                onTaskClick={handleTaskClick}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProjectTasksPage;
