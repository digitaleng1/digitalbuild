import { useState } from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import ProjectSelector from '@/components/project/ProjectSelector';
import type { ProjectDto } from '@/types/project';

const ListPage = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);

  return (
    <>
      <PageBreadcrumb
        title="Task List"
        subName="Admin"
      />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <ProjectSelector onProjectSelect={setSelectedProject} />

              {selectedProject && (
                <div className="mt-4">
                  <Alert variant="info" className="text-center">
                    <i className="ri-list-check me-2" style={{ fontSize: '24px' }}></i>
                    <span>List view coming soon...</span>
                  </Alert>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ListPage;
