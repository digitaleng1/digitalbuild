import { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ProjectSelector from '@/components/project/ProjectSelector';
import TaskTreeView from '@/components/task/TaskTreeView';
import type { ProjectDto } from '@/types/project';

const TreePage = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);

  return (
    <>
      <PageBreadcrumb
        title="Task Tree"
        subName="Admin"
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
          canEdit={true}
        />
      )}
    </>
  );
};

export default TreePage;
