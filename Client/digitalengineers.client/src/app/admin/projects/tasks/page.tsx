import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import TaskKanbanBoard from '@/components/task/TaskKanbanBoard';
import projectService from '@/services/projectService';
import type { ProjectDetailsDto } from '@/types/project';

const ProjectTasksPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetailsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              <TaskKanbanBoard
                projectId={Number(id)}
                project={project}
                canEdit={true}
                onTaskClick={(taskId) => console.log('Task clicked:', taskId)}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProjectTasksPage;
