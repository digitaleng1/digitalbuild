import { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ProjectSelector from '@/components/project/ProjectSelector';
import TaskTreeView from '@/components/task/TaskTreeView';
import { useAuthContext } from '@/common/context/useAuthContext';
import type { ProjectDto } from '@/types/project';

const TreePage = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);
  const { hasRole } = useAuthContext();
  
  // Specialists (Provider role) have read-only access
  const canEdit = !hasRole('Provider');

  return (
    <>
      <PageBreadcrumb
        title="Task Tree"
        subName="Specialist"
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
