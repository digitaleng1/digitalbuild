import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Spinner, Alert, ButtonGroup, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import TaskKanbanBoard from '@/components/task/TaskKanbanBoard';
import TaskListView from '@/components/task/TaskListView';
import projectService from '@/services/projectService';
import type { ProjectDetailsDto } from '@/types/project';

type ViewMode = 'kanban' | 'list';

const ProjectTasksPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError('Project ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const projectData = await projectService.getProjectById(Number(id));
        setProject(projectData);
      } catch (err) {
        console.error('Failed to load project:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <>
        <PageBreadcrumb
          title="Project Tasks"
          subName="Projects"
        />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <PageBreadcrumb
          title="Project Tasks"
          subName="Projects"
        />
        <Alert variant="danger" className="d-flex align-items-center">
          <Icon icon="mdi:alert-circle-outline" width={24} className="me-2" />
          {error || 'Project not found'}
        </Alert>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb
        title={`${project.name} - Tasks`}
        subName="Projects"
      />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-end mb-3">
                <ButtonGroup>
                  <Button
                    variant={viewMode === 'kanban' ? 'primary' : 'outline-primary'}
                    onClick={() => setViewMode('kanban')}
                    className="d-flex align-items-center gap-1"
                  >
                    <Icon icon="mdi:view-column" width={18} />
                    <span>Kanban</span>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                    onClick={() => setViewMode('list')}
                    className="d-flex align-items-center gap-1"
                  >
                    <Icon icon="mdi:view-list" width={18} />
                    <span>List</span>
                  </Button>
                </ButtonGroup>
              </div>

              {viewMode === 'kanban' ? (
                <TaskKanbanBoard
                  projectId={Number(id)}
                  project={project}
                  canEdit={true}
                  onTaskClick={(taskId) => console.log('Task clicked:', taskId)}
                />
              ) : (
                <TaskListView
                  projectId={Number(id)}
                  project={project}
                  canEdit={true}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProjectTasksPage;
