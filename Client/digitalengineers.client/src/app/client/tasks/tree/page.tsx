import { useState } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ProjectSelector from '@/components/project/ProjectSelector';
import TaskTreeView from '@/components/task/TaskTreeView';
import type { ProjectDto } from '@/types/project';
import { canClientEditTasks } from '@/utils/projectUtils';

const TreePage = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);
  const canEdit = selectedProject ? canClientEditTasks(selectedProject) : false;

  return (
    <>
      <PageBreadcrumb
        title="Task Tree"
        subName="Client"
      />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <ProjectSelector onProjectSelect={setSelectedProject} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedProject && !canEdit && (
        <Row>
          <Col>
            <Alert variant="info" className="d-flex align-items-center">
              <Icon icon="mdi:information-outline" width={24} className="me-2" />
              <div>
                <strong>View-Only Mode:</strong> This project is managed by Novobid team.
                You can view tasks but cannot edit or create new ones.
              </div>
            </Alert>
          </Col>
        </Row>
      )}

      {selectedProject && (
        <TaskTreeView 
          projectId={selectedProject.id}
          project={selectedProject}
          canEdit={canEdit}
        />
      )}
    </>
  );
};

export default TreePage;
