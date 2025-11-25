import { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import TaskKanbanBoard from '@/components/task/TaskKanbanBoard';
import ProjectSelector from '@/components/project/ProjectSelector';
import type { ProjectDto } from '@/types/project';
import { canClientEditTasks } from '@/utils/projectUtils';
import { Alert } from 'react-bootstrap';
import { Icon } from '@iconify/react';

const KanbanPage = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);

  const canEdit = selectedProject ? canClientEditTasks(selectedProject) : false;

  return (
    <>
      <PageBreadcrumb
        title="Kanban Board"
        subName="Client"
      />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <ProjectSelector onProjectSelect={setSelectedProject} />

              {selectedProject && (
                <div className="mt-4">
                  {!canEdit && (
                    <Alert variant="info" className="d-flex align-items-center mb-3">
                      <Icon icon="mdi:information-outline" width={24} className="me-2" />
                      <div>
                        <strong>View-Only Mode:</strong> This project is managed by Digital Engineers. 
                        You can view tasks but cannot edit or create new ones.
                      </div>
                    </Alert>
                  )}

                  <TaskKanbanBoard 
                    projectId={selectedProject.id}
                    project={selectedProject}
                    canEdit={canEdit}
                    onTaskClick={(taskId) => console.log('Task clicked:', taskId)}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default KanbanPage;
