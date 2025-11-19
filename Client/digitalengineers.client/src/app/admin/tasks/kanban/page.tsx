import { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import TaskKanbanBoard from '@/components/task/TaskKanbanBoard';
import ProjectSelector from '@/components/project/ProjectSelector';
import type { ProjectDto } from '@/types/project';

const KanbanPage = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectDto | null>(null);

  return (
    <>
      <PageBreadcrumb
        title="Kanban Board"
        subName="Admin"
      />

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <ProjectSelector onProjectSelect={setSelectedProject} />

              {selectedProject && (
                <div className="mt-4">
                  <TaskKanbanBoard 
                    projectId={selectedProject.id}
                    project={selectedProject}
                    canEdit={true}
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
